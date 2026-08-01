import type { QuickAction } from "@/lib/dashboard";
import { Card } from "@/components/ui/Card";
import { ArrowUpRight } from "lucide-react";

interface QuickPanelProps {
  capacity: {
    title: string;
    usagePercent: number;
    occupied: number;
    remaining: number;
    venue: string;
  };
  actions: QuickAction[];
}

export function QuickPanel({ capacity, actions }: QuickPanelProps) {
  return (
    <div className="space-y-6">
      <Card className="p-5">
        <h3 className="font-bold text-slate-800 text-sm">{capacity.title}</h3>
        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>نسبة الدخول</span>
            <span className="font-semibold text-slate-900">{capacity.usagePercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-slate-900 rounded-full transition-all duration-500" style={{ width: `${capacity.usagePercent}%` }} />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 pt-1">
            <span>{capacity.occupied} دخلوا القاعة</span>
            <span>المتبقي: {capacity.remaining} مقعد</span>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-bold text-slate-800 text-sm">عمليات سريعة</h3>
        <div className="space-y-2 mt-4">
          {actions.map((action) => (
            <a
              key={action.id}
              href={action.href}
              className="w-full text-right block p-3 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <span>{action.title}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">{action.description}</p>
            </a>
          ))}
        </div>
      </Card>
    </div>
  );
}
