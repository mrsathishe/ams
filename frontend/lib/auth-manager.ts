// Import React for the hook
import React from "react";

// Authentication utility functions
export interface AuthUser {
  id: string;
  username: string;
  email?: string;
  fullName?: string;
  role?: string;
  authMethod: string;
  timestamp: string;
  token?: string;
  tokenType?: string;
  expiresAt?: number;
  isAuthenticated: boolean;
  userDetails?: any; // Complete user details from /users/me endpoint
}

export class AuthManager {
  private static readonly AUTH_KEY = "auth_user";

  // Store user authentication data
  static setAuthUser(user: AuthUser): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.AUTH_KEY, JSON.stringify(user));
    }
  }

  // Get current authenticated user
  static getAuthUser(): AuthUser | null {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(this.AUTH_KEY);
      if (stored) {
        try {
          const user = JSON.parse(stored) as AuthUser;

          // Check if token has expired
          if (
            user.expiresAt &&
            user.expiresAt < Math.floor(Date.now() / 1000)
          ) {
            console.log("Token has expired, clearing auth data");
            this.clearAuthUser();
            return null;
          }

          return user;
        } catch (error) {
          console.error("Error parsing stored auth user:", error);
          this.clearAuthUser();
        }
      }
    }
    return null;
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const user = this.getAuthUser();
    return user?.isAuthenticated === true;
  }

  // Clear authentication data
  static clearAuthUser(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.AUTH_KEY);
    }
  }

  // Logout function
  static logout(): void {
    this.clearAuthUser();
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }

  // Get user role
  static getUserRole(): "admin" | "user" | null {
    const user = this.getAuthUser();
    if (!user) return null;

    // Use the role from token if available, otherwise fallback to username check
    if (user.role) {
      return user.role as "admin" | "user";
    }

    // Fallback: check if username contains 'admin'
    return user.username.includes("admin") ? "admin" : "user";
  }

  // Get authentication token
  static getAuthToken(): string | null {
    const user = this.getAuthUser();
    return user?.token || null;
  }

  // Check if token is expired
  static isTokenExpired(): boolean {
    const user = this.getAuthUser();
    if (!user || !user.expiresAt) return false;
    return user.expiresAt < Math.floor(Date.now() / 1000);
  }

  // Fetch fresh user details from backend
  static async fetchUserDetails(): Promise<any | null> {
    const token = this.getAuthToken();
    if (!token) {
      console.error("No auth token available");
      return null;
    }

    try {
      const response = await fetch("http://localhost:8001/users/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userDetails = await response.json();

        // Update stored user data with fresh details
        const currentUser = this.getAuthUser();
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            email: userDetails.email,
            fullName: userDetails.full_name || userDetails.name,
            role: userDetails.role || currentUser.role,
            userDetails: userDetails,
          };
          this.setAuthUser(updatedUser);
        }

        return userDetails;
      } else {
        console.error("Failed to fetch user details:", response.status);

        // If unauthorized, clear auth data
        if (response.status === 401) {
          this.clearAuthUser();
        }

        return null;
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  }

  // Generate callback URL for external authentication
  static generateCallbackUrl(
    baseUrl: string,
    authMethod: "login" | "register"
  ): string {
    const callbackUrl = encodeURIComponent(`${baseUrl}/auth/callback`);
    return `http://localhost:3000/${authMethod}?callback=${callbackUrl}`;
  }
}

// Hook for React components to use authentication
export function useAuth() {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const authUser = AuthManager.getAuthUser();
    setUser(authUser);
    setIsLoading(false);
  }, []);

  const login = (userData: AuthUser) => {
    AuthManager.setAuthUser(userData);
    setUser(userData);
  };

  const logout = () => {
    AuthManager.logout();
    setUser(null);
  };

  return {
    user,
    isAuthenticated: !!user?.isAuthenticated,
    isLoading,
    login,
    logout,
    userRole: AuthManager.getUserRole(),
  };
}
