import styled from "styled-components";
import { SlButton, SlCard } from '@shoelace-style/shoelace/dist/react';

export const FormCard = styled(SlCard)`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

export const CardHeader = styled.div`
  text-align: center;
  padding: 1rem;
`;

export const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: #1e293b;
`;

export const CardDescription = styled.p`
  color: #64748b;
  margin: 0;
  font-size: 0.875rem;
`;

export const FormContainer = styled.form`
  padding: 1.5rem;
`;

export const SearchInstructions = styled.div`
  padding: 12px;
  background-color: #e3f2fd;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #1565c0;
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

export const SearchButton = styled(SlButton)`
  height: 48px;
  min-width: 140px;
`;

export const ValidationMessages = styled.div`
  font-size: 12px;
  color: #d32f2f;
  margin-top: 4px;
`;

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

export const NoResultsContainer = styled.div`
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

export const BuildingSection = styled.div``;

export const BuildingLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

export const BuildingSelect = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
`;

export const BuildingError = styled.div`
  color: red;
  font-size: 12px;
  margin-top: 4px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
`;

export const FlexButton = styled(SlButton)`
  flex: 1;
`;