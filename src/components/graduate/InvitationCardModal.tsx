"use client";

import { useRef, useState } from "react";
import {
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  X,
  Sparkles,
  Cpu,
  ShieldCheck,
  Loader2,
  FileImage
} from "lucide-react";
import { GeneratedTicketItem } from "@/types/graduate";

interface InvitationCardModalProps {
  isOpen: boolean;
  ticket: GeneratedTicketItem | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
}

export function InvitationCardModal({
  isOpen,
  ticket,
  loading,
  error,
  onClose,
}: InvitationCardModalProps) {
  const exportRef = useRef<HTMLDivElement>(null);
  const [downloadingImg, setDownloadingImg] = useState<boolean>(false);

  if (!isOpen) return null;

  const qrCodeUrl = ticket
    ? `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(
      ticket.ticketCode
    )}`
    : "";

  // Download Card ONLY as a PNG Image using html-to-image
  const handleDownloadImage = async () => {
    if (!exportRef.current || !ticket) return;
    setDownloadingImg(true);

    try {
      const { toPng } = await import("html-to-image");

      const dataUrl = await toPng(exportRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        width: 1080,
        height: 1920,
        backgroundColor: "#060b18",
      });

      const link = document.createElement("a");
      link.download = `MindTech2026_Invitation_${ticket.ticketCode}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err: unknown) {
      console.error("Error generating image with html-to-image:", err);
    } finally {
      setDownloadingImg(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-lg flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      dir="rtl"
    >
      <div className="bg-[#0b1220] rounded-3xl max-w-lg w-full p-4 sm:p-6 space-y-4 shadow-2xl border border-slate-800 animate-in fade-in zoom-in duration-200 text-white my-auto max-h-[95vh] flex flex-col justify-between">
        {/* Modal Controls Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">بطاقة دعوة حفل التخرج 2026</h3>
              <p className="text-[11px] text-amber-400 font-medium">Mind Tech - تخصص تقنية معلومات</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-400 font-semibold">
              جاري تجهيز بطاقة الدعوة...
            </p>
          </div>
        ) : error ? (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs space-y-2">
            <p className="font-semibold">{error}</p>
          </div>
        ) : ticket ? (
          <div className="overflow-y-auto space-y-4 pr-1 pl-1 flex-1">
            {/* ------------------------------------------------------------- */}
            {/* 1. VISIBLE ON-SCREEN CARD MATCHING EXACT DESIGN                */}
            {/* ------------------------------------------------------------- */}
            <div className="relative bg-[#060b18] text-white rounded-3xl p-6 sm:p-7 space-y-6 border border-slate-800 shadow-2xl overflow-hidden select-none">
              {/* Radial Glowing Lights */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Exact Golden L-Corner Accents */}
              <div className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-[#eab308] pointer-events-none" />
              <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-[#eab308] pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 border-[#eab308] pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-7 h-7 border-b-2 border-l-2 border-[#eab308] pointer-events-none" />

              {/* Header Section */}
              <div className="relative z-10 text-center space-y-3.5 pt-2">
                <p className="text-xs font-semibold text-slate-300 tracking-wide">
                  بسم الله الرحمن الرحيم
                </p>

                {/* Pill Department Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a1529] border border-[#06b6d4] text-[#06b6d4] text-[11px] font-extrabold tracking-wider shadow-md">
                  <span>INFORMATION TECHNOLOGY DEPARTMENT</span>
                  <Cpu className="w-3.5 h-3.5 text-[#06b6d4]" />
                </div>

                {/* Graduation Icon Frame */}
                <div className="w-16 h-16 mx-auto rounded-2xl border-2 border-[#f59e0b] bg-[#0c1427] flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-8 h-8 text-[#f59e0b]" />
                </div>

                {/* Main Titles */}
                <div className="space-y-1">
                  <p className="text-sm font-bold text-[#f59e0b]">
                    دعوة رسمية لحضور حفل تخرج
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#f59e0b] tracking-wide">
                    دفعة <span className="font-extrabold dir-ltr inline-block">Mind Tech 2026</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-medium pt-0.5">
                    تخصص تقنية معلومات - IT
                  </p>
                </div>
              </div>

              {/* Event Info Details Box */}
              <div className="relative z-10 bg-[#0e172a]/90 border border-[#1e2d4a] rounded-2xl p-4 shadow-xl backdrop-blur-md">
                <div className="grid grid-cols-3 gap-2 text-center divide-x divide-x-reverse divide-[#1e2d4a]">
                  {/* Date */}
                  <div className="space-y-1.5 p-1">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] text-slate-400 block font-semibold">تاريخ الحفل</span>
                    <span className="text-xs font-black text-[#f59e0b] block dir-ltr">
                      2026 / 09 / 06
                    </span>
                  </div>

                  {/* Time */}
                  <div className="space-y-1.5 p-1">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/20">
                      <Clock className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] text-slate-400 block font-semibold">الوقت المحدد</span>
                    <span className="text-xs font-black text-cyan-300 block">
                      8:00 صباحاً
                    </span>
                  </div>

                  {/* Venue */}
                  <div className="space-y-1.5 p-1">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] text-slate-400 block font-semibold">مكان الحفل</span>
                    <span className="text-xs font-black text-emerald-300 block truncate">
                      قاعة ميرال بالمكلا
                    </span>
                  </div>
                </div>
              </div>

              {/* Gate QR Code Section */}
              <div className="relative z-10 bg-[#0b1329]/95 border border-[#1e2d4a] rounded-2xl p-6 text-center space-y-4 shadow-xl">
                {/* Gate Badge */}
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#111c38] text-amber-300 text-[11px] font-bold border border-slate-700/80">
                  <span>رمز المسح المعتمد عند البوابة الإلكترونية</span>
                  <QrCode className="w-3.5 h-3.5 text-amber-400" />
                </div>

                {/* QR Image Box */}
                <div className="w-52 h-52 mx-auto p-4 bg-white rounded-3xl shadow-2xl border-4 border-white flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrCodeUrl}
                    alt={`QR ${ticket.ticketCode}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Card Footer Divider & Text */}
              <div className="relative z-10 text-center border-t border-slate-800/80 pt-4 space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-200 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>بطاقة دعوة إلكترونية معتمدة لحضور حفل التخرج</span>
                </div>
                <p className="font-mono text-[10px] text-slate-500 dir-ltr">
                  GradTickets System • Mind Tech 2026 • Serial #{ticket.id}
                </p>
              </div>
            </div>

            {/* Toolbar Buttons (ONLY Download PNG Image & Close) */}
            <div className="flex items-center gap-2 pt-2 shrink-0">
              <button
                onClick={handleDownloadImage}
                disabled={downloadingImg}
                className="flex-1 py-3.5 px-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-600 disabled:opacity-50 text-slate-950 font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-300/50"
              >
                {downloadingImg ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>جاري معالجة وتنزيل الصورة...</span>
                  </>
                ) : (
                  <>
                    <FileImage className="w-4 h-4 text-slate-950" />
                    <span>تنزيل بطاقة الدعوة (صورة PNG)</span>
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="py-3.5 px-6 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
              >
                إغلاق
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. OFF-SCREEN HIDDEN 1080 x 1920 TARGET MATCHING EXACT DESIGN   */}
      {/* ------------------------------------------------------------- */}
      {ticket && (
        <div
          style={{
            position: "fixed",
            top: "-9999px",
            left: "-9999px",
            width: "1080px",
            height: "1920px",
            overflow: "hidden",
            zIndex: -9999,
          }}
        >
          <div
            ref={exportRef}
            style={{ width: "1080px", height: "1920px" }}
            className="relative bg-[#060b18] text-white flex flex-col justify-between p-16 select-none box-border"
          >
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Exact Golden L-Corner Accents */}
            <div className="absolute top-10 right-10 w-16 h-16 border-t-4 border-r-4 border-[#eab308] pointer-events-none" />
            <div className="absolute top-10 left-10 w-16 h-16 border-t-4 border-l-4 border-[#eab308] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-16 h-16 border-b-4 border-r-4 border-[#eab308] pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-16 h-16 border-b-4 border-l-4 border-[#eab308] pointer-events-none" />

            {/* TOP SECTION */}
            <div className="relative z-10 space-y-8 text-center pt-8">
              <p className="text-2xl font-semibold text-slate-300 tracking-wider">
                بسم الله الرحمن الرحيم
              </p>

              {/* Department Badge */}
              <div className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-[#0a1529] border border-[#06b6d4] text-[#06b6d4] text-xl font-extrabold tracking-widest shadow-xl">
                <span>INFORMATION TECHNOLOGY DEPARTMENT</span>
                <Cpu className="w-6 h-6 text-[#06b6d4]" />
              </div>

              {/* Cap Emblem Box */}
              <div className="w-24 h-24 mx-auto rounded-3xl border-4 border-[#f59e0b] bg-[#0c1427] flex items-center justify-center shadow-2xl">
                <GraduationCap className="w-12 h-12 text-[#f59e0b]" />
              </div>

              {/* Main Title & Batch */}
              <div className="space-y-3">
                <p className="text-3xl font-bold text-[#f59e0b]">
                  دعوة رسمية لحضور حفل تخرج
                </p>
                <h1 className="text-6xl font-black text-[#f59e0b] tracking-wide">
                  دفعة <span className="dir-ltr inline-block">Mind Tech 2026</span>
                </h1>
                <p className="text-2xl text-slate-400 font-medium">
                  تخصص تقنية معلومات - IT
                </p>
              </div>
            </div>

            {/* MIDDLE SECTION: EVENT DETAILS & GATE QR */}
            <div className="relative z-10 space-y-12 my-auto px-6">
              {/* Event Details Grid */}
              <div className="bg-[#0e172a]/95 border border-[#1e2d4a] rounded-3xl p-8 shadow-2xl backdrop-blur-md">
                <div className="grid grid-cols-3 gap-4 text-center divide-x divide-x-reverse divide-[#1e2d4a]">
                  {/* Date */}
                  <div className="space-y-2 p-2">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
                      <Calendar className="w-7 h-7" />
                    </div>
                    <span className="text-base font-semibold text-slate-400 block">تاريخ الحفل</span>
                    <span className="text-2xl font-black text-[#f59e0b] block dir-ltr">
                      2026 / 09 / 06
                    </span>
                  </div>

                  {/* Time */}
                  <div className="space-y-2 p-2">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/20">
                      <Clock className="w-7 h-7" />
                    </div>
                    <span className="text-base font-semibold text-slate-400 block">الوقت المحدد</span>
                    <span className="text-2xl font-black text-cyan-300 block">
                      8:00 صباحاً
                    </span>
                  </div>

                  {/* Venue */}
                  <div className="space-y-2 p-2">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                      <MapPin className="w-7 h-7" />
                    </div>
                    <span className="text-base font-semibold text-slate-400 block">مكان الحفل</span>
                    <span className="text-2xl font-black text-emerald-300 block">
                      قاعة ميرال بالمكلا
                    </span>
                  </div>
                </div>
              </div>

              {/* QR Code Gate Box */}
              <div className="bg-[#0b1329]/95 border border-[#1e2d4a] rounded-3xl p-10 text-center space-y-6 shadow-2xl">
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[#111c38] text-amber-300 text-base font-bold border border-slate-700">
                  <span>رمز المسح المعتمد عند البوابة الإلكترونية</span>
                  <QrCode className="w-5 h-5 text-amber-400" />
                </div>

                <div className="w-80 h-80 mx-auto p-5 bg-white rounded-3xl shadow-2xl border-4 border-white flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrCodeUrl}
                    alt={`QR ${ticket.ticketCode}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* BOTTOM SECTION */}
            <div className="relative z-10 space-y-3 text-center border-t border-slate-800/80 pt-8 pb-4">
              <div className="flex items-center justify-center gap-2 text-slate-200 text-xl font-bold">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <span>بطاقة دعوة إلكترونية معتمدة لحضور حفل التخرج</span>
              </div>
              <p className="text-slate-500 text-base dir-ltr font-mono">
                GradTickets System • Mind Tech 2026 • Serial #{ticket.id}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
