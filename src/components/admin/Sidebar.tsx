"use client";

import type { NavItem } from "@/lib/dashboard";
import { LogOut, ShieldCheck, X, KeyRound } from "lucide-react";

interface SidebarProps {
  items: NavItem[];
  activeTab: string;
  onSelect: (id: string) => void;
  open: boolean;
  onToggle: () => void;
  onLogout?: () => void;
  onChangePassword?: () => void;
  profile: {
    name: string;
    email: string;
    initials: string;
  };
}

export function Sidebar({ items, activeTab, onSelect, open, onToggle, onLogout, onChangePassword, profile }: SidebarProps) {


  return (
    <aside
      className={`fixed lg:static inset-y-0 right-0 z-40 bg-slate-950 text-slate-300 w-72 transform ${
        open ? "translate-x-0" : "translate-x-full lg:translate-x-0"
      } transition-transform duration-300 ease-in-out flex flex-col justify-between shadow-2xl lg:shadow-none shrink-0`}
    >
      <div className="p-5 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-800/80 flex items-center justify-center text-white shadow-inner">
              <ShieldCheck className="w-5 h-5 text-slate-200" />
            </div>
            <div>
              <h1 className="font-bold text-white text-base leading-tight tracking-wide">GradTickets</h1>
              <span className="text-[11px] text-slate-400">نظام إدارة تذاكر التخرج</span>
            </div>
          </div>

          <button onClick={onToggle} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="h-px bg-slate-800" />

        <nav className="space-y-1.5">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
            القائمة الرئيسية
          </p>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all text-right ${{
                  true: "bg-slate-800 text-white shadow-sm border-r-4 border-slate-400",
                }[String(isActive)] ?? "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                    isActive ? "bg-slate-700 text-slate-200" : "bg-slate-800 text-slate-400"
                  }`}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 space-y-3">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-bold text-white">
              {profile.initials}
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-200">{profile.name}</p>
              <p className="text-[10px] text-slate-500">{profile.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {onChangePassword && (
              <button
                onClick={onChangePassword}
                className="text-slate-400 hover:text-amber-400 transition-colors p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
                title="تغيير كلمة السر"
              >
                <KeyRound className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onLogout}
              className="text-slate-400 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
