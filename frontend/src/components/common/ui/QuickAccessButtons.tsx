import React from "react";
import { QuickAccessSection, QuickAccessTitle, ButtonGrid } from "@/styles/shared";
import { REGISTER_CONSTANTS } from "@/constants";
import {
  DisabledInfo,
  StatusIcon,
  DisabledButton
} from "./styles";

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