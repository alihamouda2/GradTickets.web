import type { ReactNode } from "react";

interface SectionHeadingProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionHeading({ title, description, action }: SectionHeadingProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {description ? <p className="text-xs text-slate-500">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
