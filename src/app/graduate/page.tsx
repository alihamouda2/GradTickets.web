"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, LogOut, QrCode, Ticket, CheckCircle2 } from "lucide-react";
import { AuthService } from "@/services/auth-service";

export default function GraduatePage() {
  const [userName, setUserName] = useState<string>("الخريج");
  const router = useRouter();

  useEffect(() => {
    const session = AuthService.getUserSession();
    if (session?.name) {
      setUserName(session.name);
    }
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800" dir="rtl">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">بوابة الخريجين</h2>
              <p className="text-xs text-slate-500">GradTickets Student Portal</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Welcome Banner */}
        <section className="bg-gradient-to-l from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl space-y-4 text-center sm:text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>حساب خريج مفعّل</span>
          </div>

          {/* Prompt specified title: مرحبا بك ايها الخريج */}
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            مرحبا بك ايها الخريج
          </h1>
          <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
            أهلاً بك يا <span className="font-bold text-white">{userName}</span> في منصة تذاكر حفلات التخرج. يمكنك الاطلاع على تذكرتك الخاصة وحجز المرافقين من هنا.
          </p>
        </section>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">تذكرة التخرج الخاصة بك</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                استعرض بطاقة الدخول الخاصة بك المزودة برمز QR للدخول عبر البوابة.
              </p>
            </div>
            <button className="w-full py-2.5 bg-slate-900 text-white text-xs font-medium rounded-xl hover:bg-slate-800 transition-colors cursor-pointer">
              عرض التذكرة
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">تذاكر المرافقين</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                متابعة وإدارة تذاكر أفراد العائلة والمضيوفين المرافقين لك.
              </p>
            </div>
            <button className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
              إدارة المرافقين
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
