import type { LucideIcon } from "lucide-react";
import {
  Calendar,
  FileText,
  GraduationCap,
  LayoutDashboard,
  QrCode,
  Settings,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

export type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
};

export type StatCard = {
  title: string;
  value: string;
  subtext: string;
  icon: LucideIcon;
};

export type CheckInRecord = {
  id: string;
  name: string;
  ticketCode: string;
  time: string;
  status: "Success" | "Duplicate";
  type: "خريج" | "مرافق";
};

export type QuickAction = {
  id: string;
  title: string;
  description: string;
  href: string;
};

export const navItems: NavItem[] = [
  { id: "dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { id: "graduates", label: "إدارة الخريجين", icon: GraduationCap, badge: "1,240" },
  { id: "tickets", label: "البطاقات والتذاكر", icon: QrCode },
  { id: "events", label: "الفعاليات والحفلات", icon: Calendar, badge: "2" },
  { id: "reports", label: "التقارير والإحصائيات", icon: FileText },
  { id: "settings", label: "إعدادات النظام", icon: Settings },
];

export const dashboardStats: StatCard[] = [
  { title: "إجمالي الخريجين", value: "1,240", subtext: "+12 هذا الأسبوع", icon: GraduationCap },
  { title: "البطاقات الصادرة", value: "3,100", subtext: "تشمل مرافقين وتذاكر", icon: QrCode },
  { title: "الضيوف الحاضرون", value: "850", subtext: "68% من الإجمالي", icon: UserCheck },
  { title: "الفعاليات النشطة", value: "2", subtext: "حفل كلية الحاسوب + الهندسة", icon: Calendar },
];

export const recentCheckIns: CheckInRecord[] = [
  { id: "1", name: "علي فهد الحمدي", ticketCode: "GT-9821", time: "10:42 ص", status: "Success", type: "خريج" },
  { id: "2", name: "عمر خالد العطاس", ticketCode: "GT-9822", time: "10:40 ص", status: "Success", type: "مرافق" },
  { id: "3", name: "محمد سعيد باوزير", ticketCode: "GT-7711", time: "10:35 ص", status: "Duplicate", type: "خريج" },
  { id: "4", name: "سالم أحمد بن مهري", ticketCode: "GT-9850", time: "10:28 ص", status: "Success", type: "مرافق" },
];

export const quickActions = [
  {
    id: "invite",
    title: "إصدار بطاقة دعوة منفردة",
    description: "إنشاء تذكرة سريعة وحفظ بيانات الضيف.",
    href: "/admin/tickets/new",
  },
  {
    id: "export",
    title: "تصدير تقرير الحضور",
    description: "تنزيل ملف Excel لتسليم الجهة المنظمة.",
    href: "/admin/reports/attendance",
  },
];

export const capacityInfo = {
  title: "استيعاب القاعة الحالية",
  usagePercent: 68,
  occupied: 850,
  remaining: 400,
  venue: "القاعة الرئيسية",
};

export const adminProfile = {
  name: "أحمد المسؤول",
  email: "admin@gradtickets.web",
  initials: "أ",
  status: "النظام متصل",
};
