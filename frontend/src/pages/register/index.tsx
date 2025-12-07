import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "@/lib/api";
import Header from "@/components/Header";
import LocationDetailsForm from "@/components/LocationDetailsForm";
import { UserIcon, MailIcon, PhoneIcon, HomeIcon, BuildingIcon, LockIcon } from "@/components/icons";
import { FormField, FormSection } from "@/components/common/forms";
import AdCarousel from "@/components/common/AdCarousel";
import QuickAccessButtons from "@/components/common/ui/QuickAccessButtons";
import RememberMeCheckbox from "@/components/common/ui/RememberMeCheckbox";
import TermsCheckbox from "@/components/common/ui/TermsCheckbox";
import NotificationCheckbox from "@/components/common/ui/NotificationCheckbox";
import PasswordStrength from "@/components/common/forms/PasswordStrength";
import AuthNavigation from "@/components/common/AuthNavigation";
import { useToast } from "@/contexts/ToastContext";
import {
  validateRegistrationForm,
  transformRegistrationData,
  handleRegistrationError
} from "@/utils/register-helper";
import { REGISTER_CONSTANTS, NAVIGATION_ROUTES } from "@/constants";
import type { FormData, FormErrors, LocationDetails } from "@/types/auth";
import {
  FormContainer,
  FormFieldGrid,
  SuccessMessage,
  LoadingSpinner,
  StyledForm,
  LocationSummary,
  LocationGrid,
  EditButton,
  SubmitButton
} from "./styles";
import {
  PageContainer,
  FormWrapper,
  ErrorMessage,
  AuthCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/styles/shared";

export default function RegisterPage() {
  const [step, setStep] = useState<'location' | 'registration'>('location');
  const [locationDetails, setLocationDetails] = useState<LocationDetails | null>(null);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    phone: "",
    apartmentName: "",
    buildingName: "",
    flatNumber: "",
    floorNumber: "",
    agreeToTerms: false,
    subscribeToNotifications: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  const handleLocationComplete = (details: LocationDetails) => {
    setLocationDetails(details);
    setFormData(prev => ({
      ...prev,
      apartmentName: details.apartmentName,
      buildingName: details.buildingName,
      locationDetails: details
    }));
    setStep('registration');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation using helper function
    const validationErrors = validateRegistrationForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the validation errors before submitting.");
      return;
    }

    setError("");
    setErrors({});
    setIsLoading(true);

    try {
      // Transform form data using helper function
      const registrationData = transformRegistrationData(formData);
      await authAPI.register(registrationData);

      // Handle successful registration
      setSuccess(true);
      toast.success("Registration successful! Redirecting to login page...");
      setTimeout(() => {
        navigate(NAVIGATION_ROUTES.login, {
          state: {
            message: REGISTER_CONSTANTS.page.success.redirect
          }
        });
      }, 2000);

    } catch (err: any) {
      // Handle errors using helper function
      const { generalError, fieldErrors } = handleRegistrationError(err);
      setError(generalError);
      setErrors(fieldErrors);

      // Show toast notification for registration failure
      toast.error(generalError || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const fieldErrors = validateRegistrationForm(formData);
    if (fieldErrors[name]) {
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
    }
  };

  return (
    <>
      <Header variant="auth" />
      <PageContainer>
        <AdCarousel />

        <FormWrapper>

          <AuthNavigation
            text={REGISTER_CONSTANTS.links.hasAccount}
            buttonText={REGISTER_CONSTANTS.buttons.signin}
            onButtonClick={() => navigate(NAVIGATION_ROUTES.login)}
          />

          {step === 'location' ? (
            <LocationDetailsForm
              onLocationComplete={handleLocationComplete}
              initialValues={locationDetails || undefined}
            />
          ) : (
            <AuthCard>
              <CardHeader slot="header">
                <CardTitle>{REGISTER_CONSTANTS.page.title}</CardTitle>
                <CardDescription>{REGISTER_CONSTANTS.page.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <StyledForm onSubmit={handleSubmit}>
                  <FormContainer>

                    {/* Location Details Summary (Read-only) */}
                    {locationDetails && (
                      <FormSection
                        title="Location Details"
                        description="Your confirmed location and apartment information"
                      >
                        <LocationSummary>
                          <LocationGrid>
                            <div><strong>Country:</strong> {locationDetails.country}</div>
                            <div><strong>Zipcode:</strong> {locationDetails.zipcode}</div>
                            <div><strong>State:</strong> {locationDetails.state}</div>
                            <div><strong>City:</strong> {locationDetails.city}</div>
                            <div><strong>Apartment:</strong> {locationDetails.apartmentName}</div>
                            <div><strong>Building:</strong> {locationDetails.buildingName}</div>
                          </LocationGrid>
                          <EditButton
                            type="button"
                            variant="default"
                            onClick={() => setStep('location')}
                          >
                            Edit Location
                          </EditButton>
                        </LocationSummary>
                      </FormSection>
                    )}

                    {/* Personal Information Section */}
                    <FormSection
                      title={REGISTER_CONSTANTS.sections.personal.title}
                      description={REGISTER_CONSTANTS.sections.personal.description}
                    >
                      <FormField
                        id="name"
                        name="name"
                        type="text"
                        label={REGISTER_CONSTANTS.fields.name.label}
                        placeholder={REGISTER_CONSTANTS.fields.name.placeholder}
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        error={errors.name}
                        icon={<UserIcon />}
                      />

                      <FormField
                        id="email"
                        name="email"
                        type="email"
                        label={REGISTER_CONSTANTS.fields.email.label}
                        placeholder={REGISTER_CONSTANTS.fields.email.placeholder}
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        autoComplete="email"
                        error={errors.email}
                        icon={<MailIcon />}
                      />

                      <FormField
                        id="phone"
                        name="phone"
                        type="tel"
                        label={REGISTER_CONSTANTS.fields.phone.label}
                        placeholder={REGISTER_CONSTANTS.fields.phone.placeholder}
                        value={formData.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        error={errors.phone}
                        helperText={REGISTER_CONSTANTS.fields.phone.helper}
                        icon={<PhoneIcon />}
                      />
                    </FormSection>

                    {/* Apartment Information Section */}
                    <FormSection
                      title={REGISTER_CONSTANTS.sections.apartment.title}
                      description={REGISTER_CONSTANTS.sections.apartment.description}
                    >
                      <FormField
                        id="apartmentName"
                        name="apartmentName"
                        type="text"
                        label={REGISTER_CONSTANTS.fields.apartmentName.label}
                        placeholder={REGISTER_CONSTANTS.fields.apartmentName.placeholder}
                        value={formData.apartmentName}
                        onChange={handleChange}
                        error={errors.apartmentName}
                        helperText={REGISTER_CONSTANTS.fields.apartmentName.helper}
                        icon={<HomeIcon />}
                        readOnly
                      />

                      <FormField
                        id="buildingName"
                        name="buildingName"
                        type="text"
                        label={REGISTER_CONSTANTS.fields.buildingName.label}
                        placeholder={REGISTER_CONSTANTS.fields.buildingName.placeholder}
                        value={formData.buildingName}
                        onChange={handleChange}
                        error={errors.buildingName}
                        helperText={REGISTER_CONSTANTS.fields.buildingName.helper}
                        icon={<HomeIcon />}
                        readOnly
                      />

                      <FormFieldGrid>
                        <FormField
                          id="flatNumber"
                          name="flatNumber"
                          type="text"
                          label={REGISTER_CONSTANTS.fields.flatNumber.label}
                          placeholder={REGISTER_CONSTANTS.fields.flatNumber.placeholder}
                          value={formData.flatNumber}
                          onChange={handleChange}
                          error={errors.flatNumber}
                          required
                          helperText={REGISTER_CONSTANTS.fields.flatNumber.helper}
                          icon={<HomeIcon />}
                        />

                        <FormField
                          id="floorNumber"
                          name="floorNumber"
                          type="number"
                          label={REGISTER_CONSTANTS.fields.floor.label}
                          placeholder={REGISTER_CONSTANTS.fields.floor.placeholder}
                          value={formData.floorNumber}
                          onChange={handleChange}
                          error={errors.floorNumber}
                          helperText={REGISTER_CONSTANTS.fields.floor.helper}
                          icon={<BuildingIcon />}
                        />
                      </FormFieldGrid>
                    </FormSection>

                    {/* Security Section */}
                    <FormSection
                      title={REGISTER_CONSTANTS.sections.security.title}
                      description={REGISTER_CONSTANTS.sections.security.description}
                    >
                      <FormField
                        id="password"
                        name="password"
                        type="password"
                        label={REGISTER_CONSTANTS.fields.password.label}
                        placeholder={REGISTER_CONSTANTS.fields.password.placeholder}
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        autoComplete="new-password"
                        error={errors.password}
                        icon={<LockIcon />}
                      />

                      <PasswordStrength
                        password={formData.password}
                        showDetails={true}
                      />

                      <FormField
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        label={REGISTER_CONSTANTS.fields.confirmPassword.label}
                        placeholder={REGISTER_CONSTANTS.fields.confirmPassword.placeholder}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        autoComplete="new-password"
                        error={errors.confirmPassword}
                        icon={<LockIcon />}
                      />
                    </FormSection>

                    {/* Preferences Section */}
                    <FormSection
                      title={REGISTER_CONSTANTS.sections.preferences.title}
                      description={REGISTER_CONSTANTS.sections.preferences.description}
                    >
                      <NotificationCheckbox
                        checked={formData.subscribeToNotifications}
                        onChange={(checked) => setFormData(prev => ({
                          ...prev,
                          subscribeToNotifications: checked
                        }))}
                      />
                    </FormSection>

                    {/* Error Display */}
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    {success && <SuccessMessage>{REGISTER_CONSTANTS.page.success.message}</SuccessMessage>}

                    {/* Terms Agreement */}
                    <TermsCheckbox
                      checked={formData.agreeToTerms}
                      onChange={(checked) => setFormData(prev => ({
                        ...prev,
                        agreeToTerms: checked
                      }))}
                      error={errors.agreeToTerms}
                    />

                    {/* Submit Button */}
                    <SubmitButton type="submit" variant="primary" disabled={isLoading || !formData.agreeToTerms}>
                      {isLoading ? (
                        <>
                          <LoadingSpinner />
                          {REGISTER_CONSTANTS.buttons.loading}
                        </>
                      ) : (
                        REGISTER_CONSTANTS.buttons.submit
                      )}
                    </SubmitButton>

                    <RememberMeCheckbox
                      checked={rememberMe}
                      onChange={setRememberMe}
                    />

                    <QuickAccessButtons />
                  </FormContainer>
                </StyledForm>
              </CardContent>
            </AuthCard>
          )}
        </FormWrapper>
      </PageContainer>
    </>
  );
}