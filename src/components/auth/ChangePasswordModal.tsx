"use client";

import { useState } from "react";
import { Lock, KeyRound, Eye, EyeOff, X, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { AuthService } from "@/services/auth-service";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

  const [showCurrent, setShowCurrent] = useState<boolean>(false);
  const [showNew, setShowNew] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleReset = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setError(null);
    setSuccessMessage(null);
  };

  const handleClose = () => {
    if (loading) return;
    handleReset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      setError("يرجى إدخال كلمة المرور الحالية.");
      return;
    }

    if (!newPassword) {
      setError("يرجى إدخال كلمة المرور الجديدة.");
      return;
    }

    if (!confirmNewPassword) {
      setError("يرجى تأكيد كلمة المرور الجديدة.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("كلمة المرور الجديدة وتأكيدها غير متطابقين.");
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
      const response = await AuthService.changePassword({
        currentPassword,
        newPassword,
        confirmNewPassword,
      });

      if (response.success) {
        setSuccessMessage(response.message || "تم تغيير كلمة المرور بنجاح!");
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(response.message || "فشل في تغيير كلمة المرور. تأكد من كلمة المرور الحالية.");
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
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">تغيير كلمة السر</h3>
              <p className="text-xs text-slate-400">
                عبر <code className="dir-ltr inline-block">POST /api/Auth/change-password</code>
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {successMessage ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-emerald-900 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <h4 className="font-bold text-xs">{successMessage}</h4>
            </div>
            <p className="text-[11px] text-emerald-700">سيتم إغلاق النافذة تلقائياً...</p>
          </div>
        ) : (
          /* Form Body */
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                كلمة المرور الحالية (currentPassword):
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور الحالية..."
                  disabled={loading}
                  className="w-full pr-4 pl-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all dir-ltr text-right"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

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

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                تأكيد كلمة المرور الجديدة (confirmNewPassword):
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="أعد كتابة كلمة المرور الجديدة..."
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

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري التغيير...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>تغيير كلمة السر</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
