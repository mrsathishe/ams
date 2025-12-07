import {
  FieldContainer,
  FieldLabel,
  FieldInput,
  IconContainer,
  ErrorText,
  HelperText
} from "./styles";

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
  readOnly?: boolean;
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
  icon,
  readOnly = false
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
          readOnly={readOnly}
        />
      </div>
      {error && <ErrorText>{error}</ErrorText>}
      {helperText && !error && <HelperText>{helperText}</HelperText>}
    </FieldContainer>
  );
}