import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white border border-slate-200/80 shadow-sm rounded-3xl ${className}`}>
      {children}
    </div>
  );
}
