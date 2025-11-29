import React from "react";
import styled from "styled-components";
import { CheckboxWrapper, Checkbox, Label } from "@/styles/shared";

const NotificationContainer = styled(CheckboxWrapper)`
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
`;

const NotificationLabel = styled(Label)`
  font-size: 0.875rem;
  font-weight: 500;
`;

const NotificationDescription = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0.25rem 0 0 1.5rem;
`;

interface NotificationCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function NotificationCheckbox({ checked, onChange }: NotificationCheckboxProps) {
  return (
    <NotificationContainer>
      <Checkbox 
        id="subscribeToNotifications" 
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div>
        <NotificationLabel htmlFor="subscribeToNotifications">
          Send me notifications and updates
        </NotificationLabel>
        <NotificationDescription>
          Get important updates about your apartment, payments, and maintenance schedules.
        </NotificationDescription>
      </div>
    </NotificationContainer>
  );
}