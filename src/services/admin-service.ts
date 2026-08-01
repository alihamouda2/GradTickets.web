import { ENDPOINTS } from "@/constants/endpoints";
import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types/api";
import { GraduateItem, GenerateTicketsRequest, GenerateTicketsResponseData, UpdateGraduateRequest } from "@/types/graduate";


export class AdminService {
  /**
   * Fetch list of graduates for admin
   * GET https://grad-tickets.runasp.net/api/Admin/graduates
   */
  static async getGraduates(): Promise<ApiResponse<GraduateItem[]>> {
    return apiClient<GraduateItem[]>(ENDPOINTS.ADMIN.GRADUATES, {
      method: "GET",
    });
  }

  /**
   * Fetch single graduate details by ID
   * GET https://grad-tickets.runasp.net/api/Admin/graduates/{id}
   */
  static async getGraduateById(id: number | string): Promise<ApiResponse<GraduateItem>> {
    return apiClient<GraduateItem>(ENDPOINTS.ADMIN.GRADUATE_BY_ID(id), {
      method: "GET",
    });
  }

  /**
   * Create a new graduate
   * POST https://grad-tickets.runasp.net/api/Admin/graduates
   * Body: { "name": "string" }
   */
  static async createGraduate(name: string): Promise<ApiResponse<GraduateItem>> {
    return apiClient<GraduateItem>(ENDPOINTS.ADMIN.GRADUATES, {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  }

  /**
   * Generate tickets for selected graduates
   * POST https://grad-tickets.runasp.net/api/Admin/graduates/generate-tickets
   * Body: { "graduateIds": number[], "quantityPerGraduate": number }
   */
  static async generateTickets(
    data: GenerateTicketsRequest
  ): Promise<ApiResponse<GenerateTicketsResponseData>> {
    return apiClient<GenerateTicketsResponseData>(ENDPOINTS.ADMIN.GENERATE_TICKETS, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete single graduate by ID
   * DELETE https://grad-tickets.runasp.net/api/Admin/graduates/{id}
   */
  static async deleteGraduate(id: number | string): Promise<ApiResponse<null>> {
    return apiClient<null>(ENDPOINTS.ADMIN.GRADUATE_BY_ID(id), {
      method: "DELETE",
    });
  }

  /**
   * Update an existing graduate by ID
   * PUT https://grad-tickets.runasp.net/api/Admin/graduates/{id}
   * Body: { name, email, isActive, password }
   */
  static async updateGraduate(
    id: number | string,
    data: UpdateGraduateRequest
  ): Promise<ApiResponse<GraduateItem>> {
    return apiClient<GraduateItem>(ENDPOINTS.ADMIN.GRADUATE_BY_ID(id), {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
}


