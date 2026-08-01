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

export enum TicketStatusEnum {
  VALID = 1,
  USED = 2,
  CANCELLED = 3,
}

export function getTicketStatusInfo(status: number) {
  switch (status) {
    case 1:
      return {
        label: "سارية",
        badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
        dotColor: "bg-emerald-500",
        description: "التذكرة صالحة ومتاحة للدخول عند البوابة.",
      };
    case 2:
      return {
        label: "مستخدمة",
        badgeBg: "bg-blue-50 text-blue-800 border-blue-200",
        dotColor: "bg-blue-500",
        description: "تم استخدام هذه التذكرة ومسحها عند بوابة الدخول.",
      };
    case 3:
      return {
        label: "ملغاة",
        badgeBg: "bg-rose-50 text-rose-800 border-rose-200",
        dotColor: "bg-rose-500",
        description: "تم إلغاء هذه التذكرة ولا يمكن استخدامها.",
      };
    default:
      return {
        label: "غير معروفة",
        badgeBg: "bg-slate-50 text-slate-700 border-slate-200",
        dotColor: "bg-slate-400",
        description: "حالة التذكرة غير معروفة.",
      };
  }
}

