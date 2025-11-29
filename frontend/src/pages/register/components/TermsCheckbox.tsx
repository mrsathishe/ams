import React from "react";
import styled from "styled-components";
import { CheckboxWrapper, Checkbox, Label } from "@/styles/shared";

const CheckboxContainer = styled(CheckboxWrapper)<{ error?: boolean }>`
  border: ${props => props.error ? '1px solid #dc2626' : 'none'};
  border-radius: 8px;
  padding: ${props => props.error ? '0.5rem' : '0'};
  background: ${props => props.error ? '#fef2f2' : 'transparent'};
`;

const CheckboxLabel = styled(Label)`
  font-size: 0.875rem;
  cursor: pointer;

  a {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorText = styled.span`
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.5rem;
  display: block;
`;

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