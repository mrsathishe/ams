import textConstants from './text.json';

// Type definitions for the constants structure
export interface AppConstants {
  app: {
    name: string;
    tagline: string;
    description: string;
  };
  register: {
    page: {
      title: string;
      description: string;
      success: {
        message: string;
        redirect: string;
      };
    };
    sections: {
      personal: { title: string; description: string; };
      apartment: { title: string; description: string; };
      security: { title: string; description: string; };
      preferences: { title: string; description: string; };
    };
    fields: {
      name: { label: string; placeholder: string; };
      email: { label: string; placeholder: string; };
      phone: { label: string; placeholder: string; helper: string; };
      apartmentName: { label: string; placeholder: string; helper: string; };
      buildingName: { label: string; placeholder: string; helper: string; };
      floor: { label: string; placeholder: string; helper: string; };
      password: { label: string; placeholder: string; };
      confirmPassword: { label: string; placeholder: string; };
    };
    buttons: {
      submit: string;
      loading: string;
      signin: string;
    };
    links: {
      hasAccount: string;
    };
    checkboxes: {
      notifications: { label: string; description: string; };
      remember: { label: string; };
      terms: { text: string; termsLink: string; andText: string; privacyLink: string; };
    };
    quickAccess: {
      title: string;
      buttons: { google: string; linkedin: string; sso: string; };
    };
  };
  login: {
    page: {
      title: string;
      description: string;
    };
    fields: {
      identifier: { label: string; placeholder: string; };
      password: { label: string; placeholder: string; };
    };
    buttons: {
      submit: string;
      loading: string;
      forgotPassword: string;
    };
    links: {
      noAccount: string;
      signUp: string;
    };
    messages: {
      success: string;
      error: string;
    };
  };
  validation: {
    [key: string]: {
      [key: string]: string;
    };
  };
  passwordStrength: {
    labels: { weak: string; fair: string; good: string; strong: string; };
    text: string;
    requirements: {
      length: string;
      lowercase: string;
      uppercase: string;
      number: string;
      special: string;
    };
  };
  errors: {
    api: {
      emailExists: string;
      badRequest: string;
      validationError: string;
      generic: string;
    };
  };
  header: {
    contact: { phone: string; email: string; };
    profile: { editProfile: string; logout: string; };
  };
  footer: {
    company: { description: string; };
    sections: { contact: string; quickLinks: string; legal: string; };
    links: { [key: string]: string; };
    copyright: string;
    builtWith: string;
    location: string;
  };
  navigation: {
    routes: { [key: string]: string; };
  };
}

// Export the constants with proper typing
export const CONSTANTS: AppConstants = textConstants as AppConstants;

// Export individual sections for easier access
export const APP_INFO = CONSTANTS.app;
export const REGISTER_CONSTANTS = CONSTANTS.register;
export const LOGIN_CONSTANTS = CONSTANTS.login;
export const VALIDATION_MESSAGES = CONSTANTS.validation;
export const PASSWORD_STRENGTH = CONSTANTS.passwordStrength;
export const ERROR_MESSAGES = CONSTANTS.errors;
export const HEADER_CONSTANTS = CONSTANTS.header;
export const FOOTER_CONSTANTS = CONSTANTS.footer;
export const NAVIGATION_ROUTES = CONSTANTS.navigation.routes;

export default CONSTANTS;