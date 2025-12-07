export interface LocationDetails {
  country: string;
  zipcode: string;
  state: string;
  city: string;
  apartmentName: string;
  buildingName: string;
}

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
  locationDetails?: LocationDetails;
}

export interface FormErrors {
  [key: string]: string;
}