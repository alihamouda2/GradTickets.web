export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://grad-tickets.runasp.net";

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/Auth/login`,
    CHANGE_PASSWORD: `${API_BASE_URL}/api/Auth/change-password`,
  },
  ADMIN: {
    GRADUATES: `${API_BASE_URL}/api/Admin/graduates`,
    GRADUATE_BY_ID: (id: number | string) => `${API_BASE_URL}/api/Admin/graduates/${id}`,
    GENERATE_TICKETS: `${API_BASE_URL}/api/Admin/graduates/generate-tickets`,
  },
} as const;
