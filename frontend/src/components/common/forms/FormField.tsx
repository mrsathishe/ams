import styled from "styled-components";
import { FormGroup, Label, Input } from "@/styles/shared";
import { respondTo } from "@/utils/responsive";

const FieldContainer = styled(FormGroup)`
  position: relative;
`;

const FieldLabel = styled(Label)<{ required?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${props => props.required && `
    &:after {
      content: '*';
      color: #dc2626;
      font-weight: bold;
    }
  `}
`;

const FieldInput = styled(Input)<{ hasError?: boolean; hasIcon?: boolean }>`
  padding-left: ${props => props.hasIcon ? '2.75rem' : '1rem'};
  border-color: ${props => props.hasError ? '#dc2626' : '#d1d5db'};

  &:focus {
    border-color: ${props => props.hasError ? '#dc2626' : '#3b82f6'};
  }
`;

const IconContainer = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  width: 1.25rem;
  height: 1.25rem;
  z-index: 1;

  svg {
    width: 100%;
    height: 100%;
  }
`;

const ErrorText = styled.span`
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const HelperText = styled.span`
  color: #6b7280;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

interface FormFieldProps {
  id: string;
  name: string;
  type: 'text' | 'email' | 'password' | 'tel' | 'number';
  label: string;
  placeholder: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoComplete?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export default function FormField({
  id,
  name,
  type,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  required = false,
  autoComplete,
  error,
  helperText,
  icon
}: FormFieldProps) {
  return (
    <FieldContainer>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <div style={{ position: 'relative' }}>
        {icon && <IconContainer>{icon}</IconContainer>}
        <FieldInput
          id={id}
          name={name}
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          hasError={!!error}
          hasIcon={!!icon}
        />
      </div>
      {error && <ErrorText>{error}</ErrorText>}
      {helperText && !error && <HelperText>{helperText}</HelperText>}
    </FieldContainer>
  );
}