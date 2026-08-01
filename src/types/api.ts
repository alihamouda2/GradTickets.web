/**
 * Generic API Response wrapper matching server response pattern:
 * {
 *   "success": boolean,
 *   "message": string,
 *   "data": T
 * }
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}
