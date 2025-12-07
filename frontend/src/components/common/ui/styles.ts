import styled from "styled-components";
import { CheckboxWrapper, Checkbox, Label, Button } from "@/styles/shared";

// NotificationCheckbox Styles
export const NotificationContainer = styled(CheckboxWrapper)`
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
`;

export const NotificationLabel = styled(Label)`
  font-size: 0.875rem;
  font-weight: 500;
`;

export const NotificationDescription = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0.25rem 0 0 1.5rem;
`;

// QuickAccessButtons Styles
export const DisabledInfo = styled.div`
  text-align: center;
  margin-bottom: 0.75rem;
  font-size: 0.75rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

export const StatusIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  background: #f59e0b;
  color: white;
  border-radius: 50%;
  font-size: 0.625rem;
  font-weight: bold;
`;

export const DisabledButton = styled(Button)`
  opacity: 0.5;
  cursor: not-allowed;
  position: relative;
  
  &:hover {
    transform: none;
    box-shadow: none;
  }
  
  &:after {
    content: '🚧';
    position: absolute;
    top: 2px;
    right: 4px;
    font-size: 0.75rem;
  }
`;

// TermsCheckbox Styles
export const CheckboxContainer = styled(CheckboxWrapper)<{ error?: boolean }>`
  border: ${props => props.error ? '1px solid #dc2626' : 'none'};
  border-radius: 8px;
  padding: ${props => props.error ? '0.5rem' : '0'};
  background: ${props => props.error ? '#fef2f2' : 'transparent'};
`;

export const CheckboxLabel = styled(Label)`
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

export const ErrorText = styled.span`
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.5rem;
  display: block;
`;