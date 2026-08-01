import type { CheckInRecord } from "@/lib/dashboard";
import { Card } from "@/components/ui/Card";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface RecentCheckinsTableProps {
  records: CheckInRecord[];
}

export function RecentCheckinsTable({ records }: RecentCheckinsTableProps) {
  return (
    <Card className="lg:col-span-2 overflow-hidden flex flex-col">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">سجل عمليات الدخول المباشر</h3>
          <p className="text-xs text-slate-400 mt-0.5">التحقق من التذاكر عبر تطبيق فلاتر عند البوابات</p>
        </div>
        <button className="text-xs text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1 transition-colors">
          عرض السجل الكامل
          <span className="inline-block rotate-180">←</span>
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
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4 font-medium text-slate-900">{record.name}</td>
                <td className="py-3.5 px-4 text-slate-500 font-mono">{record.ticketCode}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-1 rounded-xl text-[10px] font-medium ${
                    record.type === "خريج" ? "bg-slate-100 text-slate-700" : "bg-blue-50 text-blue-700"
                  }`}>
                    {record.type}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-400">{record.time}</td>
                <td className="py-3.5 px-4">
                  {record.status === "Success" ? (
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
      <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-400">
        تطبيق البوابة متزامن تلقائياً عبر الأوفلاين والباك إند
      </div>
    </Card>
  );
}
