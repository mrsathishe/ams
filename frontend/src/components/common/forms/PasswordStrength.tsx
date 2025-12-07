import { calculatePasswordStrength, getStrengthLabel, getPasswordRequirements } from "@/utils/validation";
import {
  ProgressContainer,
  ProgressBar,
  ProgressFill,
  RequirementsContainer,
  RequirementItem,
  StrengthLabel
} from "./styles";

interface PasswordStrengthProps {
  password: string;
  showDetails?: boolean;
}

export default function PasswordStrength({ password, showDetails = true }: PasswordStrengthProps) {
  const strength = calculatePasswordStrength(password);
  const requirements = getPasswordRequirements(password);

  if (!password) return null;

  return (
    <ProgressContainer>
      <ProgressBar>
        <ProgressFill strength={strength} />
      </ProgressBar>
      <StrengthLabel strength={strength}>
        Password strength: {getStrengthLabel(strength)}
      </StrengthLabel>
      
      {showDetails && (
        <RequirementsContainer>
          {requirements.map((req, index) => (
            <RequirementItem key={index} met={req.met}>
              {req.label}
            </RequirementItem>
          ))}
        </RequirementsContainer>
      )}
    </ProgressContainer>
  );
}