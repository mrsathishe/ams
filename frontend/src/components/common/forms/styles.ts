import styled from "styled-components";
import { FormGroup, Label, Input } from "@/styles/shared";
import { respondTo } from "@/styles/breakpoints";

// FormField Styles
export const FieldContainer = styled(FormGroup)`
  position: relative;
`;

export const FieldLabel = styled(Label)<{ required?: boolean }>`
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

export const FieldInput = styled(Input)<{ hasError?: boolean; hasIcon?: boolean; readOnly?: boolean }>`
  padding-left: ${props => props.hasIcon ? '2.75rem' : '1rem'};
  border-color: ${props => props.hasError ? '#dc2626' : '#d1d5db'};
  background-color: ${props => props.readOnly ? '#f5f5f5' : 'white'};
  color: ${props => props.readOnly ? '#666' : 'inherit'};
  cursor: ${props => props.readOnly ? 'not-allowed' : 'text'};

  &:focus {
    border-color: ${props => props.hasError ? '#dc2626' : '#3b82f6'};
  }
`;

export const IconContainer = styled.div`
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

export const ErrorText = styled.span`
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

export const HelperText = styled.span`
  color: #6b7280;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

// FormSection Styles
export const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fafafa;

  ${respondTo.mobile(`
    padding: 1rem;
    border: none;
    background: transparent;
  `)}
`;

export const SectionHeader = styled.div`
  margin-bottom: 1rem;
`;

export const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem;
`;

export const SectionDescription = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
`;

export const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// PasswordStrength Styles
export const ProgressContainer = styled.div`
  margin: 0.5rem 0;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ strength: number }>`
  height: 100%;
  border-radius: 2px;
  transition: all 0.3s ease;
  width: ${props => (props.strength / 4) * 100}%;
  background: ${props => {
    if (props.strength <= 1) return '#dc2626'; // Weak - Red
    if (props.strength <= 2) return '#f59e0b'; // Fair - Orange  
    if (props.strength <= 3) return '#10b981'; // Good - Green
    return '#059669'; // Strong - Dark Green
  }};
`;

export const RequirementsContainer = styled.div`
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
`;

export const RequirementItem = styled.div<{ met: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  margin: 0.25rem 0;
  color: ${props => props.met ? '#059669' : '#dc2626'};

  &:before {
    content: '${props => props.met ? '✓' : '✗'}';
    font-weight: bold;
    width: 1rem;
  }
`;

export const StrengthLabel = styled.div<{ strength: number }>`
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 0.25rem;
  color: ${props => {
    if (props.strength <= 1) return '#dc2626';
    if (props.strength <= 2) return '#f59e0b';
    if (props.strength <= 3) return '#10b981';
    return '#059669';
  }};
`;