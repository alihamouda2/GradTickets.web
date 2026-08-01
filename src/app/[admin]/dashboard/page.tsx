"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  QrCode, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ArrowUpRight, 
  Search, 
  LogOut, 
  TrendingUp,
  ShieldCheck,
  UserCheck,
  LayoutDashboard,
  GraduationCap,
  Settings,
  FileText,
  Bell,
  Menu,
  X,
  KeyRound,
  ChevronLeft
} from "lucide-react";

import { GraduatesManagement } from "@/components/admin/GraduatesManagement";
import { ChangePasswordModal } from "@/components/auth/ChangePasswordModal";
import { AuthService } from "@/services/auth-service";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("graduates");
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const handleLogout = () => {
    AuthService.logout();
    router.push("/login");
  };


  // عناصر القائمة الجانبية (Sidebar Navigation Items)
  const navItems = [
    { id: "dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
    { id: "graduates", label: "إدارة الخريجين", icon: GraduationCap, badge: "1,240" },
    { id: "tickets", label: "البطاقات والتذاكر", icon: QrCode },
    { id: "events", label: "الفعاليات والحفلات", icon: Calendar, badge: "2" },
    { id: "reports", label: "التقارير والإحصائيات", icon: FileText },
    { id: "settings", label: "إعدادات النظام", icon: Settings },
  ];

  const stats = [
    { title: "إجمالي الخريجين", value: "1,240", subtext: "+12 هذا الأسبوع", icon: GraduationCap },
    { title: "البطاقات الصادرة", value: "3,100", subtext: "تشمل مرافقين وتذاكر", icon: QrCode },
    { title: "الضيوف الحاضرون", value: "850", subtext: "68% من الإجمالي", icon: UserCheck },
    { title: "الفعاليات النشطة", value: "2", subtext: "حفل كلية الحاسوب + الهندسة", icon: Calendar },
  ];

  const recentCheckIns = [
    { id: "1", name: "علي فهد الحمدي", ticketCode: "GT-9821", time: "10:42 AM", status: "Success", type: "خريج" },
    { id: "2", name: "عمر خالد العطاس", ticketCode: "GT-9822", time: "10:40 AM", status: "Success", type: "مرافق" },
    { id: "3", name: "محمد سعيد باوزير", ticketCode: "GT-7711", time: "10:35 AM", status: "Duplicate", type: "خريج" },
    { id: "4", name: "سالم أحمد بن مهري", ticketCode: "GT-9850", time: "10:28 AM", status: "Success", type: "مرافق" },
  ];

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-800 flex" dir="rtl">
      
      {/* 1. القائمة الجانبية (Sidebar) */}
      <aside 
        className={`fixed lg:static inset-y-0 right-0 z-40 bg-slate-900 text-slate-300 w-64 transform ${
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        } transition-transform duration-300 ease-in-out flex flex-col justify-between shadow-2xl lg:shadow-none shrink-0`}
      >
        <div className="p-5 space-y-6">
          
          {/* شعار النظام واسم التطبيق */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-white shadow-inner">
                <ShieldCheck className="w-6 h-6 text-slate-200" />
              </div>
              <div>
                <h1 className="font-bold text-white text-base leading-tight tracking-wide">GradTickets</h1>
                <span className="text-[10px] text-slate-400">نظام إدارة تذاكر التخرج</span>
              </div>
            </div>
            {/* زر إغلاق القائمة في الشاشات الصغيرة */}
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="h-px bg-slate-800"></div>

          {/* روابط التصفح الأساسية */}
          <nav className="space-y-1.5">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
              القائمة الرئيسية
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive 
                      ? "bg-slate-800 text-white shadow-sm border-r-4 border-slate-400" 
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                      isActive ? "bg-slate-700 text-slate-200" : "bg-slate-800 text-slate-400"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* الجزء السفلي من الشريط الجاني: حساب المستخدم وتسجيل الخروج */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white">
                أ
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-200">أحمد المسؤول</p>
                <p className="text-[10px] text-slate-500">admin@gradtickets.web</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsChangePasswordOpen(true)}
                className="text-slate-400 hover:text-amber-400 transition-colors p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
                title="تغيير كلمة السر"
              >
                <KeyRound className="w-4 h-4" />
              </button>
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
                title="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. منطقة المحتوى الرئيسية (Main Content Area) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* الشريط العلوي الأفقي (Top Header Bar) */}
        <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="relative w-64 md:w-80">
                <input
                  type="text"
                  placeholder="بحث عن خريج، رقم بطاقة، أو فعاليات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-9 pl-4 py-2 bg-slate-100/80 border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-400/50 transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* زر التنبيهات */}
              <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
              </button>
              
              <div className="h-5 w-px bg-slate-200"></div>

              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-medium text-slate-600 hidden sm:inline">النظام متصل (Live)</span>
              </div>
            </div>

          </div>
        </header>

        {/* محتوى اللوحة الرئيسي */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {activeTab === "graduates" ? (
            <GraduatesManagement />
          ) : (
            <>
          {/* الترويسة والأزرار */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900">لوحة التحكم الإحصائية</h2>
              <p className="text-xs text-slate-500 mt-0.5">متابعة عملية التذاكر والدخول لحفلات التخرج مباشرة</p>
            </div>
            
            <div className="flex items-center gap-2.5">
              <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-medium shadow-sm transition-all cursor-pointer">
                <Plus className="w-4 h-4" />
                إضافة خريج جديد
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-medium shadow-sm transition-all cursor-pointer">
                <QrCode className="w-4 h-4 text-slate-500" />
                توليد التذاكر
              </button>
            </div>
          </div>

          {/* الإحصائيات (Stat Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 hover:border-slate-300 transition-all">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-slate-500">{stat.title}</span>
                    <div className="p-2.5 bg-slate-100 rounded-xl text-slate-700">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-emerald-600" />
                      <span>{stat.subtext}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* الجدول والإحداثيات الجانبية */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* جدول حركيات المسح عند البوابات */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">سجل عمليات الدخول المباشر</h3>
                    <p className="text-xs text-slate-400 mt-0.5">التحقق من التذاكر عبر تطبيق فلاتر عند البوابات</p>
                  </div>
                  <button className="text-xs text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1 cursor-pointer">
                    عرض السجل الكامل
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50/80 text-slate-500 font-medium border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-4">اسم الضيف / الخريج</th>
                        <th className="py-3 px-4">رمز التذكرة</th>
                        <th className="py-3 px-4">الفئة</th>
                        <th className="py-3 px-4">وقت المسح</th>
                        <th className="py-3 px-4">الحالة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {recentCheckIns.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4 font-medium text-slate-900">{item.name}</td>
                          <td className="py-3.5 px-4 text-slate-500 font-mono">{item.ticketCode}</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-medium ${
                              item.type === "خريج" ? "bg-slate-100 text-slate-700" : "bg-blue-50 text-blue-700"
                            }`}>
                              {item.type}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400">{item.time}</td>
                          <td className="py-3.5 px-4">
                            {item.status === "Success" ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                مقبول
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                                <AlertCircle className="w-3.5 h-3.5" />
                                مكرر!
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                <span className="text-[11px] text-slate-400">تطبيق البوابة متزامن تلقائياً عبر الأوفلاين والباك إند</span>
              </div>
            </div>

            {/* بطاقات جانبية سريعة */}
            <div className="space-y-6">
              
              {/* بطاقة نسبة السعة */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-800 text-sm">استيعاب القاعة الحالية</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">نسبة الدخول</span>
                    <span className="font-bold text-slate-800">68%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-800 rounded-full w-[68%] transition-all duration-500"></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                    <span>850 دخلوا القاعة</span>
                    <span>المتبقي: 400 مقعد</span>
                  </div>
                </div>
              </div>

              {/* بطاقة الوصول السريع */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                <h3 className="font-bold text-slate-800 text-sm">عمليات سريعة</h3>
                <div className="space-y-2">
                  <button className="w-full text-right p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 flex justify-between items-center transition-all cursor-pointer">
                    <span>إصدار بطاقة دعوة منفردة</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button className="w-full text-right p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 flex justify-between items-center transition-all cursor-pointer">
                    <span>تصدير تقرير الحضور (Excel)</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>

            </div>

          </div>

          </>
          )}
        </main>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
}