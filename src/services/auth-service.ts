import { ENDPOINTS } from "@/constants/endpoints";
import { apiClient } from "@/lib/api-client";
import { setCookie, getCookie, removeCookie } from "@/lib/cookies";
import { ApiResponse } from "@/types/api";
import { LoginData, LoginRequest, ChangePasswordRequest } from "@/types/auth";

export class AuthService {

  /**
   * Execute Login API call to https://grad-tickets.runasp.net/api/Auth/login
   */
  static async login(credentials: LoginRequest): Promise<ApiResponse<LoginData>> {
    const response = await apiClient<LoginData>(ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data) {
      // Store JWT token in cookie
      setCookie("token", response.data.token, 7);

      // Store user details in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("user_name", response.data.name);
        localStorage.setItem("user_role", String(response.data.role));
        localStorage.setItem("is_first_login", String(response.data.isFirstLogin));
      }
    }

    return response;
  }

  /**
   * Clear session token and cookies on logout
   */
  static logout(): void {
    removeCookie("token");
    if (typeof window !== "undefined") {
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_role");
      localStorage.removeItem("is_first_login");
    }
  }

  /**
   * Get active user info from storage/cookie
   */
  static getUserSession() {
    if (typeof window === "undefined") return null;
    const token = getCookie("token");
    const name = localStorage.getItem("user_name");
    const roleStr = localStorage.getItem("user_role");
    const role = roleStr ? parseInt(roleStr, 10) : null;

    if (!token) return null;

    return {
      token,
      name,
      role,
    };
  }

  /**
   * Change Password for the logged in user
   * POST https://grad-tickets.runasp.net/api/Auth/change-password
   * Body: { currentPassword, newPassword, confirmNewPassword }
   */
  static async changePassword(
    data: ChangePasswordRequest
  ): Promise<ApiResponse<null>> {
    return apiClient<null>(ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

