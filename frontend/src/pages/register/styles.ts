import styled from "styled-components";
import { SlButton } from '@shoelace-style/shoelace/dist/react';

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FormFieldGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SuccessMessage = styled.div`
  padding: 0.75rem 1rem;
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  color: #166534;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:before {
    content: '✓';
    font-weight: bold;
    color: #059669;
  }
`;

export const LoadingSpinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// Register page specific components
export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const LocationSummary = styled.div`
  background-color: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
`;

export const LocationGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 14px;
`;

export const EditButton = styled(SlButton)`
  margin-top: 12px;
  font-size: 12px;
  padding: 4px 8px;
`;

export const SubmitButton = styled(SlButton)`
  width: 100%;
`;