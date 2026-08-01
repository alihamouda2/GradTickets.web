"use client";

import { useState } from "react";
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AlertBanner } from "@/components/ui/AlertBanner";

export function LoginForm() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    serverMessage,
    messageType,
    handleLogin,
  } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 p-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 mb-2">
          <ShieldCheck className="w-6 h-6 text-slate-600" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          GradTickets
        </h1>
        <p className="text-sm text-slate-500">
          تسجيل الدخول للنظام وإدارة التذاكر والفعاليات
        </p>
      </div>

      {/* Persistent display of Server Response Message */}
      <AlertBanner message={serverMessage} type={messageType} />

      <form onSubmit={handleLogin} className="space-y-4" dir="rtl">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 block">
            البريد الإلكتروني
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full pl-4 pr-10 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-slate-400 transition-all"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-slate-600 block">
              كلمة المرور
            </label>
            <a
              href="#"
              className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              نسيت كلمة المرور؟
            </a>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:border-slate-400 transition-all"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl shadow-sm text-sm transition-all duration-200 disabled:opacity-70 flex justify-center items-center cursor-pointer"
        >
          {loading ? (
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            "تسجيل الدخول"
          )}
        </button>
      </form>

      <div className="text-center pt-2">
        <p className="text-xs text-slate-400">
          © 2026 GradTickets. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  );
}
