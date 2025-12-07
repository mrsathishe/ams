# Frontend API Documentation - AMS (Apartment Management System)

## Base URL
```
http://localhost:5000/api
```

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. After login, you'll receive an access token and refresh token.

### Token Types
- **Access Token**: Used for API requests (expires in 24 hours)
- **Refresh Token**: Used to get new access tokens (expires in 30 days)

### Headers for Protected Routes
```javascript
headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <access_token>'
}
```

---

## 🔓 Public Endpoints (No Authentication Required)

### 1. User Registration
**Endpoint:** `POST /register`

**Description:** Register a new user with location and apartment details.

**Request Body:**
```javascript
{
  "email": "user@example.com",
  "name": "John Doe", 
  "password": "SecurePassword123!",
  "phone": "9876543210",
  "apartmentName": "MP MILAN & MP LIVIT",
  "buildingName": "MP MILAN",
  "flatNumber": "101",
  "floorNumber": "1",
  "subscribeToNotifications": true,
  "locationDetails": {
    "country": "India",
    "zipcode": "600075",
    "state": "Tamil Nadu", 
    "city": "Kanchipuram",
    "apartmentName": "MP MILAN & MP LIVIT",
    "buildingName": "MP MILAN"
  }
}
```

**Success Response (201):**
```javascript
{
  "status": "SUCCESS",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "P0001",
      "email": "user@example.com",
      "name": "John Doe",
      "phone": "9876543210",
      "apartmentName": "MP MILAN & MP LIVIT",
      "buildingName": "MP MILAN",
      "flatNumber": "101",
      "floorNumber": "1",
      "locationDetails": {
        "country": "India",
        "zipcode": "600075",
        "state": "Tamil Nadu",
        "city": "Kanchipuram"
      },
      "createdAt": "2024-12-06T10:30:00Z"
    }
  }
}
```

**Frontend Example:**
```javascript
const registerUser = async (userData) => {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    const result = await response.json();
    
    if (result.status === 'SUCCESS') {
      console.log('User registered:', result.data.user);
      // Redirect to login page
      window.location.href = '/login';
    } else {
      console.error('Registration failed:', result.message);
    }
  } catch (error) {
    console.error('Registration error:', error);
  }
};
```

### 2. User Login
**Endpoint:** `POST /login`

**Description:** Authenticate user and receive JWT tokens.

**Request Body:**
```javascript
{
  "identifier": "user@example.com", // Can be email or phone number
  "password": "SecurePassword123!"
}
```

**Success Response (200):**
```javascript
{
  "status": "SUCCESS",
  "message": "Login successful.",
  "data": {
    "user": {
      "id": "P0001",
      "email": "user@example.com",
      "name": "John Doe",
      "phone": "9876543210",
      "role": "user",
      "apartmentName": "MP MILAN & MP LIVIT",
      "buildingName": "MP MILAN",
      "flatNumber": "101",
      "floorNumber": "1",
      "locationDetails": {
        "country": "India",
        "zipcode": "600075",
        "state": "Tamil Nadu",
        "city": "Kanchipuram"
      }
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "token_type": "Bearer",
      "expires_in": 86400
    }
  }
}
```

**Frontend Example:**
```javascript
const loginUser = async (credentials) => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });
    
    const result = await response.json();
    
    if (result.status === 'SUCCESS') {
      // Store tokens in localStorage (or secure storage)
      localStorage.setItem('access_token', result.data.tokens.access_token);
      localStorage.setItem('refresh_token', result.data.tokens.refresh_token);
      localStorage.setItem('user', JSON.stringify(result.data.user));
      
      console.log('Login successful:', result.data.user);
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } else {
      console.error('Login failed:', result.message);
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};
```

### 3. Token Refresh
**Endpoint:** `POST /refresh`

**Description:** Get new access token using refresh token.

**Request Body:**
```javascript
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```javascript
{
  "status": "SUCCESS", 
  "message": "Tokens refreshed successfully.",
  "data": {
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "token_type": "Bearer",
      "expires_in": 86400
    }
  }
}
```

**Frontend Example:**
```javascript
const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    
    const response = await fetch('/api/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken })
    });
    
    const result = await response.json();
    
    if (result.status === 'SUCCESS') {
      // Update stored tokens
      localStorage.setItem('access_token', result.data.tokens.access_token);
      localStorage.setItem('refresh_token', result.data.tokens.refresh_token);
      return result.data.tokens.access_token;
    } else {
      // Refresh failed, redirect to login
      localStorage.clear();
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    localStorage.clear();
    window.location.href = '/login';
  }
};
```

### 4. Get All Apartments
**Endpoint:** `GET /apartments`

**Description:** Get all apartments with optional search and filtering.

**Query Parameters:**
- `search` (optional): Search apartments by name
- `zipcode` (optional): Filter apartments by zipcode

**Examples:**
```javascript
// Get all apartments
GET /api/apartments

