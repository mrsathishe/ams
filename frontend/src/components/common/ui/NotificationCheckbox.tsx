import React from "react";
import { Checkbox } from "@/styles/shared";
import {
  NotificationContainer,
  NotificationLabel,
  NotificationDescription
} from "./styles";

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