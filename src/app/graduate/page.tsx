"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  LogOut,
  QrCode,
  Ticket,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  AlertTriangle,
  Copy,
  Check,
  KeyRound,
  Printer,
  X,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { AuthService } from "@/services/auth-service";
import { GraduateService } from "@/services/graduate-service";
import { GeneratedTicketItem, getTicketStatusInfo } from "@/types/graduate";
import { ChangePasswordModal } from "@/components/auth/ChangePasswordModal";
import { FirstLoginChangePasswordModal } from "@/components/auth/FirstLoginChangePasswordModal";
import { InvitationCardModal } from "@/components/graduate/InvitationCardModal";


export default function GraduatePage() {
  const [userName, setUserName] = useState<string>("الخريج");
  const [tickets, setTickets] = useState<GeneratedTicketItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "valid" | "used" | "cancelled">("all");

  // Single Ticket Details Modal
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<GeneratedTicketItem | null>(null);
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Modals State
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false);
  const [isFirstLoginOpen, setIsFirstLoginOpen] = useState<boolean>(false);

  // Copy State Notification
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const router = useRouter();

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await GraduateService.getTickets();
      if (response.success && Array.isArray(response.data)) {
        setTickets(response.data);
      } else {
        setError(response.message || "حدث خطأ أثناء جلب التذاكر الخاصة بك.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "تعذر الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const session = AuthService.getUserSession();
    if (session?.name) {
      setUserName(session.name);
    }

    // Mandatory First Login Password Change Enforcement
    if (session?.isFirstLogin || (typeof window !== "undefined" && localStorage.getItem("is_first_login") === "true")) {
      setIsFirstLoginOpen(true);
    }

    fetchTickets();
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    router.push("/login");
  };

  // Copy to Clipboard
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  // Open Single Ticket Detail Modal (GET /api/Graduate/tickets/{id})
  const handleOpenTicketDetails = async (ticketId: number) => {
    setSelectedTicketId(ticketId);
    setLoadingModal(true);
    setModalError(null);
    setSelectedTicket(null);

    try {
      const response = await GraduateService.getTicketById(ticketId);
      if (response.success && response.data) {
        setSelectedTicket(response.data);
      } else {
        setModalError(response.message || "فشل في تحميل تفاصيل التذكرة.");
      }
    } catch (err: unknown) {
      setModalError(err instanceof Error ? err.message : "تعذر الاتصال بالخادم عند جلب تفاصيل التذكرة.");
    } finally {
      setLoadingModal(false);
    }
  };

  // Filter Logic
  const filteredTickets = useMemo(() => {
    return tickets.filter((tkt) => {
      const matchesSearch =
        tkt.ticketCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(tkt.id).includes(searchTerm);

      let matchesFilter = true;
      if (statusFilter === "valid") matchesFilter = tkt.status === 1;
      if (statusFilter === "used") matchesFilter = tkt.status === 2;
      if (statusFilter === "cancelled") matchesFilter = tkt.status === 3;

      return matchesSearch && matchesFilter;
    });
  }, [tickets, searchTerm, statusFilter]);

  // Aggregated Stats
  const totals = useMemo(() => {
    return tickets.reduce(
      (acc, tkt) => {
        acc.total += 1;
        if (tkt.status === 1) acc.valid += 1;
        if (tkt.status === 2) acc.used += 1;
        if (tkt.status === 3) acc.cancelled += 1;
        return acc;
      },
      { total: 0, valid: 0, used: 0, cancelled: 0 }
    );
  }, [tickets]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "غير محدد";
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat("ar-YE", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  // Print Handler
  const handlePrintTicket = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-800" dir="rtl">
      {/* 1. Header Navigation */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-inner">
              <GraduationCap className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-base leading-tight">بوابة الخريجين والدعوات</h1>
              <p className="text-[11px] text-slate-500">GradTickets Student Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsChangePasswordOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              title="تغيير كلمة السر"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">تغيير كلمة السر</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
              title="تسجيل الخروج"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Content Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Banner Section */}
        <section className="relative overflow-hidden bg-gradient-to-l from-slate-950 via-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-4 border border-slate-800">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>منصة حفل التخرج الرسمي</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                مرحباً بك، <span className="text-amber-400">{userName}</span> 🎓
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                استعرض تذاكر حفل التخرج الخاصة بك، واستخدم رمز الـ QR لكل تذكرة عند بوابات الدخول يوم الحفل.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={fetchTickets}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium border border-slate-700 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-amber-400" : ""}`} />
                <span>تحديث التذاكر</span>
              </button>
            </div>
          </div>
        </section>

        {/* 3. Stat Cards Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2 hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium">إجمالي التذاكر والدعوات</span>
              <div className="p-2 bg-slate-100 rounded-xl text-slate-700">
                <Ticket className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{totals.total}</div>
            <p className="text-[11px] text-slate-400">تذكرة مسجلة لحسابك</p>
          </div>

          {/* Valid */}
          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-2 hover:border-emerald-200 transition-all">
            <div className="flex items-center justify-between text-emerald-600">
              <span className="text-xs font-medium text-slate-600">التذاكر السارية (صالحة)</span>
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-700">{totals.valid}</div>
            <p className="text-[11px] text-emerald-600 font-medium">متاحة للدخول</p>
          </div>

          {/* Used */}
          <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm space-y-2 hover:border-blue-200 transition-all">
            <div className="flex items-center justify-between text-blue-600">
              <span className="text-xs font-medium text-slate-600">التذاكر المستخدمة</span>
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                <QrCode className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-700">{totals.used}</div>
            <p className="text-[11px] text-blue-600 font-medium">تم المسح عند البوابة</p>
          </div>

          {/* Cancelled */}
          <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm space-y-2 hover:border-rose-200 transition-all">
            <div className="flex items-center justify-between text-rose-600">
              <span className="text-xs font-medium text-slate-600">التذاكر الملغية</span>
              <div className="p-2 bg-rose-50 rounded-xl text-rose-600">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-rose-700">{totals.cancelled}</div>
            <p className="text-[11px] text-rose-600 font-medium">غير متاحة للدخول</p>
          </div>
        </div>

        {/* 4. Search and Filters Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="بحث عن رمز التذكرة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/20 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                statusFilter === "all"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              جميع التذاكر ({tickets.length})
            </button>
            <button
              onClick={() => setStatusFilter("valid")}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                statusFilter === "valid"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
            >
              سارية ({totals.valid})
            </button>
            <button
              onClick={() => setStatusFilter("used")}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                statusFilter === "used"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              مستخدمة ({totals.used})
            </button>
            <button
              onClick={() => setStatusFilter("cancelled")}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                statusFilter === "cancelled"
                  ? "bg-rose-600 text-white shadow-sm"
                  : "bg-rose-50 text-rose-700 hover:bg-rose-100"
              }`}
            >
              ملغاة ({totals.cancelled})
            </button>
          </div>
        </div>

        {/* Error State Banner */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-rose-800 text-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchTickets}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium transition-colors cursor-pointer"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* 5. Simplified Tickets Grid View (No ticket text & No graduate name) */}
        {loading ? (
          <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
            <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-semibold">جاري تحميل تذاكر الخريج من الخادم...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="py-16 text-center space-y-4 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Ticket className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">لا توجد تذاكر للعرض</h3>
              <p className="text-xs text-slate-400">لم يتم العثور على تذاكر مطابقة لمعايير البحث الحالية.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTickets.map((ticket) => {
              const statusInfo = getTicketStatusInfo(ticket.status);
              const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                ticket.ticketCode
              )}`;

              return (
                <div
                  key={ticket.id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group hover:border-slate-300"
                >
                  {/* Card Header: Ticket ID & Arabic Status Badge ONLY (No Name / No Extra Text) */}
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-amber-500" />
                      <span className="font-mono text-xs font-bold text-slate-600">#{ticket.id}</span>
                    </div>

                    {/* Status Badge in Arabic */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.badgeBg}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${statusInfo.dotColor}`} />
                      <span>{statusInfo.label}</span>
                    </span>
                  </div>

                  {/* Card Body: QR Code & Ticket Code Box ONLY */}
                  <div className="p-6 text-center space-y-4">
                    {/* QR Code Container */}
                    <div
                      onClick={() => handleOpenTicketDetails(ticket.id)}
                      className="w-44 h-44 mx-auto p-3 bg-white rounded-2xl border-2 border-dashed border-slate-200 group-hover:border-slate-900 transition-colors shadow-inner flex items-center justify-center relative cursor-pointer"
                      title="انقر لفتح تفاصيل التذكرة والـ QR الكامل"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={qrCodeUrl}
                        alt={`QR ${ticket.ticketCode}`}
                        className="w-full h-full object-contain rounded-xl"
                      />
                    </div>

                    {/* Ticket Code Box (Simple Code + Copy button) */}
                    <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200/80">
                      <span className="font-mono text-sm font-extrabold text-slate-900 dir-ltr">
                        {ticket.ticketCode}
                      </span>
                      <button
                        onClick={() => handleCopyCode(ticket.ticketCode)}
                        className="text-slate-400 hover:text-slate-700 transition-colors"
                        title="نسخ رمز التذكرة"
                      >
                        {copiedCode === ticket.ticketCode ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Card Footer Info & Details Action */}
                  <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="text-slate-500 space-y-0.5">
                      <p className="text-[11px]">
                        الإصدار: <span className="font-medium text-slate-700">{formatDate(ticket.createdAt)}</span>
                      </p>
                      {ticket.scannedAt && (
                        <p className="text-[10px] text-blue-600 font-semibold">
                          مسحت: {formatDate(ticket.scannedAt)}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleOpenTicketDetails(ticket.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      <span>التفاصيل</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 6. LUXURY 1080x1920 INVITATION CARD MODAL WITH PDF EXPORT */}
      <InvitationCardModal
        isOpen={!!selectedTicketId}
        ticket={selectedTicket}
        loading={loadingModal}
        error={modalError}
        onClose={() => {
          setSelectedTicketId(null);
          setSelectedTicket(null);
        }}
      />

      {/* 7. CHANGE PASSWORD MODAL */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />

      {/* 8. MANDATORY FIRST LOGIN CHANGE PASSWORD MODAL */}
      <FirstLoginChangePasswordModal
        isOpen={isFirstLoginOpen}
        onSuccess={() => {
          setIsFirstLoginOpen(false);
          fetchTickets();
        }}
      />
    </div>
  );
}
