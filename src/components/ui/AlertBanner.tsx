"use client";

import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

interface AlertBannerProps {
  message: string | null;
  type?: "success" | "error" | "info";
  onClose?: () => void;
}

export function AlertBanner({ message, type = "info", onClose }: AlertBannerProps) {
  if (!message) return null;

  const isSuccess = type === "success";
  const isError = type === "error";

  const bgStyles = isSuccess
    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
    : isError
    ? "bg-rose-50 border-rose-200 text-rose-800"
    : "bg-blue-50 border-blue-200 text-blue-800";

  const IconComponent = isSuccess
    ? CheckCircle2
    : isError
    ? AlertTriangle
    : Info;

  return (
    <div
      className={`w-full p-4 rounded-xl border flex items-start justify-between gap-3 text-sm font-medium transition-all shadow-sm ${bgStyles}`}
      dir="rtl"
    >
      <div className="flex items-center gap-2.5">
        <IconComponent className="w-5 h-5 shrink-0" />
        <span>{message}</span>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="text-slate-400 hover:text-slate-700 transition-colors"
          title="إغلاق التنبيه"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
