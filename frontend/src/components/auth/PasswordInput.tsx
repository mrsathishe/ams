import { useState } from "react";

interface PasswordInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  autoComplete?: string;
}

export default function PasswordInput({
  id,
  name,
  label,
  value,
  onChange,
  autoComplete = "current-password",
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="password-input-label">
        {label}
      </label>
      <div className="password-input-container">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          minLength={8}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="password-input-field"
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="password-input-button"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}
