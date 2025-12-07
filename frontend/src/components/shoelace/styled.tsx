import styled from 'styled-components';
import { SlButton, SlCard } from './index';

// Styled Button variants
export const PrimaryButton = styled(SlButton)`
  width: 100%;
`;

export const SecondaryButton = styled(SlButton)`
  width: 100%;
`;

export const FullWidthButton = styled(SlButton)`
  width: 100%;
`;

export const SearchButton = styled(SlButton)`
  height: 48px;
  min-width: 140px;
`;

export const EditButton = styled(SlButton)`
  margin-top: 12px;
  font-size: 12px;
  padding: 4px 8px;
`;

// Styled Card variants
export const FormCard = styled(SlCard)`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

export const RegisterCard = styled(SlCard)`
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
`;

// Card content areas
export const CardHeader = styled.div`
  text-align: center;
  padding: 2rem 2rem 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
`;

export const LocationCardHeader = styled.div`
  text-align: center;
  padding: 1rem;
`;

export const CardContent = styled.div`
  padding: 2rem;
`;

export const LocationCardContent = styled.div`
  padding: 1.5rem;
`;

// Typography
export const CardTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem;
`;

export const CardSubtitle = styled.p`
  color: #64748b;
  margin: 0;
  font-size: 0.875rem;
`;

export const LocationCardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: #1e293b;
`;

// Form elements
export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
`;

export const FlexButton = styled(SlButton)`
  flex: 1;
`;

// Layout helpers
export const ValidationMessage = styled.div`
  font-size: 12px;
  color: #d32f2f;
  margin-top: 4px;
`;

export const SearchContainer = styled.div`
  position: relative;
`;

export const SearchFieldGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
`;

export const SearchFieldWrapper = styled.div`
  flex: 1;
`;

// Form sections
export const LocationSummary = styled.div`
  background-color: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
`;

export const LocationGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  font-size: 14px;
`;

// Dropdown styles
export const DropdownContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
`;

export const DropdownItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

export const DropdownItemTitle = styled.div`
  font-weight: 500;
`;

export const DropdownItemSubtitle = styled.div`
  font-size: 12px;
  color: #666;
`;

export const NoResultsMessage = styled.div`
  padding: 16px;
  text-align: center;
  color: #666;
  background-color: #f5f5f5;
  border-radius: 4px;
  margin-top: 8px;
`;

export const NoResultsTitle = styled.div`
  margin-bottom: 4px;
`;

export const NoResultsSubtitle = styled.div`
  font-size: 12px;
`;

// Form labels and inputs
export const FieldLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

export const SelectField = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
`;

// Info messages
export const InfoMessage = styled.div`
  padding: 12px;
  background-color: #e3f2fd;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #1565c0;
`;