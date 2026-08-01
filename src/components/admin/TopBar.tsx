"use client";

import { Bell, Menu, Search } from "lucide-react";

interface TopBarProps {
  searchTerm: string;
  onSearch: (value: string) => void;
  onOpenSidebar: () => void;
}

export function TopBar({ searchTerm, onSearch, onOpenSidebar }: TopBarProps) {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={onOpenSidebar} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl">
            <Menu className="w-5 h-5" />
          </button>
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="بحث عن خريج، رقم بطاقة، أو فعاليات..."
              value={searchTerm}
              onChange={(event) => onSearch(event.target.value)}
              className="w-full pr-10 pl-4 py-2 bg-slate-100/80 border border-slate-200/80 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-400/50 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
          </button>
          <div className="h-5 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-600 hidden sm:inline">النظام متصل (Live)</span>
          </div>
        </div>
      </div>
    </header>
  );
}
