export enum UserRole {
  Admin = 1,
  Graduate = 2,
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginData {
  token: string;
  name: string;
  role: UserRole | number;
  isFirstLogin: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface FirstLoginChangePasswordRequest {
  newPassword: string;
  confirmPassword: string;
}


