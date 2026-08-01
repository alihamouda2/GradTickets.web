"use client";

import { useState } from "react";
import { Lock, ShieldAlert, Eye, EyeOff, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { AuthService } from "@/services/auth-service";

interface FirstLoginChangePasswordModalProps {
  isOpen: boolean;
  onSuccess: () => void;
}

export function FirstLoginChangePasswordModal({ isOpen, onSuccess }: FirstLoginChangePasswordModalProps) {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [showNew, setShowNew] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword.trim()) {
      setError("يرجى إدخال كلمة المرور الجديدة.");
      return;
    }

    if (!confirmPassword.trim()) {
      setError("يرجى تأكيد كلمة المرور الجديدة.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("كلمة المرور وتأكيدها غير متطابقين.");
      return;
    }

    if (newPassword.length < 6) {
      setError("يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await AuthService.firstLoginChangePassword({
        newPassword: newPassword.trim(),
        confirmPassword: confirmPassword.trim(),
      });

      if (response.success) {
        setSuccessMessage(response.message || "تم تغيير كلمة المرور بنجاح! يتم الآن توجيهك للحساب...");
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setError(response.message || "فشل تغيير كلمة المرور. يرجى المحاولة مرة أخرى.");
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "تعذر الاتصال بالخادم عند تغيير كلمة المرور."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in duration-300 border border-amber-200">
        {/* Header Banner */}
        <div className="text-center space-y-3 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8 text-amber-600 animate-bounce" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg">تغيير كلمة المرور إجباري</h3>
            <p className="text-xs text-amber-800 bg-amber-50 py-1.5 px-3 rounded-xl border border-amber-200/80 mt-2 font-medium">
              هذه المرة الأولى التي تقوم فيها بتسجيل الدخول إلى حسابك.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-500 text-center leading-relaxed">
          لدواعي الأمان وتأمين حسابك، يتوجب عليك تعيين كلمة مرور جديدة بدلاً من كلمة المرور المؤقتة عبر{" "}
          <code className="dir-ltr inline-block text-[11px] font-mono text-slate-700 bg-slate-100 px-1 rounded">
            POST /api/Auth/first-login-change-password
          </code>
        </p>

        {/* Success Alert */}
        {successMessage ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-emerald-900 text-center animate-in fade-in">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-xs">{successMessage}</h4>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                كلمة المرور الجديدة (newPassword):
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور الجديدة..."
                  disabled={loading}
                  className="w-full pr-4 pl-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all dir-ltr text-right"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                تأكيد كلمة المرور الجديدة (confirmPassword):
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="أعد إدخال كلمة المرور الجديدة..."
                  disabled={loading}
                  className="w-full pr-4 pl-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all dir-ltr text-right"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري التغيير وتفعيل الحساب...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>تأكيد كلمة المرور والدخول</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
