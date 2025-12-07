import styled from "styled-components";
import { SlCard, SlButton } from '@shoelace-style/shoelace/dist/react';

// Common styled components for forms and layouts
export const PageContainer = styled.div`
  min-height: calc(100vh - 161px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  padding-top: 8rem;
  gap: 1.5rem;
`;

export const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 3rem;
  width: 100%;
  max-width: 1200px;
  align-items: start;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    max-width: 700px;
  }
`;

export const FormWrapper = styled.div`
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Card = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  backdrop-filter: blur(10px);
`;

export const CardHeader = styled.div`
  text-align: center;
  padding: 2rem 2rem 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
`;

export const CardTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem;
`;

export const CardDescription = styled.p`
  color: #64748b;
  margin: 0;
  font-size: 0.875rem;
`;

export const CardContent = styled.div`
  padding: 2rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  background: white;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const Button = styled.button<{ variant?: 'primary' | 'outline' | 'link' }>`
  padding: ${props => props.variant === 'link' ? '0' : '0.75rem 1.5rem'};
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  
  ${props => {
    switch (props.variant) {
      case 'outline':
        return `
          background: transparent;
          border: 1px solid #d1d5db;
          color: #374151;
          
          &:hover {
            background: #f9fafb;
            border-color: #9ca3af;
          }
        `;
      case 'link':
        return `
          background: none;
          color: #3b82f6;
          text-decoration: none;
          
          &:hover {
            text-decoration: underline;
          }
        `;
      default:
        return `
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
          
          &:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4);
          }
          
          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `;
    }
  }}
`;

export const ErrorMessage = styled.div`
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 0.875rem;
`;

export const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 1rem;
  height: 1rem;
  accent-color: #3b82f6;
`;

export const QuickAccessSection = styled.div`
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
`;

export const QuickAccessTitle = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
  margin: 0 0 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
`;

export const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
`;

export const AuthSection = styled.div`
  text-align: center;
  color: #6b7280;
  background: white;
  border-radius: 1rem;
`;

export const AuthCard = styled(SlCard)`
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
`;

export const TextButton = styled(SlButton)`
  background: none;
  border: none;
  color: #3b82f6;
  text-decoration: none;
  padding: 0;
  
  &:hover {
    text-decoration: underline;
  }
`;