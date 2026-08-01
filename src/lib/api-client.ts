import { ApiResponse } from "@/types/api";
import { getCookie } from "./cookies";

export async function apiClient<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const token = getCookie("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data: ApiResponse<T> = await response.json();
    return data;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "تعذر الاتصال بالخادم. يرجى التأكد من تشغيل الـ API.";

    return {
      success: false,
      message: errorMessage,
    };
  }
}
