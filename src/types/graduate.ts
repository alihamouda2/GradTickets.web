export interface GraduateItem {
  id: number;
  name: string;
  email: string;
  role: number;
  isActive: boolean;
  isFirstLogin: boolean;
  createdAt: string;
  updatedAt: string;
  ticketsCount: number;
  ticketsUsedCount: number;
  ticketsUnusedCount: number;
  ticketsCancelledCount: number;
}

export interface GenerateTicketsRequest {
  graduateIds: number[];
  quantityPerGraduate: number;
}

export interface UpdateGraduateRequest {
  name: string;
  email: string;
  isActive: boolean;
  password?: string;
}


export interface GeneratedTicketItem {
  id: number;
  graduateId: number;
  graduateName: string;
  ticketCode: string;
  status: number;
  scannedAt: string | null;
  createdAt: string;
}

export interface GenerateTicketsResponseData {
  totalTicketsGenerated: number;
  totalGraduatesProcessed: number;
  tickets: GeneratedTicketItem[];
}
