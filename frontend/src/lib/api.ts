import axios from "axios";
import type {
  User,
  Expense,
  Payment,
  Document,
  ExpenseWithPayments,
  LoginCredentials,
  RegisterData,
  UpdatePasswordData,
  AnalyticsData,
  LocationDetails,
} from "../types";

interface ApartmentOption {
  id: string;
  name: string;
  buildings: BuildingOption[];
}

interface BuildingOption {
  id: string;
  name: string;
}

interface ZipcodeResponse {
  state: string;
  city: string;
}

// Helper function for Indian PIN codes using proper Indian API
async function getIndianLocationData(pincode: string): Promise<ZipcodeResponse> {
  try {
    // Use the proper Indian postal PIN code API
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    
    if (response.ok) {
      const data = await response.json();
      
      // Check if the response is successful and has data
      if (data && data.length > 0 && data[0].Status === "Success" && data[0].PostOffice && data[0].PostOffice.length > 0) {
        const postOffices = data[0].PostOffice;
        
        // Priority order for selecting the best post office:
        // 1. Head Post Office (H.O)
        // 2. Sub Post Office (S.O) 
        // 3. Branch Post Office (B.O) with Delivery status
        // 4. Any available post office
        
        let selectedPostOffice = postOffices[0]; // Default to first
        
        // Look for Head Post Office first
        const headOffice = postOffices.find(po => 
          po.BranchType === "Head Post Office" || 
          po.Name.includes("H.O") ||
          po.BranchType === "H.O"
        );
        
        if (headOffice) {
          selectedPostOffice = headOffice;
        } else {
          // Look for Sub Post Office
          const subOffice = postOffices.find(po => 
            po.BranchType === "Sub Post Office" || 
            po.Name.includes("S.O") ||
            po.BranchType === "S.O"
          );
          
          if (subOffice) {
            selectedPostOffice = subOffice;
          } else {
            // Look for Branch Post Office with Delivery status
            const deliveryBranch = postOffices.find(po => 
              po.DeliveryStatus === "Delivery" && 
              (po.BranchType === "Branch Post Office" || po.BranchType === "B.O")
            );
            
            if (deliveryBranch) {
              selectedPostOffice = deliveryBranch;
            }
          }
        }
        
        return {
          state: selectedPostOffice.State,
          city: selectedPostOffice.District
        };
      } else {
        throw new Error('PIN code not found');
      }
    }
    
    throw new Error('API request failed');
  } catch (error) {
    console.error('Error fetching Indian PIN code data:', error);
    
    // Fallback to local mapping if API fails
    const indianPincodeMap: Record<string, { state: string; city: string }> = {
      '600075': { state: 'Tamil Nadu', city: 'Chennai' },
      '604601': { state: 'Tamil Nadu', city: 'Tiruvannamalai' },
      '600001': { state: 'Tamil Nadu', city: 'Chennai' },
      '110001': { state: 'Delhi', city: 'New Delhi' },
      '400001': { state: 'Maharashtra', city: 'Mumbai' },
      '560001': { state: 'Karnataka', city: 'Bangalore' },
      '500001': { state: 'Telangana', city: 'Hyderabad' },
      '700001': { state: 'West Bengal', city: 'Kolkata' },
      '380001': { state: 'Gujarat', city: 'Ahmedabad' },
      '411001': { state: 'Maharashtra', city: 'Pune' },
      '226001': { state: 'Uttar Pradesh', city: 'Lucknow' },
      '302001': { state: 'Rajasthan', city: 'Jaipur' },
      '695001': { state: 'Kerala', city: 'Thiruvananthapuram' },
      '682001': { state: 'Kerala', city: 'Kochi' },
      '600028': { state: 'Tamil Nadu', city: 'Chennai' },
      '600034': { state: 'Tamil Nadu', city: 'Chennai' },
      '600040': { state: 'Tamil Nadu', city: 'Chennai' },
    };

    if (indianPincodeMap[pincode]) {
      return indianPincodeMap[pincode];
    }

    // Pattern-based fallback using first digit
    const stateMapping: Record<string, { state: string; commonCity: string }> = {
      '1': { state: 'Delhi', commonCity: 'New Delhi' },
      '2': { state: 'Haryana', commonCity: 'Gurgaon' },
      '3': { state: 'Punjab', commonCity: 'Chandigarh' },
      '4': { state: 'Maharashtra', commonCity: 'Mumbai' },
      '5': { state: 'Karnataka', commonCity: 'Bangalore' },
      '6': { state: 'Tamil Nadu', commonCity: 'Chennai' },
      '7': { state: 'West Bengal', commonCity: 'Kolkata' },
      '8': { state: 'Bihar', commonCity: 'Patna' },
      '9': { state: 'Gujarat', commonCity: 'Ahmedabad' },
    };

    const firstDigit = pincode.charAt(0);
    if (stateMapping[firstDigit]) {
      return {
        state: stateMapping[firstDigit].state,
        city: stateMapping[firstDigit].commonCity
      };
    }

    throw new Error('PIN code not found in our database');
  }
}

