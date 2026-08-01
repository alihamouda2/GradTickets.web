"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth-service";
import { UserRole } from "@/types/auth";

export function useAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setServerMessage(null);

    try {
      const result = await AuthService.login({ email, password });

      // Always commit to displaying the server response message
      setServerMessage(result.message || (result.success ? "تم تسجيل الدخول بنجاح." : "فشل تسجيل الدخول."));
      setMessageType(result.success ? "success" : "error");

      if (result.success && result.data) {
        const roleNum = Number(result.data.role);

        // Redirect based on User Role after short delay to allow viewing the response message
        setTimeout(() => {
          if (roleNum === UserRole.Admin) {
            router.push("/admin/dashboard");
          } else if (roleNum === UserRole.Graduate) {
            router.push("/graduate");
          } else {
            // Fallback for default or other roles
            router.push("/");
          }
        }, 1000);
      }
    } catch {
      setServerMessage("حدث خطأ غير متوقع عند الاتصال بالخادم.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    serverMessage,
    messageType,
    handleLogin,
  };
}
