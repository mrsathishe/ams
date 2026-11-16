import { useState } from "react";
import PhoneInput, { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { isValidPhoneNumber, CountryCode } from "libphonenumber-js";

export interface PhoneInputFieldProps {
  value: string;
  onChange: (fullE164: string, isValid: boolean) => void;
}

export default function PhoneInputField({
  value,
  onChange,
}: PhoneInputFieldProps) {
  const [rawNumber, setRawNumber] = useState(value.replace("+", ""));
  const [countryIso, setCountryIso] = useState<CountryCode>("IN");
  const [dialCode, setDialCode] = useState("91");
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handlePhoneChange = (val: string, data: CountryData) => {
    const iso = (data.countryCode?.toUpperCase() || "IN") as CountryCode;
    const code = data.dialCode || "";
    setRawNumber(val);
    setCountryIso(iso);
    setDialCode(code);

    const localDigits = val.startsWith(code) ? val.slice(code.length) : val;
    if (!localDigits) {
      setIsValid(null);
      onChange("", false);
      return;
    }

    const valid = isValidPhoneNumber(localDigits, iso);
    setIsValid(valid);
    onChange(`+${val}`, valid);
  };

  return (
    <div>
      <PhoneInput
        country={countryIso.toLowerCase()}
        enableSearch={true}
        searchPlaceholder="Search country or code..."
        disableCountryCode={true}
        autoFormat={true}
        value={rawNumber}
        onChange={handlePhoneChange}
        containerClass="mt-1 w-full"
        inputClass="!w-full !h-[42px] !text-gray-900 !border-gray-300 !rounded-md focus:!border-emerald-700 focus:!ring-1 focus:!ring-emerald-700"
        buttonClass="!border-gray-300 !bg-gray-50 !rounded-l-md"
      />
      {isValid === false && (
        <p className="building-error">
          Invalid phone number for {countryIso} (+{dialCode})
        </p>
      )}
    </div>
  );
}
