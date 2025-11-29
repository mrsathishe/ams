export interface FormData {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  phone: string;
  apartmentName: string;
  buildingName: string;
  flatNumber: string;
  floorNumber: string;
  agreeToTerms: boolean;
  subscribeToNotifications: boolean;
}

export interface FormErrors {
  [key: string]: string;
}