const api = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (
    credentials: LoginCredentials
  ): Promise<{ access_token: string; token_type: string }> => {
    const response = await api.post("/login", {
      identifier: credentials.username,
      password: credentials.password,
    });
    return response.data;
  },

  register: async (data: RegisterData): Promise<User> => {
    const response = await api.post("/register", data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get("/users/me");
    return response.data;
  },

  updatePassword: async (data: UpdatePasswordData): Promise<{ message: string }> => {
    const response = await api.post("/updatePassword", data);
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await api.post("/logout");
    return response.data;
  },

  refreshToken: async (): Promise<{ token: string }> => {
    const response = await api.post("/refresh");
    return response.data;
  },
};

// Expenses API
export const expensesAPI = {
  getExpenses: async (
    month?: number,
    year?: number
  ): Promise<ExpenseWithPayments[]> => {
    const params = new URLSearchParams();
    if (month) params.append("month", month.toString());
    if (year) params.append("year", year.toString());

    const response = await api.get(`/expenses?${params.toString()}`);
    return response.data;
  },

  getExpense: async (id: string): Promise<ExpenseWithPayments> => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  createExpense: async (
    expense: Omit<Expense, "id" | "created_at" | "created_by">
  ): Promise<Expense> => {
    const response = await api.post("/expenses", expense);
    return response.data;
  },
};

// Payments API
export const paymentsAPI = {
  createPayment: async (
    payment: Omit<Payment, "id" | "created_at">
  ): Promise<Payment> => {
    const response = await api.post("/payments", payment);
    return response.data;
  },

  getUserPayments: async (userId: string): Promise<Payment[]> => {
    const response = await api.get(`/payments/user/${userId}`);
    return response.data;
  },
};

// Documents API
export const documentsAPI = {
  getDocuments: async (month?: number, year?: number): Promise<Document[]> => {
    const params = new URLSearchParams();
    if (month) params.append("month", month.toString());
    if (year) params.append("year", year.toString());

    const response = await api.get(`/documents?${params.toString()}`);
    return response.data;
  },

  uploadDocument: async (
    file: File,
    title: string,
    expenseId?: string,
    month?: number,
    year?: number
  ): Promise<Document> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    if (expenseId) formData.append("expense_id", expenseId);
    if (month) formData.append("month", month.toString());
    if (year) formData.append("year", year.toString());

    const response = await api.post("/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  downloadDocument: async (id: string): Promise<Blob> => {
    const response = await api.get(`/documents/${id}/download`, {
      responseType: "blob",
    });
    return response.data;
  },
};

// Analytics API
export const analyticsAPI = {
  getExpenseAnalytics: async (year?: number): Promise<AnalyticsData> => {
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());

    const response = await api.get(`/analytics/expenses?${params.toString()}`);
    return response.data;
  },
};

// Location API
export const locationAPI = {
  getLocationByZipcode: async (zipcode: string, country?: string): Promise<ZipcodeResponse> => {
    try {
      let apiUrl = '';
      
      // Determine API URL based on country
      if (!country) {
        // Default to US if no country provided
        apiUrl = `https://api.zippopotam.us/us/${zipcode}`;
      } else if (country.toLowerCase().includes('united states') || country.toLowerCase().includes('usa') || country.toLowerCase().includes('us')) {
        apiUrl = `https://api.zippopotam.us/us/${zipcode}`;
      } else if (country.toLowerCase().includes('india')) {
        // Try multiple approaches for India
        return await getIndianLocationData(zipcode);
      } else if (country.toLowerCase().includes('canada')) {
        apiUrl = `https://api.zippopotam.us/ca/${zipcode}`;
      } else if (country.toLowerCase().includes('united kingdom') || country.toLowerCase().includes('uk')) {
        apiUrl = `https://api.zippopotam.us/gb/${zipcode}`;
      } else {
        throw new Error('Auto-fill not supported for this country');
      }

      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        return {
          state: data.places[0]['state abbreviation'] || data.places[0]['state'],
          city: data.places[0]['place name']
        };
      }
      throw new Error('Invalid zipcode');
    } catch (error) {
      throw new Error('Failed to fetch location data');
    }
  },

  getApartments: async (searchTerm?: string, zipcode?: string): Promise<ApartmentOption[]> => {
    const params = new URLSearchParams();
    if (searchTerm) params.append("search", searchTerm);
    if (zipcode) params.append("zipcode", zipcode);
    
    const response = await api.get(`/apartments?${params.toString()}`);
    
    // Handle the API response format: { message: [...], status: "SUCCESS" }
    if (response.data && response.data.status === "SUCCESS" && Array.isArray(response.data.message)) {
      return response.data.message;
    } else if (Array.isArray(response.data)) {
      // Fallback for direct array response
      return response.data;
    } else {
      // If no valid data, return empty array
      return [];
    }
  },

  getBuildingsByApartment: async (apartmentId: string): Promise<BuildingOption[]> => {
    const response = await api.get(`/apartments/${apartmentId}/buildings`);
    return response.data;
  },
};

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    /* const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { token } = await authAPI.refreshToken();
        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = "Bearer " + token;
        return api(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure (e.g., redirect to login)
        return Promise.reject(refreshError);
      }
    } */
    return Promise.reject(error);
  }
);

export default api;