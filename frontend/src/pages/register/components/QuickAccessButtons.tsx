import styled from "styled-components";
import { QuickAccessSection, QuickAccessTitle, ButtonGrid, Button } from "@/styles/shared";
import { REGISTER_CONSTANTS } from "@/constants";

const DisabledInfo = styled.div`
  text-align: center;
  margin-bottom: 0.75rem;
  font-size: 0.75rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const StatusIcon = styled.span`
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

const DisabledButton = styled(Button)`
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

export default function QuickAccessButtons() {
  return (
    <QuickAccessSection>
      <QuickAccessTitle>{REGISTER_CONSTANTS.quickAccess.title}</QuickAccessTitle>
      <DisabledInfo>
        <StatusIcon>!</StatusIcon>
        {REGISTER_CONSTANTS.quickAccess.subtitle} - {REGISTER_CONSTANTS.quickAccess.status}
      </DisabledInfo>
      <ButtonGrid>
        <DisabledButton type="button" variant="outline" disabled>
          {REGISTER_CONSTANTS.quickAccess.buttons.google}
        </DisabledButton>
        <DisabledButton type="button" variant="outline" disabled>
          {REGISTER_CONSTANTS.quickAccess.buttons.linkedin}
        </DisabledButton>
        <DisabledButton type="button" variant="outline" disabled>
          {REGISTER_CONSTANTS.quickAccess.buttons.sso}
        </DisabledButton>
      </ButtonGrid>
    </QuickAccessSection>
  );
}