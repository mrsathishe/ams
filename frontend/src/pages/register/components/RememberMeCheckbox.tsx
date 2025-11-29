import React from "react";
import { CheckboxWrapper, Checkbox, Label } from "@/styles/shared";

interface RememberMeCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function RememberMeCheckbox({ checked, onChange }: RememberMeCheckboxProps) {
  return (
    <CheckboxWrapper>
      <Checkbox 
        id="rememberMe" 
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <Label htmlFor="rememberMe">Remember me</Label>
    </CheckboxWrapper>
  );
}