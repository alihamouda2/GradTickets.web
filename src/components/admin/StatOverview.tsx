import type { StatCard } from "@/lib/dashboard";
import { Card } from "@/components/ui/Card";
import { TrendingUp } from "lucide-react";

interface StatOverviewProps {
  stats: StatCard[];
}

export function StatOverview({ stats }: StatOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="p-5 hover:border-slate-300 transition-all">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-slate-500">{stat.title}</span>
              <div className="p-2.5 bg-slate-100 rounded-2xl text-slate-700">
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                <TrendingUp className="w-3 h-3 text-emerald-600" />
                <span>{stat.subtext}</span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
