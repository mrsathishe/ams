/**
 * Calculates password strength based on various criteria
 * @param password - Password to evaluate
 * @returns Strength score from 0-4
 */
export const calculatePasswordStrength = (password: string): number => {
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[@$!%*?&]/.test(password)) strength++;
  
  return Math.min(strength, 4);
};

/**
 * Gets password strength label based on score
 * @param strength - Strength score (0-4)
 * @returns Human readable strength label
 */
export const getStrengthLabel = (strength: number): string => {
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

/**
 * Validates email format
 * @param email - Email to validate
 * @returns True if valid email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates phone number format
 * @param phone - Phone number to validate
 * @returns True if valid phone format
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone);
};

/**
 * Validates password requirements
 * @param password - Password to validate
 * @returns Array of requirement objects with met status
 */
export const getPasswordRequirements = (password: string) => {
  return [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Contains number', met: /\d/.test(password) },
    { label: 'Contains special character (@$!%*?&)', met: /[@$!%*?&]/.test(password) }
  ];
};