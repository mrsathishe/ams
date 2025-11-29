import type { FormData, FormErrors } from "@/types/auth";
import { VALIDATION_MESSAGES, ERROR_MESSAGES } from "@/constants";

/**
 * Validates email field for registration
 * @param email - Email to validate
 * @returns Error message or empty string if valid
 */
export const validateEmailField = (email: string): string => {
  if (!email) {
    return VALIDATION_MESSAGES.email.required;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return VALIDATION_MESSAGES.email.invalid;
  }
  return '';
};

/**
 * Validates name field for registration
 * @param name - Name to validate
 * @returns Error message or empty string if valid
 */
export const validateNameField = (name: string): string => {
  if (!name) {
    return VALIDATION_MESSAGES.name.required;
  }
  if (name.length < 2) {
    return VALIDATION_MESSAGES.name.minLength;
  }
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return VALIDATION_MESSAGES.name.invalid;
  }
  return '';
};

/**
 * Validates password field for registration
 * @param password - Password to validate
 * @returns Error message or empty string if valid
 */
export const validatePasswordField = (password: string): string => {
  if (!password) {
    return VALIDATION_MESSAGES.password.required;
  }
  if (password.length < 8) {
    return VALIDATION_MESSAGES.password.minLength;
  }
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
    return VALIDATION_MESSAGES.password.complexity;
  }
  return '';
};

/**
 * Validates confirm password field
 * @param password - Original password
 * @param confirmPassword - Confirmation password
 * @returns Error message or empty string if valid
 */
export const validateConfirmPasswordField = (password: string, confirmPassword: string): string => {
  if (!confirmPassword) {
    return VALIDATION_MESSAGES.confirmPassword.required;
  }
  if (password !== confirmPassword) {
    return VALIDATION_MESSAGES.confirmPassword.mismatch;
  }
  return '';
};

/**
 * Validates phone field (required)
 * @param phone - Phone number to validate
 * @returns Error message or empty string if valid
 */
export const validatePhoneField = (phone: string): string => {
  if (!phone) {
    return VALIDATION_MESSAGES.phone.required;
  }
  if (!/^[\+]?[1-9][\d]{0,15}$/.test(phone)) {
    return VALIDATION_MESSAGES.phone.invalid;
  }
  return '';
};

/**
 * Validates apartment name field (optional)
 * @param apartmentName - Apartment name to validate
 * @returns Error message or empty string if valid
 */
export const validateApartmentNameField = (apartmentName: string): string => {
  if (apartmentName && apartmentName.length < 2) {
    return VALIDATION_MESSAGES.apartmentName.invalid;
  }
  return '';
};

/**
 * Validates flat number field (required)
 * @param flatNumber - Flat number to validate
 * @returns Error message or empty string if valid
 */
export const validateFlatNumberField = (flatNumber: string): string => {
  if (!flatNumber) {
    return VALIDATION_MESSAGES.flatNumber.required;
  }
  if (!/^[A-Za-z0-9\-\/]+$/.test(flatNumber)) {
    return VALIDATION_MESSAGES.flatNumber.invalid;
  }
  return '';
};

/**
 * Validates floor number field (optional)
 * @param floorNumber - Floor number to validate
 * @returns Error message or empty string if valid
 */
export const validateFloorNumberField = (floorNumber: string): string => {
  if (floorNumber) {
    const floor = parseInt(floorNumber);
    if (isNaN(floor) || floor < 1 || floor > 100) {
      return VALIDATION_MESSAGES.floor.invalid;
    }
  }
  return '';
};

/**
 * Validates terms agreement
 * @param agreeToTerms - Whether user agreed to terms
 * @returns Error message or empty string if valid
 */
export const validateTermsAgreement = (agreeToTerms: boolean): string => {
  if (!agreeToTerms) {
    return VALIDATION_MESSAGES.terms.required;
  }
  return '';
};

/**
 * Validates entire registration form
 * @param data - Form data to validate
 * @returns Object with field errors
 */
export const validateRegistrationForm = (data: FormData): FormErrors => {
  const errors: FormErrors = {};

  const emailError = validateEmailField(data.email);
  if (emailError) errors.email = emailError;

  const nameError = validateNameField(data.name);
  if (nameError) errors.name = nameError;

  const passwordError = validatePasswordField(data.password);
  if (passwordError) errors.password = passwordError;

  const confirmPasswordError = validateConfirmPasswordField(data.password, data.confirmPassword);
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

  const phoneError = validatePhoneField(data.phone);
  if (phoneError) errors.phone = phoneError;

  const apartmentNameError = validateApartmentNameField(data.apartmentName);
  if (apartmentNameError) errors.apartmentName = apartmentNameError;

  const flatNumberError = validateFlatNumberField(data.flatNumber);
  if (flatNumberError) errors.flatNumber = flatNumberError;

  const floorError = validateFloorNumberField(data.floorNumber);
  if (floorError) errors.floorNumber = floorError;

  const termsError = validateTermsAgreement(data.agreeToTerms);
  if (termsError) errors.agreeToTerms = termsError;

  return errors;
};

/**
 * Transforms form data to match backend API format
 * @param formData - Frontend form data
 * @returns Backend-compatible registration data
 */
export const transformRegistrationData = (formData: FormData) => {
  return {
    email: formData.email.trim().toLowerCase(),
    name: formData.name.trim(),
    password: formData.password,
    phone: formData.phone.trim(),
    apartment_name: formData.apartmentName.trim() || undefined,
    building_name: formData.buildingName.trim() || undefined,
    flat_number: formData.flatNumber.trim(),
    floor_number: formData.floorNumber ? parseInt(formData.floorNumber) : undefined,
    role: "user" as const,
    profile_data: {
      preferences: {
        notifications: formData.subscribeToNotifications,
        theme: "system" as const
      }
    }
  };
};

/**
 * Handles registration API errors
 * @param error - API error object
 * @returns Object with general error and field-specific errors
 */
export const handleRegistrationError = (error: any): { generalError: string; fieldErrors: FormErrors } => {
  let generalError = '';
  let fieldErrors: FormErrors = {};

  if (error.response?.status === 409) {
    generalError = ERROR_MESSAGES.api.emailExists;
  } else if (error.response?.status === 400) {
    const apiErrors = error.response.data.detail;
    if (typeof apiErrors === 'string') {
      generalError = apiErrors;
    } else if (typeof apiErrors === 'object') {
      fieldErrors = apiErrors;
    }
  } else if (error.response?.status === 422) {
    generalError = ERROR_MESSAGES.api.validationError;
  } else {
    generalError = ERROR_MESSAGES.api.generic;
  }

  return { generalError, fieldErrors };
};