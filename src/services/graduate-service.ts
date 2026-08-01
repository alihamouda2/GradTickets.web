import { ENDPOINTS } from "@/constants/endpoints";
import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types/api";
import { GeneratedTicketItem } from "@/types/graduate";

export class GraduateService {
  /**
   * Fetch all tickets for the logged in graduate
   * GET https://grad-tickets.runasp.net/api/Graduate/tickets
   */
  static async getTickets(): Promise<ApiResponse<GeneratedTicketItem[]>> {
    return apiClient<GeneratedTicketItem[]>(ENDPOINTS.GRADUATE.TICKETS, {
      method: "GET",
    });
  }

  /**
   * Fetch single ticket details by ticket ID
   * GET https://grad-tickets.runasp.net/api/Graduate/tickets/{id}
   */
  static async getTicketById(id: number | string): Promise<ApiResponse<GeneratedTicketItem>> {
    return apiClient<GeneratedTicketItem>(ENDPOINTS.GRADUATE.TICKET_BY_ID(id), {
      method: "GET",
    });
  }
}
