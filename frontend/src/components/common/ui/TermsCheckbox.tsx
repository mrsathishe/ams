import React from "react";
import { Checkbox } from "@/styles/shared";
import {
  CheckboxContainer,
  CheckboxLabel,
  ErrorText
} from "./styles";

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export default function TermsCheckbox({ checked, onChange, error }: TermsCheckboxProps) {
  const handleLinkClick = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(href, '_blank');
  };

  return (
    <CheckboxContainer error={!!error}>
      <Checkbox 
        id="agreeToTerms" 
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required
      />
      <CheckboxLabel htmlFor="agreeToTerms">
        I agree to the{' '}
        <a href="/terms" onClick={handleLinkClick('/terms')}>
          Terms of Service
        </a>
        {' '}and{' '}
        <a href="/privacy" onClick={handleLinkClick('/privacy')}>
          Privacy Policy
        </a>
      </CheckboxLabel>
      {error && <ErrorText>{error}</ErrorText>}
    </CheckboxContainer>
  );
}