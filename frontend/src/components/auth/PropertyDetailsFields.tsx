import SearchableDropdown from "../SearchableDropdown";
import { usePropertyOptions } from "../../hooks/usePropertyOptions";

interface PropertyDetailsFieldsProps {
  relationship: "Owner" | "Rental";
  setRelationship: (val: "Owner" | "Rental") => void;
  communityId: string;
  setCommunityId: (id: string) => void;
  buildingId: string;
  setBuildingId: (id: string) => void;
  flatNumber: string;
  setFlatNumber: (val: string) => void;
}

export default function PropertyDetailsFields({
  relationship,
  setRelationship,
  communityId,
  setCommunityId,
  buildingId,
  setBuildingId,
  flatNumber,
  setFlatNumber,
}: PropertyDetailsFieldsProps) {
  const {
    communities,
    buildings,
    communityError,
    buildingError,
    loadingCommunities,
    loadingBuildings,
  } = usePropertyOptions(communityId);

  return (
    <>
      <fieldset>
        <legend className="relation-field-text">
          Relationship to this flat
        </legend>
        <div className="relation-field-buttons">
          {(["Owner", "Rental"] as const).map((val) => (
            <button
              key={val}
              type="button"
              aria-pressed={relationship === val}
              onClick={() => setRelationship(val)}
              className={`relation-field-button ${
                relationship === val
                  ? "relation-field-button-active"
                  : "relation-field-button-not-active"
              }`}
            >
              {val}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="relative">
        <SearchableDropdown
          id="community"
          label="Community / Apartment"
          options={communities.map((c) => ({ id: c.id, label: c.name }))}
          value={communityId}
          onChange={(id) => {
            setCommunityId(id);
            setBuildingId("");
            setFlatNumber("");
          }}
          placeholder={
            loadingCommunities ? "Loading communities..." : "Search communities"
          }
        />
        {communityError && <p className="community-error">{communityError}</p>}
      </div>

      <div className="relative">
        <SearchableDropdown
          key={`building-${communityId}`}
          id="building"
          label="Building / Block"
          options={buildings.map((b) => ({ id: b.id, label: b.name }))}
          value={buildingId}
          onChange={(id) => {
            setBuildingId(id);
            setFlatNumber("");
          }}
          placeholder={
            loadingBuildings
              ? "Loading buildings..."
              : communityId
                ? "Search buildings"
                : "Select a community first"
          }
          disabled={!communityId}
        />
        {buildingError && <p className="building-error">{buildingError}</p>}
      </div>

      <div>
        <label htmlFor="flatNumber" className="form-label">
          Flat / Unit name or number
        </label>
        <input
          id="flatNumber"
          name="flat_number"
          required
          maxLength={80}
          value={flatNumber}
          onChange={(e) => setFlatNumber(e.target.value)}
          className="property-details-fields"
        />
      </div>
    </>
  );
}
