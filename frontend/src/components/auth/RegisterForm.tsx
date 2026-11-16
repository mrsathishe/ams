import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { apiErrorMessage } from "@/lib/api/apiError";
import PhoneInputField from "./PhoneInputField";
import PasswordInput from "./PasswordInput";
import PropertyDetailsFields from "./PropertyDetailsFields";

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    relationship: "Owner" as "Owner" | "Rental",
    communityId: "",
    buildingId: "",
    flatNumber: "",
  });
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const updateField = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!isPhoneValid || !form.phoneNumber) {
      return setError(
        "Please enter a valid phone number for the selected country.",
      );
    }
    if (!form.communityId || !form.buildingId || !form.flatNumber.trim()) {
      return setError(
        "Select a community, building, and enter your flat number.",
      );
    }
    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match.");
    }

    setIsLoading(true);
    try {
      const user = await register({
        email: form.email,
        name: form.name,
        phone_number: form.phoneNumber,
        password: form.password,
        relationship: form.relationship,
        community_id: form.communityId,
        building_id: form.buildingId,
        flat_number: form.flatNumber.trim(),
      });
      navigate(
        user.approval_status === "approved"
          ? "/dashboard"
          : "/pending-approval",
      );
    } catch (err) {
      setError(apiErrorMessage(err, "Registration failed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name" className="form-label">
          Full name
        </label>
        <input
          id="name"
          type="text"
          required
          maxLength={100}
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          className="input-field"
        />
      </div>

      <div>
        <label htmlFor="reg-email" className="form-label">
          Email address
        </label>
        <input
          id="reg-email"
          type="email"
          required
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          className="input-field"
        />
      </div>

      <div>
        <label className="form-label">Phone number</label>
        <PhoneInputField
          value={form.phoneNumber}
          onChange={(full, valid) => {
            updateField("phoneNumber", full);
            setIsPhoneValid(valid);
          }}
        />
      </div>

      <PropertyDetailsFields
        relationship={form.relationship}
        setRelationship={(val) => updateField("relationship", val)}
        communityId={form.communityId}
        setCommunityId={(val) => updateField("communityId", val)}
        buildingId={form.buildingId}
        setBuildingId={(val) => updateField("buildingId", val)}
        flatNumber={form.flatNumber}
        setFlatNumber={(val) => updateField("flatNumber", val)}
      />

      <PasswordInput
        id="reg-password"
        name="password"
        label="Password"
        autoComplete="new-password"
        value={form.password}
        onChange={(val) => updateField("password", val)}
      />

      <PasswordInput
        id="confirm-password"
        name="confirmPassword"
        label="Confirm password"
        autoComplete="new-password"
        value={form.confirmPassword}
        onChange={(val) => updateField("confirmPassword", val)}
      />

      {error && <p className="error-message">{error}</p>}

      <button type="submit" disabled={isLoading} className="button">
        {isLoading ? "Please wait..." : "Create account"}
      </button>
    </form>
  );
}
