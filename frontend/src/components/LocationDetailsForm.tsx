import { useState, useEffect } from "react";
import { FormField, FormSection } from "@/components/common/forms";
import { MapPinIcon, GlobeIcon } from "@/components/icons";
import { locationAPI } from "@/lib/api";
import { SlSelect, SlOption, SlButton, SlButtonGroup } from '@shoelace-style/shoelace/dist/react';
import {
  FormContainer,
  SearchInstructions,
  ValidationMessages,
  NoResultsContainer,
  NoResultsTitle,
  NoResultsSubtitle,
  BuildingSection,
  BuildingLabel,
  BuildingError
} from "./LocationDetailsForm/styles";

import {
  AuthCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/styles/shared";

export interface LocationDetails {
  country: string;
  zipcode: string;
  state: string;
  city: string;
  apartmentName: string;
  buildingName: string;
}

interface LocationDetailsFormProps {
  onLocationComplete: (details: LocationDetails) => void;
  onCancel?: () => void;
  initialValues?: Partial<LocationDetails>;
}

interface ApartmentOption {
  id: string;
  name: string;
  buildings: BuildingOption[];
}

interface BuildingOption {
  id: string;
  name: string;
}

export default function LocationDetailsForm({ onLocationComplete, onCancel, initialValues }: LocationDetailsFormProps) {
  const [formData, setFormData] = useState<LocationDetails>({
    country: initialValues?.country || "",
    zipcode: initialValues?.zipcode || "",
    state: initialValues?.state || "",
    city: initialValues?.city || "",
    apartmentName: initialValues?.apartmentName || "",
    buildingName: initialValues?.buildingName || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingZipcode, setIsLoadingZipcode] = useState(false);
  const [isLoadingApartments, setIsLoadingApartments] = useState(false);
  const [apartmentOptions, setApartmentOptions] = useState<ApartmentOption[]>([]);
  const [buildingOptions, setBuildingOptions] = useState<BuildingOption[]>([]);
  const [apartmentSearchTerm, setApartmentSearchTerm] = useState(initialValues?.apartmentName || "");
  const [showApartmentDropdown, setShowApartmentDropdown] = useState(false);
  const [hasSearchedApartments, setHasSearchedApartments] = useState(!!initialValues?.apartmentName);
  const [isApartmentSelected, setIsApartmentSelected] = useState(!!initialValues?.apartmentName);

  // Auto-detect country from location only if no initial values
  useEffect(() => {
    // Skip auto-detection if we already have initial values
    if (initialValues?.country) {
      return;
    }

    const detectCountry = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                // Use reverse geocoding to get country
                const response = await fetch(
                  `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
                );
                const data = await response.json();
                setFormData(prev => ({ ...prev, country: data.countryName || "India" }));
              } catch (error) {
                console.error("Error detecting country:", error);
                setFormData(prev => ({ ...prev, country: "India" }));
              }
            },
            () => {
              // Default to US if geolocation fails
              setFormData(prev => ({ ...prev, country: "India" }));
            }
          );
        } else {
          setFormData(prev => ({ ...prev, country: "India" }));
        }
      } catch (error) {
        setFormData(prev => ({ ...prev, country: "India" }));
      }
    };

    detectCountry();
  }, [initialValues?.country]);

  // Auto-fill state and city when zipcode changes
  useEffect(() => {
    const fetchLocationByZipcode = async () => {
      if (formData.zipcode.length >= 5) {
        setIsLoadingZipcode(true);
        try {
          const data = await locationAPI.getLocationByZipcode(formData.zipcode, formData.country);
          setFormData(prev => ({
            ...prev,
            state: data.state,
            city: data.city
          }));
          setErrors(prev => ({ ...prev, zipcode: "", state: "", city: "" }));
        } catch (error) {
          console.error("Error fetching location:", error);
          setErrors(prev => ({ ...prev, zipcode: "Invalid zipcode for selected country" }));
        } finally {
          setIsLoadingZipcode(false);
        }
      }
    };

    fetchLocationByZipcode();
  }, [formData.zipcode, formData.country]);

  // Fetch apartments and buildings when there are initial values
  useEffect(() => {
    if (initialValues?.apartmentName && initialValues?.zipcode && initialValues?.country) {
      fetchApartments(initialValues.apartmentName);
    }
  }, [initialValues?.apartmentName, initialValues?.zipcode, initialValues?.country]);

  // Fetch apartments from API - now triggered manually
  const fetchApartments = async (searchTerm?: string) => {
    // Validate required fields before searching
    if (!formData.country) {
      setErrors(prev => ({ ...prev, country: "Country is required for apartment search" }));
      return;
    }

    if (!formData.zipcode || formData.zipcode.length < 5) {
      setErrors(prev => ({ ...prev, zipcode: "Valid zipcode is required for apartment search" }));
      return;
    }

    setIsLoadingApartments(true);
    try {
      // Pass both search term and zipcode to filter apartments
      const apartments = await locationAPI.getApartments(searchTerm, formData.zipcode);

      // Ensure we always have an array
      const apartmentList = Array.isArray(apartments) ? apartments : [];
      setApartmentOptions(apartmentList);
      setHasSearchedApartments(true);

      // Clear errors if successful
      setErrors(prev => ({ ...prev, country: "", zipcode: "" }));

      if (apartmentList.length === 0) {
        setErrors(prev => ({ ...prev, apartmentName: "No apartments found in this area. Try a different search term." }));
        setShowApartmentDropdown(false); // Hide dropdown if no results
      } else {
        // Clear apartment error if we found results
        setErrors(prev => ({ ...prev, apartmentName: "" }));
        // Show dropdown with results after successful fetch
        setShowApartmentDropdown(true);
      }
    } catch (error) {
      console.error("Error fetching apartments:", error);
      setErrors(prev => ({ ...prev, apartmentName: "Failed to fetch apartments. Please try again." }));

      setHasSearchedApartments(true);
      // Show dropdown with fallback data
      setShowApartmentDropdown(true);
    } finally {
      setIsLoadingApartments(false);
    }
  };

  // Remove the auto-search effect that was triggered by typing
  // Auto-search when zipcode is valid and user has typed 2-3 characters in apartment search
  // useEffect(() => {
  //   if (apartmentSearchTerm.length >= 2 && formData.zipcode && formData.country) {
  //     const debounceTimer = setTimeout(() => {
  //       fetchApartments(apartmentSearchTerm);
  //     }, 500); // Debounce for 500ms
  //
  //     return () => clearTimeout(debounceTimer);
  //   }
  // }, [apartmentSearchTerm, formData.zipcode, formData.country]);

  // Remove the old useEffect that automatically fetched apartments
  // This is now replaced with manual search functionality

  // Filter apartments based on search term (with safety check)
  const filteredApartments = (Array.isArray(apartmentOptions) ? apartmentOptions : []).filter(apt =>
    apt.name.toLowerCase().includes(apartmentSearchTerm.toLowerCase())
  );

  const handleApartmentSelect = (apartment: ApartmentOption) => {
    setFormData(prev => ({ ...prev, apartmentName: apartment.name, buildingName: "" }));
    setBuildingOptions(apartment.buildings);
    setApartmentSearchTerm(apartment.name);
    setShowApartmentDropdown(false);
    setIsApartmentSelected(true);
  };

  const handleBuildingSelect = (building: BuildingOption) => {
    setFormData(prev => ({ ...prev, buildingName: building.name }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "apartmentName") {
      setApartmentSearchTerm(value);
      setFormData(prev => ({ ...prev, [name]: value, buildingName: "" }));
      setBuildingOptions([]);
      setIsApartmentSelected(false);
      // Don't automatically show dropdown - only show after search button click
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.zipcode) newErrors.zipcode = "Zipcode is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.apartmentName) newErrors.apartmentName = "Apartment name is required";
    if (!formData.buildingName) newErrors.buildingName = "Building name is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onLocationComplete(formData);
  };

  return (
    <AuthCard>
      <CardHeader slot="header">
        <CardTitle>Location Details</CardTitle>
        <CardDescription>
          Please provide your location and apartment details to continue with registration.
        </CardDescription>
      </CardHeader>
      <CardContent>

        <FormContainer onSubmit={handleSubmit}>
          {/* Location Information */}
          <FormSection
            title="Location Information"
            description="Your geographical location details"
          >
            <FormField
              id="country"
              name="country"
              type="text"
              label="Country"
              placeholder="Enter country"
              value={formData.country}
              onChange={handleChange}
              required
              error={errors.country}
              icon={<GlobeIcon />}
              readOnly
            />

            <FormField
              id="zipcode"
              name="zipcode"
              type="text"
              label="Zipcode"
              placeholder="Enter zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              required
              error={errors.zipcode}
              icon={<MapPinIcon />}
              helperText={isLoadingZipcode ? "Looking up location..." :
                formData.country.toLowerCase().includes('india') ? "Enter 6-digit PIN code" :
                  formData.country.toLowerCase().includes('canada') ? "Enter postal code (e.g., K1A 0A6)" :
                    formData.country.toLowerCase().includes('uk') ? "Enter postcode (e.g., SW1A 1AA)" :
                      "Enter zipcode"
              }
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <FormField
                id="state"
                name="state"
                type="text"
                label="State"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                required
                error={errors.state}
                icon={<MapPinIcon />}
                readOnly
              />

              <FormField
                id="city"
                name="city"
                type="text"
                label="City"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
                error={errors.city}
                icon={<MapPinIcon />}
                readOnly
              />
            </div>
            
            {/* Search Apartments Button */}
            <div style={{ marginTop: "16px" }}>
              <SlButton
                variant="primary"
                onClick={() => fetchApartments(apartmentSearchTerm || undefined)}
                disabled={!formData.country || !formData.zipcode || isLoadingApartments}
              >
                {isLoadingApartments ? "🔄 Searching..." : "🔍 Search Apartments"}
              </SlButton>
              
              {/* Validation Messages */}
              {(!formData.country || !formData.zipcode) && (
                <ValidationMessages>
                  {!formData.country && "Country required"}
                  {!formData.country && !formData.zipcode && " • "}
                  {!formData.zipcode && "Zipcode required"}
                </ValidationMessages>
              )}
            </div>
          </FormSection>

          {/* Apartment Information */}
          <FormSection
            title="Apartment Information"
            description="Search for your apartment complex and building"
          >
            {/* Search Instructions */}
            {!hasSearchedApartments && (
              <SearchInstructions>
                💡 <strong>How to search:</strong> After entering your location details above, enter apartment name below and click the "Search Apartments" button in the Location section.
              </SearchInstructions>
            )}

            {/* Apartment Search Field */}
            <div style={{ marginBottom: "16px", position: "relative" }}>
              {/* Show dropdown as SlSelect when apartments are available */}
              {showApartmentDropdown && filteredApartments.length > 0 && !isApartmentSelected ? (
                <div>
                  {/* <FormField
                    id="apartmentName"
                    name="apartmentName"
                    type="text"
                    label="Apartment Name"
                    placeholder="Enter apartment name"
                    value={apartmentSearchTerm}
                    onChange={(e) => {
                      setApartmentSearchTerm(e.target.value);
                      setFormData(prev => ({ ...prev, apartmentName: e.target.value, buildingName: "" }));
                      setBuildingOptions([]);
                      setIsApartmentSelected(false);

                      // Clear error when user starts typing
                      if (errors.apartmentName) {
                        setErrors(prev => ({ ...prev, apartmentName: '' }));
                      }
                    }}
                    required
                    error={errors.apartmentName}
                    icon={<MapPinIcon />}
                  /> */}
                  
                  <SlSelect
                    placeholder="Select from available apartments"
                    onSlChange={(e: any) => {
                      const selectedApt = filteredApartments.find(apt => apt.id === e.target.value);
                      if (selectedApt) {
                        handleApartmentSelect(selectedApt);
                      }
                    }}
                    style={{ marginTop: "8px" }}
                  >
                    {filteredApartments.map((apt) => (
                      <SlOption key={apt.id} value={apt.id}>
                        {apt.name} ({apt.buildings.length} building{apt.buildings.length !== 1 ? 's' : ''})
                      </SlOption>
                    ))}
                  </SlSelect>
                </div>
              ) : (
                <FormField
                  id="apartmentName"
                  name="apartmentName"
                  type="text"
                  label="Apartment Name"
                  placeholder="Enter apartment name"
                  value={apartmentSearchTerm}
                  onChange={(e) => {
                    setApartmentSearchTerm(e.target.value);
                    setFormData(prev => ({ ...prev, apartmentName: e.target.value, buildingName: "" }));
                    setBuildingOptions([]);
                    setIsApartmentSelected(false);

                    // Clear error when user starts typing
                    if (errors.apartmentName) {
                      setErrors(prev => ({ ...prev, apartmentName: '' }));
                    }
                  }}
                  required
                  error={errors.apartmentName}
                  icon={<MapPinIcon />}
                  readOnly={true}
                />
              )}
            </div>

            {/* No Results Message */}
            {hasSearchedApartments && apartmentOptions.length === 0 && !isLoadingApartments && (
              <NoResultsContainer>
                <NoResultsTitle>🏢 No apartments found</NoResultsTitle>
                <NoResultsSubtitle>
                  Try adjusting your search term or check if the zipcode is correct
                </NoResultsSubtitle>
              </NoResultsContainer>
            )}

            {/* Building Selection */}
            <BuildingSection>
              <BuildingLabel>Building Name *</BuildingLabel>
              {buildingOptions.length > 0 ? (
                <SlSelect
                  value={formData.buildingName}
                  onSlChange={(e: any) => handleBuildingSelect({ id: e.target.value, name: e.target.value })}
                  placeholder="Select a building"
                >
                  {buildingOptions.map((building) => (
                    <SlOption key={building.id} value={building.name}>
                      {building.name}
                    </SlOption>
                  ))}
                </SlSelect>
              ) : (
                <FormField
                  id="buildingName"
                  name="buildingName"
                  type="text"
                  label=""
                  placeholder="Building name will be available after selecting apartment"
                  value={formData.buildingName}
                  onChange={handleChange}
                  error={errors.buildingName}
                  icon={<MapPinIcon />}
                  readOnly={true}
                />
              )}
              {errors.buildingName && (
                <BuildingError>{errors.buildingName}</BuildingError>
              )}
            </BuildingSection>
          </FormSection>

          <SlButtonGroup label="Form Actions" style={{ marginTop: "24px" }}>
            {onCancel && (
              <SlButton variant="default" onClick={onCancel}>
                Cancel
              </SlButton>
            )}
            <SlButton type="submit" variant="primary">
              Continue to Registration
            </SlButton>
          </SlButtonGroup>
        </FormContainer>
      </CardContent>
    </AuthCard>
  );
}