import React from "react";
import styled from "styled-components";

const ProgressContainer = styled.div`
  margin: 0.5rem 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ strength: number }>`
  height: 100%;
  border-radius: 2px;
  transition: all 0.3s ease;
  width: ${props => (props.strength / 4) * 100}%;
  background: ${props => {
    if (props.strength <= 1) return '#dc2626'; // Weak - Red
    if (props.strength <= 2) return '#f59e0b'; // Fair - Orange  
    if (props.strength <= 3) return '#10b981'; // Good - Green
    return '#059669'; // Strong - Dark Green
  }};
`;

const RequirementsContainer = styled.div`
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
`;

const RequirementItem = styled.div<{ met: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  margin: 0.25rem 0;
  color: ${props => props.met ? '#059669' : '#dc2626'};

  &:before {
    content: '${props => props.met ? '✓' : '✗'}';
    font-weight: bold;
    width: 1rem;
  }
`;

const StrengthLabel = styled.div<{ strength: number }>`
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 0.25rem;
  color: ${props => {
    if (props.strength <= 1) return '#dc2626';
    if (props.strength <= 2) return '#f59e0b';
    if (props.strength <= 3) return '#10b981';
    return '#059669';
  }};
`;

interface PasswordStrengthProps {
  password: string;
  showDetails?: boolean;
}

const calculatePasswordStrength = (password: string): number => {
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[@$!%*?&]/.test(password)) strength++;
  
  return Math.min(strength, 4);
};

const getStrengthLabel = (strength: number): string => {
  switch (strength) {
    case 0:
    case 1:
      return 'Weak';
    case 2:
      return 'Fair';
    case 3:
      return 'Good';
    case 4:
      return 'Strong';
    default:
      return 'Weak';
  }
};

export default function PasswordStrength({ password, showDetails = true }: PasswordStrengthProps) {
  const strength = calculatePasswordStrength(password);

  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Contains number', met: /\d/.test(password) },
    { label: 'Contains special character (@$!%*?&)', met: /[@$!%*?&]/.test(password) }
  ];

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