import { ProfileResponse } from "va-hybrid-types/contentTypes";

interface AuthResponse {
  user: ProfileResponse;
  token: string;
  message: string;
}

export const authService = {
  // Verify Google token with backend and get JWT token
  verifyGoogleToken: async (idToken: string): Promise<AuthResponse> => {
    const authApiUrl = process.env.NEXT_PUBLIC_AUTH_API;
    if (!authApiUrl) {
      throw new Error("Auth API URL not configured");
    }

    const response = await fetch(`${authApiUrl}/auth/google/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idToken,
      }),
    });

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.status}. User may have been blocked.`);
    }

    const authResponse = await response.json();

    if (!authResponse.user || !authResponse.token) {
      throw new Error("Invalid response format from backend");
    }

    return authResponse;
  },

  // Store token in localStorage
  storeToken: (token: string): void => {
    localStorage.setItem("authToken", token);
  },

  // Get token from localStorage
  getToken: (): string | null => {
    return localStorage.getItem("authToken");
  },

  // Remove token from localStorage
  removeToken: (): void => {
    localStorage.removeItem("authToken");
  },
};