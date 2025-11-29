import styled from "styled-components";
import { respondTo } from "@/styles/breakpoints";

export const SignInSection = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #6b7280;
  background: #fff;
  padding: 1rem;
  border-radius: 2rem;
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FormFieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  ${respondTo.mobile(`
    grid-template-columns: 1fr;
  `)}
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