// Search apartments by name
GET /api/apartments?search=MP

// Filter by zipcode  
GET /api/apartments?zipcode=600075

// Combined search and filter
GET /api/apartments?search=MP&zipcode=600075
```

**Success Response (200):**
```javascript
{
  "status": "SUCCESS",
  "message": [
    {
      "id": "apt_mp001",
      "name": "MP MILAN & MP LIVIT",
      "address": "Plot No. 44B, Srinivasan Street, LIC Colony Extension, Pammal",
      "city": "Kanchipuram",
      "state": "Tamil Nadu", 
      "zipcode": "600075",
      "buildings": [
        {
          "id": "bld_mp001a",
          "name": "MP MILAN",
          "floors": 10,
          "totalUnits": 100
        },
        {
          "id": "bld_mp001b",
          "name": "MP LIVIT", 
          "floors": 12,
          "totalUnits": 120
        }
      ]
    }
  ]
}
```

**Frontend Example:**
```javascript
const searchApartments = async (searchParams = {}) => {
  try {
    const queryString = new URLSearchParams(searchParams).toString();
    const url = `/api/apartments${queryString ? '?' + queryString : ''}`;
    
    const response = await fetch(url);
    const result = await response.json();
    
    if (result.status === 'SUCCESS') {
      return result.message; // Array of apartments
    } else {
      console.error('Failed to fetch apartments:', result.message);
      return [];
    }
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

// Usage examples:
const allApartments = await searchApartments();
const mpApartments = await searchApartments({ search: 'MP' });
const apartmentsIn600075 = await searchApartments({ zipcode: '600075' });
```

### 5. Get Buildings by Apartment
**Endpoint:** `GET /apartments/{apartmentId}/buildings`

**Description:** Get all buildings for a specific apartment.

**Example:**
```javascript
GET /api/apartments/apt_mp001/buildings
```

**Success Response (200):**
```javascript
{
  "status": "SUCCESS",
  "message": [
    {
      "id": "bld_mp001a",
      "name": "MP MILAN",
      "floors": 10,
      "totalUnits": 100
    },
    {
      "id": "bld_mp001b", 
      "name": "MP LIVIT",
      "floors": 12,
      "totalUnits": 120
    }
  ]
}
```

**Frontend Example:**
```javascript
const getBuildingsByApartment = async (apartmentId) => {
  try {
    const response = await fetch(`/api/apartments/${apartmentId}/buildings`);
    const result = await response.json();
    
    if (result.status === 'SUCCESS') {
      return result.message; // Array of buildings
    } else {
      console.error('Failed to fetch buildings:', result.message);
      return [];
    }
  } catch (error) {
    console.error('Buildings fetch error:', error);
    return [];
  }
};

// Usage:
const buildings = await getBuildingsByApartment('apt_mp001');
```

---

## 🔒 Protected Endpoints (JWT Authentication Required)

### Helper Function for Authenticated Requests
```javascript
const makeAuthenticatedRequest = async (url, options = {}) => {
  const accessToken = localStorage.getItem('access_token');
  
  const authOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      ...options.headers
    }
  };
  
  try {
    let response = await fetch(url, authOptions);
    
    // If token expired, try to refresh
    if (response.status === 401) {
      const newToken = await refreshToken();
      if (newToken) {
        authOptions.headers.Authorization = `Bearer ${newToken}`;
        response = await fetch(url, authOptions);
      }
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};
```

### 1. Get Current User Details
**Endpoint:** `GET /user`

**Description:** Get details of the currently authenticated user.

**Headers Required:**
```javascript
Authorization: Bearer <access_token>
```

**Success Response (200):**
```javascript
{
  "status": "SUCCESS",
  "message": "User details retrieved successfully",
  "data": {
    "id": "P0001",
    "name": "John Doe",
    "email": "user@example.com", 
    "phone": "9876543210",
    "role": "user",
    "apartmentName": "MP MILAN & MP LIVIT",
    "buildingName": "MP MILAN",
    "flatNumber": "101",
    "floorNumber": "1",
    "subscribeToNotifications": true,
    "locationDetails": {
      "country": "India",
      "zipcode": "600075",
      "state": "Tamil Nadu",
      "city": "Kanchipuram"
    }
  }
}
```

**Frontend Example:**
```javascript
const getCurrentUser = async () => {
  try {
    const response = await makeAuthenticatedRequest('/api/user');
    const result = await response.json();
    
    if (result.status === 'SUCCESS') {
      return result.data;
    } else {
      console.error('Failed to get user details:', result.message);
      return null;
    }
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
};

// Usage:
const userData = await getCurrentUser();
if (userData) {
  console.log('Current user:', userData);
}
```

### 2. Update Password
**Endpoint:** `POST /updatePassword`

**Description:** Update the current user's password.

**Headers Required:**
```javascript
Authorization: Bearer <access_token>
```

**Request Body:**
```javascript
{
  "oldPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

**Success Response (200):**
```javascript
{
  "status": "SUCCESS",
  "message": "Password updated successfully."
}
```

**Frontend Example:**
```javascript
const updatePassword = async (passwordData) => {
  try {
    const response = await makeAuthenticatedRequest('/api/updatePassword', {
      method: 'POST',
      body: JSON.stringify(passwordData)
    });
    
    const result = await response.json();
    
    if (result.status === 'SUCCESS') {
      console.log('Password updated successfully');
      return true;
    } else {
      console.error('Password update failed:', result.message);
      return false;
    }
  } catch (error) {
    console.error('Password update error:', error);
    return false;
  }
};

// Usage:
const success = await updatePassword({
  oldPassword: 'OldPassword123!',
  newPassword: 'NewPassword123!'
});
```

### 3. Logout
**Endpoint:** `POST /logout`

**Description:** Logout the current user (invalidate tokens on server side).

**Headers Required:**
```javascript
Authorization: Bearer <access_token>
```

**Success Response (200):**
```javascript
{
  "status": "SUCCESS",
  "message": "Logout successful."
}
```

**Frontend Example:**
```javascript
const logoutUser = async () => {
  try {
    await makeAuthenticatedRequest('/api/logout', {
      method: 'POST'
    });
    
    // Clear local storage regardless of server response
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    // Redirect to login
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout error:', error);
    // Clear storage even if server request fails
    localStorage.clear();
    window.location.href = '/login';
  }
};
```

---

## 🛡️ Admin-Only Endpoints (Admin Role Required)

### 1. Get All Users (Admin Only)
**Endpoint:** `GET /admin/users`

**Description:** Get list of all users (admin only).

**Headers Required:**
```javascript
Authorization: Bearer <admin_access_token>
```

**Success Response (200):**
```javascript
{
  "status": "SUCCESS",
  "message": "Admin users endpoint - would list all users"
}
```

**Frontend Example:**
```javascript
const getAllUsers = async () => {
  try {
    const response = await makeAuthenticatedRequest('/api/admin/users');
    const result = await response.json();
    
    if (result.status === 'SUCCESS') {
      return result.data; // Array of users
    } else if (response.status === 403) {
      console.error('Access denied: Admin role required');
      return null;
    }
  } catch (error) {
    console.error('Admin users error:', error);
    return null;
  }
};
```

---

## 🏥 Health Check

### Health Check
**Endpoint:** `GET /health`

**Description:** Check if the API is running.

**Success Response (200):**
```javascript
{
  "status": "SUCCESS",
  "message": "API is healthy",
  "version": "1.0.0"
}
```

**Frontend Example:**
```javascript
const checkAPIHealth = async () => {
  try {
    const response = await fetch('/api/health');
    const result = await response.json();
    return result.status === 'SUCCESS';
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};
```

---

## 🔧 Frontend JWT Authentication Flow

### Complete Authentication Service
```javascript
class AuthService {
  constructor() {
    this.baseURL = '/api';
  }
  
  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('access_token');
    if (!token) return false;
    
    try {
      // Simple check - in production you might want to validate expiry
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }
  
  // Get current user from storage
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  
  // Auto-refresh token before expiry
  async setupTokenRefresh() {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000;
      const currentTime = Date.now();
      const timeUntilExpiry = expiryTime - currentTime;
      
      // Refresh 5 minutes before expiry
      const refreshTime = Math.max(timeUntilExpiry - 300000, 60000);
      
      setTimeout(() => {
        this.refreshToken();
      }, refreshTime);
    } catch (error) {
      console.error('Token refresh setup error:', error);
    }
  }
  
  // Login method
  async login(credentials) {
    const response = await fetch(`${this.baseURL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    const result = await response.json();
    
    if (result.status === 'SUCCESS') {
      this.setTokens(result.data.tokens);
      this.setUser(result.data.user);
      this.setupTokenRefresh();
      return result.data;
    } else {
      throw new Error(result.message);
    }
  }
  
  // Refresh token method  
  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      this.logout();
      return null;
    }
    
    try {
      const response = await fetch(`${this.baseURL}/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken })
      });
      
      const result = await response.json();
      
      if (result.status === 'SUCCESS') {
        this.setTokens(result.data.tokens);
        this.setupTokenRefresh();
        return result.data.tokens.access_token;
      } else {
        this.logout();
        return null;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      return null;
    }
  }
  
  // Set tokens in storage
  setTokens(tokens) {
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
  }
  
  // Set user in storage
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
  
  // Logout method
  async logout() {
    try {
      await this.makeAuthenticatedRequest('/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout request error:', error);
    }
    
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  
  // Make authenticated requests
  async makeAuthenticatedRequest(endpoint, options = {}) {
    const accessToken = localStorage.getItem('access_token');
    
    const authOptions = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        ...options.headers
      }
    };
    
    let response = await fetch(`${this.baseURL}${endpoint}`, authOptions);
    
    // If token expired, try to refresh
    if (response.status === 401) {
      const newToken = await this.refreshToken();
      if (newToken) {
        authOptions.headers.Authorization = `Bearer ${newToken}`;
        response = await fetch(`${this.baseURL}${endpoint}`, authOptions);
      }
    }
    
    return response;
  }
}

// Usage:
const auth = new AuthService();

// Initialize on app start
if (auth.isAuthenticated()) {
  auth.setupTokenRefresh();
}
```

---

## 📱 Registration Flow Implementation

### Complete Registration Component Example
```javascript
const RegistrationFlow = () => {
  const [step, setStep] = useState(1); // 1: Location, 2: Apartment, 3: Registration
  const [formData, setFormData] = useState({
    // Personal info
    email: '',
    name: '',
    password: '',
    phone: '',
    flatNumber: '',
    floorNumber: '',
    subscribeToNotifications: true,
    
    // Location info (filled during flow)
    apartmentName: '',
    buildingName: '',
    locationDetails: {}
  });
  
  // Step 1: Location Detection/Input
  const LocationStep = () => {
    const [zipcode, setZipcode] = useState('');
    
    const handleZipcodeSubmit = () => {
      setFormData(prev => ({
        ...prev,
        locationDetails: { ...prev.locationDetails, zipcode }
      }));
      setStep(2);
    };
    
    return (
      <div>
        <h2>Enter Your Location</h2>
        <input
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value)}
          placeholder="Enter zipcode"
          required
        />
        <button onClick={handleZipcodeSubmit}>
          Find Apartments
        </button>
      </div>
    );
  };
  
  // Step 2: Apartment Selection
  const ApartmentStep = () => {
    const [apartments, setApartments] = useState([]);
    const [selectedApartment, setSelectedApartment] = useState(null);
    const [buildings, setBuildings] = useState([]);
    
    useEffect(() => {
      searchApartments({ zipcode: formData.locationDetails.zipcode })
        .then(setApartments);
    }, []);
    
    const handleApartmentSelect = async (apartment) => {
      setSelectedApartment(apartment);
      const apartmentBuildings = await getBuildingsByApartment(apartment.id);
      setBuildings(apartmentBuildings);
    };
    
    const handleBuildingSelect = (building) => {
      setFormData(prev => ({
        ...prev,
        apartmentName: selectedApartment.name,
        buildingName: building.name,
        locationDetails: {
          ...prev.locationDetails,
          country: 'India',
          state: selectedApartment.state,
          city: selectedApartment.city,
          apartmentName: selectedApartment.name,
          buildingName: building.name
        }
      }));
      setStep(3);
    };
    
    return (
      <div>
        <h2>Select Your Apartment & Building</h2>
        
        {!selectedApartment ? (
          <div>
            <h3>Available Apartments:</h3>
            {apartments.map(apt => (
              <div key={apt.id} onClick={() => handleApartmentSelect(apt)}>
                <h4>{apt.name}</h4>
                <p>{apt.address}</p>
                <p>{apt.city}, {apt.state}</p>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <h3>Selected: {selectedApartment.name}</h3>
            <h4>Choose Building:</h4>
            {buildings.map(building => (
              <div key={building.id} onClick={() => handleBuildingSelect(building)}>
                <h5>{building.name}</h5>
                <p>{building.floors} floors, {building.totalUnits} units</p>
              </div>
            ))}
          </div>
        )}
        
        <button onClick={() => setStep(1)}>Back</button>
      </div>
    );
  };
  
  // Step 3: Personal Information
  const RegistrationStep = () => {
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      
      try {
        await registerUser(formData);
        // Redirect to login or dashboard
        window.location.href = '/login';
      } catch (error) {
        console.error('Registration failed:', error);
        // Handle error (show message to user)
      } finally {
        setLoading(false);
      }
    };
    
    return (
      <div>
        <h2>Complete Your Registration</h2>
        
        {/* Location Summary */}
        <div className="location-summary">
          <h3>Selected Location:</h3>
          <p><strong>Apartment:</strong> {formData.apartmentName}</p>
          <p><strong>Building:</strong> {formData.buildingName}</p>
          <p><strong>City:</strong> {formData.locationDetails.city}</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
            placeholder="Email"
            required
          />
          
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
            placeholder="Full Name"
            required
          />
          
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
            placeholder="Password"
            required
          />
          
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
            placeholder="Phone Number"
            required
          />
          
          <input
            type="text"
            value={formData.flatNumber}
            onChange={(e) => setFormData(prev => ({...prev, flatNumber: e.target.value}))}
            placeholder="Flat Number"
            required
          />
          
          <input
            type="text"
            value={formData.floorNumber}
            onChange={(e) => setFormData(prev => ({...prev, floorNumber: e.target.value}))}
            placeholder="Floor Number (Optional)"
          />
          
          <label>
            <input
              type="checkbox"
              checked={formData.subscribeToNotifications}
              onChange={(e) => setFormData(prev => ({...prev, subscribeToNotifications: e.target.checked}))}
            />
            Subscribe to notifications
          </label>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <button onClick={() => setStep(2)}>Back</button>
      </div>
    );
  };
  
  // Render current step
  return (
    <div>
      {step === 1 && <LocationStep />}
      {step === 2 && <ApartmentStep />}  
      {step === 3 && <RegistrationStep />}
    </div>
  );
};
```

---

## 🚨 Error Handling

### Common Error Responses
```javascript
// 400 Bad Request
{
  "status": "FAILURE",
  "message": "Validation errors",
  "data": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters"
  }
}

// 401 Unauthorized  
{
  "status": "FAILURE",
  "message": "Invalid or expired token"
}

// 403 Forbidden
{
  "status": "FAILURE", 
  "message": "Admin access required"
}

// 404 Not Found
{
  "status": "FAILURE",
  "message": "Apartment not found"
}

// 409 Conflict
{
  "status": "FAILURE",
  "message": "User with this email already exists."
}

// 500 Internal Server Error
{
  "status": "FAILURE",
  "message": "Internal server error occurred."
}
```

### Error Handling Utility
```javascript
const handleAPIError = (error, response) => {
  if (response?.status === 401) {
    // Token expired or invalid
    localStorage.clear();
    window.location.href = '/login';
    return 'Please login again';
  } else if (response?.status === 403) {
    return 'Access denied';
  } else if (response?.status === 404) {
    return 'Resource not found';
  } else if (response?.status === 409) {
    return 'Resource already exists';
  } else {
    return error.message || 'An unexpected error occurred';
  }
};
```

---

## 📋 Summary

### Public Endpoints (No Auth)
- `POST /register` - User registration
- `POST /login` - User authentication  
- `POST /refresh` - Token refresh
- `GET /apartments` - Search apartments
- `GET /apartments/{id}/buildings` - Get buildings
- `GET /health` - Health check

### Protected Endpoints (JWT Required)
- `GET /user` - Get current user
- `POST /updatePassword` - Update password
- `POST /logout` - User logout

### Admin Endpoints (Admin Role Required)  
- `GET /admin/users` - Get all users

### Key Features
- ✅ JWT authentication with access/refresh tokens
- ✅ Location-based apartment search
- ✅ Multi-step registration flow
- ✅ Automatic token refresh
- ✅ Role-based access control
- ✅ Comprehensive error handling

This documentation provides everything needed to integrate your frontend with the JWT-protected API!