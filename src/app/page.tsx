import Link from "next/link";
import { ShieldCheck, GraduationCap, QrCode, Calendar } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900" dir="rtl">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-12 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <section className="space-y-8 rounded-[32px] border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/40">
            <div className="inline-flex items-center gap-3 rounded-3xl bg-slate-950 px-4 py-3 text-white w-fit">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm font-semibold">GradTickets</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">نظام متكامل لإدارة تذاكر حفلات التخرج</h1>
              <p className="max-w-xl text-sm leading-7 text-slate-600">
                إدارة الخريجين، توليد التذاكر، تتبع الحضور، والاطلاع على التقارير الإحصائية من واجهة واحدة مرتبة ونظيفة.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { label: "إدارة الخريجين", icon: GraduationCap },
                { label: "توليد التذاكر", icon: QrCode },
                { label: "متابعة الحضور", icon: Calendar },
                { label: "تقارير مميزة", icon: ShieldCheck },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-3xl bg-slate-900 text-white">
                      <Icon className="w-5 h-5" />
                    </span>
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/login" className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                تسجيل الدخول
              </Link>
              <Link href="/admin/dashboard" className="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                عرض لوحة الإدارة
              </Link>
            </div>
          </section>

          <aside className="rounded-[32px] border border-slate-200 bg-slate-950/95 p-8 text-white shadow-xl shadow-slate-950/10">
            <div className="space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">نظام جاهز للربط</p>
                <h2 className="mt-3 text-2xl font-semibold">واجهة حديثة ومقسمة بشكل منطقي</h2>
              </div>
              <div className="space-y-4 text-sm text-slate-300">
                <p>هيكلة واضحة لكل قسم داخل التطبيق لجعل الربط مع API القادم سريعاً وسهل الصيانة.</p>
                <p>بطاقات وإحصائيات وجدول بيانات نظيف ومجهّز لاستقبال معلومات حقيقية من الخادم.</p>
              </div>
              <div className="grid gap-3">
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">جاهز للعمل</p>
                  <p className="mt-3 text-lg font-semibold">واجهة عربية بالكامل</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">تنسيق موحد</p>
                  <p className="mt-3 text-lg font-semibold">ألوان أنيقة وعناصر قابلة لإعادة الاستخدام</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
