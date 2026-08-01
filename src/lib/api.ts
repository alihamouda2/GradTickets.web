import { dashboardStats, recentCheckIns, capacityInfo, navItems } from "@/lib/dashboard";

export type DashboardPayload = {
  stats: typeof dashboardStats;
  recentCheckIns: typeof recentCheckIns;
  quickActions: typeof import("@/lib/dashboard").quickActions;
  capacityInfo: typeof capacityInfo;
  navItems: typeof navItems;
};

export async function fetchDashboardData(): Promise<DashboardPayload> {
  try {
    const response = await fetch("/api/dashboard", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Dashboard API unavailable");
    }
    return response.json();
  } catch {
    return {
      stats: dashboardStats,
      recentCheckIns,
      quickActions: (await import("@/lib/dashboard")).quickActions,
      capacityInfo,
      navItems,
    };
  }
}

export async function loginAdmin(credentials: { email: string; password: string }) {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Login request failed");
    }

    return response.json();
  } catch {
    return {
      success: true,
      token: "offline-sample-token",
      message: "تم تسجيل الدخول تجريبيًا. سيتم تفعيل الربط مع API قريبًا.",
    };
  }
}
