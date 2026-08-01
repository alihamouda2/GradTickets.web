"use client";

import { useEffect, useState, useMemo } from "react";
import {
  GraduationCap,
  Ticket,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  AlertTriangle,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Filter,
  X,
  Plus,
  UserPlus,
  Loader2,
  QrCode,
  CheckSquare,
  Square,
  Sparkles,
  Trash2,
  Pencil
} from "lucide-react";
import { AdminService } from "@/services/admin-service";
import { GraduateItem, GenerateTicketsResponseData, UpdateGraduateRequest } from "@/types/graduate";

export function GraduatesManagement() {
  const [graduates, setGraduates] = useState<GraduateItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "first_login">("all");

  // State for selected graduates (Checkboxes)
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // State for single graduate details modal (Row Click)
  const [selectedGraduate, setSelectedGraduate] = useState<GraduateItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // State for inline graduate creation
  const [newGraduateName, setNewGraduateName] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createMessage, setCreateMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // State for Generate Tickets Modal & Process
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState<boolean>(false);
  const [quantityPerGraduate, setQuantityPerGraduate] = useState<number>(50);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generateResult, setGenerateResult] = useState<GenerateTicketsResponseData | null>(null);

  // State for Delete Confirmation Modal & Process
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "single" | "batch";
    id?: number;
    name?: string;
    ids?: number[];
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // State for Edit Graduate Modal & Form
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingGraduateId, setEditingGraduateId] = useState<number | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editEmail, setEditEmail] = useState<string>("");
  const [editIsActive, setEditIsActive] = useState<boolean>(true);
  const [editPassword, setEditPassword] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Fetch all graduates list
  const fetchGraduates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await AdminService.getGraduates();
      if (response.success && Array.isArray(response.data)) {
        setGraduates(response.data);
      } else {
        setError(response.message || "حدث خطأ أثناء جلب بيانات الخريجين.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "تعذر الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraduates();
  }, []);

  // Filter logic
  const filteredGraduates = useMemo(() => {
    return graduates.filter((grad) => {
      const matchesSearch =
        grad.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grad.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(grad.id).includes(searchTerm);

      let matchesFilter = true;
      if (statusFilter === "active") matchesFilter = grad.isActive;
      if (statusFilter === "inactive") matchesFilter = !grad.isActive;
      if (statusFilter === "first_login") matchesFilter = grad.isFirstLogin;

      return matchesSearch && matchesFilter;
    });
  }, [graduates, searchTerm, statusFilter]);

  // Selection Logic
  const allFilteredIds = useMemo(() => filteredGraduates.map((g) => g.id), [filteredGraduates]);
  const isAllSelected = useMemo(() => {
    return allFilteredIds.length > 0 && allFilteredIds.every((id) => selectedIds.includes(id));
  }, [allFilteredIds, selectedIds]);

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      // Unselect all filtered
      setSelectedIds((prev) => prev.filter((id) => !allFilteredIds.includes(id)));
    } else {
      // Select all filtered
      const combined = Array.from(new Set([...selectedIds, ...allFilteredIds]));
      setSelectedIds(combined);
    }
  };

  const handleToggleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Fetch single graduate by ID on Row Click
  const handleRowClick = async (graduateId: number) => {
    setIsModalOpen(true);
    setLoadingModal(true);
    setSelectedGraduate(null);
    setModalError(null);

    try {
      const response = await AdminService.getGraduateById(graduateId);
      if (response.success && response.data) {
        setSelectedGraduate(response.data);
      } else {
        setModalError(response.message || "فشل في جلب تفاصيل الخريج.");
      }
    } catch (err: unknown) {
      setModalError(err instanceof Error ? err.message : "تعذر الاتصال بالخادم.");
    } finally {
      setLoadingModal(false);
    }
  };

  // Create new graduate inline
  const handleCreateGraduate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const nameToSubmit = newGraduateName.trim();
    if (!nameToSubmit) {
      setCreateMessage({ type: "error", text: "يرجى كتابة اسم الخريج أولاً." });
      return;
    }

    setIsCreating(true);
    setCreateMessage(null);

    try {
      const response = await AdminService.createGraduate(nameToSubmit);
      if (response.success) {
        setCreateMessage({ type: "success", text: "تمت إضافة الخريج بنجاح!" });
        setNewGraduateName("");
        await fetchGraduates();
        setTimeout(() => setCreateMessage(null), 4000);
      } else {
        setCreateMessage({ type: "error", text: response.message || "فشل في إضافة الخريج." });
      }
    } catch (err: unknown) {
      setCreateMessage({
        type: "error",
        text: err instanceof Error ? err.message : "تعذر الاتصال بالخادم عند إضافة الخريج.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Generate Tickets Handler
  const handleGenerateTicketsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) {
      setGenerateError("يرجى تحديد خريج واحد على الأقل.");
      return;
    }
    if (!quantityPerGraduate || quantityPerGraduate < 1) {
      setGenerateError("يرجى أدخال عدد تذاكر صحيح (1 أو أكثر).");
      return;
    }

    setIsGenerating(true);
    setGenerateError(null);
    setGenerateResult(null);

    try {
      const response = await AdminService.generateTickets({
        graduateIds: selectedIds,
        quantityPerGraduate: Number(quantityPerGraduate),
      });

      if (response.success && response.data) {
        setGenerateResult(response.data);
        // Refresh graduate list to update tickets count
        await fetchGraduates();
      } else {
        setGenerateError(response.message || "فشل توليد التذاكر للخريجين.");
      }
    } catch (err: unknown) {
      setGenerateError(
        err instanceof Error ? err.message : "تعذر الاتصال بالخادم عند توليد التذاكر."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Close Generate Tickets Modal and reset
  const handleCloseGenerateModal = () => {
    setIsGenerateModalOpen(false);
    setGenerateResult(null);
    setGenerateError(null);
    if (generateResult) {
      // Clear selections if generation was successful
      setSelectedIds([]);
    }
  };

  // Open Single Delete Modal
  const openSingleDeleteModal = (id: number, name: string) => {
    setDeleteTarget({ type: "single", id, name });
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  // Open Edit Graduate Modal (pre-fill with current/old data)
  const openEditModal = (graduate: GraduateItem) => {
    setEditingGraduateId(graduate.id);
    setEditName(graduate.name || "");
    setEditEmail(graduate.email || "");
    setEditIsActive(graduate.isActive ?? true);
    setEditPassword("");
    setUpdateError(null);
    setIsEditModalOpen(true);
  };

  // Submit Update Graduate Form
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGraduateId) return;

    if (!editName.trim()) {
      setUpdateError("يرجى كتابة اسم الخريج.");
      return;
    }

    if (!editEmail.trim()) {
      setUpdateError("يرجى كتابة البريد الإلكتروني للخريج.");
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);

    try {
      const payload: UpdateGraduateRequest = {
        name: editName.trim(),
        email: editEmail.trim(),
        isActive: editIsActive,
      };

      if (editPassword.trim()) {
        payload.password = editPassword.trim();
      }

      const response = await AdminService.updateGraduate(editingGraduateId, payload);

      if (response.success && response.data) {
        setCreateMessage({
          type: "success",
          text: response.message || "تم تحديث بيانات الخريج بنجاح!",
        });

        // Update selectedGraduate if modal is viewing this graduate
        if (selectedGraduate?.id === editingGraduateId) {
          setSelectedGraduate(response.data);
        }

        setIsEditModalOpen(false);
        setEditingGraduateId(null);
        await fetchGraduates();
        setTimeout(() => setCreateMessage(null), 4000);
      } else {
        setUpdateError(response.message || "فشل في تحديث بيانات الخريج.");
      }
    } catch (err: unknown) {
      setUpdateError(
        err instanceof Error ? err.message : "تعذر الاتصال بالخادم عند تحديث البيانات."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // Open Batch Delete Modal
  const openBatchDeleteModal = () => {
    if (selectedIds.length === 0) return;
    setDeleteTarget({ type: "batch", ids: [...selectedIds] });
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete Handler
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      if (deleteTarget.type === "single" && deleteTarget.id) {
        const targetId = deleteTarget.id;
        const response = await AdminService.deleteGraduate(targetId);
        if (response.success) {
          setCreateMessage({
            type: "success",
            text: response.message || `تم حذف الخريج بنجاح.`,
          });
          setSelectedIds((prev) => prev.filter((id) => id !== targetId));
          if (selectedGraduate?.id === targetId) {
            setIsModalOpen(false);
            setSelectedGraduate(null);
          }
          setIsDeleteModalOpen(false);
          setDeleteTarget(null);
          await fetchGraduates();
          setTimeout(() => setCreateMessage(null), 4000);
        } else {
          setDeleteError(response.message || "فشل في حذف الخريج.");
        }
      } else if (deleteTarget.type === "batch" && deleteTarget.ids && deleteTarget.ids.length > 0) {
        const targetIds = deleteTarget.ids;
        let successCount = 0;
        let failCount = 0;

        const results = await Promise.allSettled(
          targetIds.map(async (id) => {
            const res = await AdminService.deleteGraduate(id);
            if (res.success) {
              return { id, success: true };
            } else {
              return { id, success: false, message: res.message };
            }
          })
        );

        const successfullyDeletedIds: number[] = [];
        results.forEach((res, idx) => {
          if (res.status === "fulfilled" && res.value.success) {
            successCount++;
            successfullyDeletedIds.push(targetIds[idx]);
          } else {
            failCount++;
          }
        });

        if (successCount > 0) {
          setSelectedIds((prev) => prev.filter((id) => !successfullyDeletedIds.includes(id)));
          await fetchGraduates();
        }

        if (failCount === 0) {
          setCreateMessage({
            type: "success",
            text: `تم حذف ${successCount} خريج بنجاح!`,
          });
          setIsDeleteModalOpen(false);
          setDeleteTarget(null);
          setTimeout(() => setCreateMessage(null), 4000);
        } else {
          setDeleteError(
            `تم حذف ${successCount} خريج بنجاح، ولكن تعذر حذف ${failCount} خريج.`
          );
        }
      }
    } catch (err: unknown) {
      setDeleteError(err instanceof Error ? err.message : "تعذر الاتصال بالخادم عند إجراء عملية الحذف.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Aggregated Stats
  const totals = useMemo(() => {
    return graduates.reduce(
      (acc, grad) => {
        acc.totalGraduates += 1;
        acc.ticketsCount += grad.ticketsCount || 0;
        acc.ticketsUsedCount += grad.ticketsUsedCount || 0;
        acc.ticketsUnusedCount += grad.ticketsUnusedCount || 0;
        acc.ticketsCancelledCount += grad.ticketsCancelledCount || 0;
        return acc;
      },
      {
        totalGraduates: 0,
        ticketsCount: 0,
        ticketsUsedCount: 0,
        ticketsUnusedCount: 0,
        ticketsCancelledCount: 0,
      }
    );
  }, [graduates]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat("ar-YE", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* 1. Header & Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">إدارة الخريجين والدعوات</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                حدد الخريجين من مربعات الاختيار لتصدير وتوليد تذاكر ودعوات لهم دفعة واحدة أو بشكل فردي
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Batch Generate Tickets & Delete Buttons */}
          {selectedIds.length > 0 && (
            <>
              <button
                onClick={() => setIsGenerateModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all animate-in fade-in cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>توليد التذاكر للمحددين ({selectedIds.length})</span>
              </button>

              <button
                onClick={openBatchDeleteModal}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all animate-in fade-in cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>حذف المحددين ({selectedIds.length})</span>
              </button>
            </>
          )}

          <button
            onClick={fetchGraduates}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-medium transition-all shadow-sm cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "جاري التحديث..." : "تحديث البيانات"}</span>
          </button>
        </div>
      </div>

      {/* 2. Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Graduates */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">إجمالي الخريجين</span>
            <div className="p-2 bg-slate-100 rounded-xl text-slate-700">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totals.totalGraduates}</div>
          <p className="text-[11px] text-slate-400">مسجلين بالمنظومة</p>
        </div>

        {/* Total Actual Tickets */}
        <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm space-y-2 hover:border-blue-200 transition-all">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-xs font-medium text-slate-600">أجمالي الدعوات الفعليه</span>
            <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-700">{totals.ticketsCount}</div>
          <p className="text-[11px] text-blue-500 font-medium">دعوة مخصصة للجميع</p>
        </div>

        {/* Used Tickets */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-2 hover:border-emerald-200 transition-all">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-medium text-slate-600">الدعوات المستخدمة</span>
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700">{totals.ticketsUsedCount}</div>
          <p className="text-[11px] text-emerald-500 font-medium">تم المسح عند البوابات</p>
        </div>

        {/* Unused Tickets */}
        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm space-y-2 hover:border-amber-200 transition-all">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-medium text-slate-600">غير مستخدمة</span>
            <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-700">{totals.ticketsUnusedCount}</div>
          <p className="text-[11px] text-amber-500 font-medium">دعوات سارية</p>
        </div>

        {/* Cancelled Tickets */}
        <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm space-y-2 hover:border-rose-200 transition-all">
          <div className="flex items-center justify-between text-rose-600">
            <span className="text-xs font-medium text-slate-600">الدعوات الملغية</span>
            <div className="p-2 bg-rose-50 rounded-xl text-rose-600">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-700">{totals.ticketsCancelledCount}</div>
          <p className="text-[11px] text-rose-500 font-medium">ملغاة أو مسترجعة</p>
        </div>
      </div>

      {/* 3. Search and Filter toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="بحث باسم الخريج، البريد الإلكتروني، أو المعرف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/20 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 font-medium ml-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            التصفية:
          </span>
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${statusFilter === "all"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
          >
            الكل ({graduates.length})
          </button>
          <button
            onClick={() => setStatusFilter("active")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${statusFilter === "active"
              ? "bg-emerald-600 text-white shadow-sm"
              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
              }`}
          >
            نشط
          </button>
          <button
            onClick={() => setStatusFilter("inactive")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${statusFilter === "inactive"
              ? "bg-rose-600 text-white shadow-sm"
              : "bg-rose-50 text-rose-700 hover:bg-rose-100"
              }`}
          >
            معطل
          </button>
          <button
            onClick={() => setStatusFilter("first_login")}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${statusFilter === "first_login"
              ? "bg-amber-600 text-white shadow-sm"
              : "bg-amber-50 text-amber-700 hover:bg-amber-100"
              }`}
          >
            تسجيل دخول أول
          </button>
        </div>
      </div>

      {/* Floating Batch Actions Bar when checkboxes are selected */}
      {selectedIds.length > 0 && (
        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between gap-4 animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-xs">
              {selectedIds.length}
            </div>
            <div>
              <p className="text-xs font-bold">تم تحديد {selectedIds.length} خريج/خريجين</p>
              <p className="text-[11px] text-slate-400">يمكنك الآن إصدار وتوليد التذاكر والدعوات لهم دفعة واحدة</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsGenerateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-xl shadow transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>توليد التذاكر للمحددين ({selectedIds.length})</span>
            </button>

            <button
              onClick={openBatchDeleteModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs rounded-xl shadow transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>حذف المحددين ({selectedIds.length})</span>
            </button>

            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium rounded-xl transition-all"
            >
              إلغاء التحديد
            </button>
          </div>
        </div>
      )}

      {/* Inline Creation Notification Alert */}
      {createMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs transition-all ${createMessage.type === "success"
            ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
            : "bg-rose-50 border border-rose-200 text-rose-800"
            }`}
        >
          <div className="flex items-center gap-2">
            {createMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span className="font-medium">{createMessage.text}</span>
          </div>
          <button
            onClick={() => setCreateMessage(null)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Fetch Error State */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-rose-800 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchGraduates}
            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition-colors cursor-pointer"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* 4. Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* ADD GRADUATE INPUT BAR - ABOVE COLUMN HEADERS */}
        <div className="p-4 bg-slate-50/90 border-b border-slate-200/80">
          <form onSubmit={handleCreateGraduate} className="flex items-center gap-3 w-full">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
              <UserPlus className="w-4 h-4 text-blue-600" />
            </div>
            <input
              type="text"
              value={newGraduateName}
              onChange={(e) => setNewGraduateName(e.target.value)}
              placeholder="أدخل اسم الخريج الجديد واضغط إضافة أو Enter..."
              disabled={isCreating}
              className="flex-1 w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={isCreating || !newGraduateName.trim()}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-sm transition-all shrink-0 cursor-pointer"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>جاري الإضافة...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>إضافة الخريج</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200/80">
              <tr>
                {/* SELECT ALL CHECKBOX */}
                <th className="py-3.5 px-3 text-center w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleSelectAll}
                    title="تحديد الكل / إلغاء تحديد الكل"
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4 text-center">#</th>
                <th className="py-3.5 px-4">اسم الخريج</th>
                <th className="py-3.5 px-4">البريد الإلكتروني</th>
                <th className="py-3.5 px-4 text-center">أجمالي الدعوات الفعليه</th>
                <th className="py-3.5 px-4 text-center">المستخدمة</th>
                <th className="py-3.5 px-4 text-center">غير مستخدمة</th>
                <th className="py-3.5 px-4 text-center">الملغية</th>
                <th className="py-3.5 px-4 text-center">حالة الحساب</th>
                <th className="py-3.5 px-4">تاريخ التسجيل</th>
                <th className="py-3.5 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">

              {/* GRADUATES LIST ROWS */}
              {loading ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center">
                    <div className="space-y-3">
                      <RefreshCw className="w-8 h-8 text-slate-400 animate-spin mx-auto" />
                      <p className="text-xs text-slate-500 font-medium">جاري تحميل قائمة الخريجين من الخادم...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredGraduates.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center">
                    <div className="space-y-3">
                      <GraduationCap className="w-12 h-12 text-slate-300 mx-auto" />
                      <p className="text-sm font-semibold text-slate-700">لم يتم العثور على خريجين</p>
                      <p className="text-xs text-slate-400">يمكنك استخدام خيار الإضافة أعلاه لإضافة خريجين جدد.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredGraduates.map((grad) => {
                  const isSelected = selectedIds.includes(grad.id);
                  return (
                    <tr
                      key={grad.id}
                      onClick={() => handleRowClick(grad.id)}
                      className={`hover:bg-blue-50/50 cursor-pointer transition-colors group ${isSelected ? "bg-blue-50/40" : ""
                        }`}
                      title="انقر لعرض تفاصيل الخريج"
                    >
                      {/* ROW CHECKBOX */}
                      <td
                        className="py-3.5 px-3 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectOne(grad.id)}
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>

                      {/* ID */}
                      <td className="py-3.5 px-4 text-center font-mono text-slate-400 font-medium group-hover:text-blue-600">
                        #{grad.id}
                      </td>

                      {/* Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-900 group-hover:bg-blue-600 transition-colors text-white font-bold flex items-center justify-center text-xs shrink-0">
                            {grad.name ? grad.name.charAt(0) : "خ"}
                          </div>
                          <span className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                            {grad.name}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 dir-ltr text-right text-slate-600 font-mono">
                        {grad.email}
                      </td>

                      {/* Total Tickets */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-block px-3 py-1 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                          {grad.ticketsCount}
                        </span>
                      </td>

                      {/* Used */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-block px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          {grad.ticketsUsedCount}
                        </span>
                      </td>

                      {/* Unused */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-block px-3 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
                          {grad.ticketsUnusedCount}
                        </span>
                      </td>

                      {/* Cancelled */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-block px-3 py-1 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/60">
                          {grad.ticketsCancelledCount}
                        </span>
                      </td>

                      {/* Account Status */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          {grad.isActive ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                              <UserCheck className="w-3 h-3" />
                              نشط
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-rose-100 text-rose-800">
                              <UserX className="w-3 h-3" />
                              معطل
                            </span>
                          )}
                          {grad.isFirstLogin && (
                            <span className="text-[9px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                              دخول أول
                            </span>
                          )}
                        </div>
                      </td>

                      {/* CreatedAt */}
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {formatDate(grad.createdAt)}
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3.5 px-4 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEditModal(grad)}
                            title="تعديل بيانات الخريج"
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openSingleDeleteModal(grad.id, grad.name)}
                            title="حذف الخريج"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. GENERATE TICKETS MODAL */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">توليد وتصدير الدعوات</h3>
                  <p className="text-xs text-slate-400">
                    توليد تذاكر جديدة عبر <code className="dir-ltr inline-block">POST /api/Admin/graduates/generate-tickets</code>
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseGenerateModal}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {generateResult ? (
              /* Success View */
              <div className="space-y-5">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-emerald-900">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
                    <h4 className="font-bold text-sm">تم توليد التذاكر بنجاح!</h4>
                  </div>
                  <p className="text-xs text-emerald-700">
                    تم إصدار إجمالي <span className="font-bold text-emerald-900">{generateResult.totalTicketsGenerated}</span> تذكرة لـ{" "}
                    <span className="font-bold text-emerald-900">{generateResult.totalGraduatesProcessed}</span> خريج.
                  </p>
                </div>

                {/* Tickets Code Preview List */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700">نماذج رموز التذاكر الصادرة حديثاً:</span>
                  <div className="max-h-48 overflow-y-auto space-y-1.5 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    {generateResult.tickets.map((tkt) => (
                      <div key={tkt.id} className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
                        <div className="flex items-center gap-2">
                          <Ticket className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-slate-800">{tkt.graduateName}</span>
                        </div>
                        <span className="font-mono text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded dir-ltr">
                          {tkt.ticketCode}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleCloseGenerateModal}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-medium transition-colors cursor-pointer"
                >
                  إغلاق وتحديث
                </button>
              </div>
            ) : (
              /* Input Form View */
              <form onSubmit={handleGenerateTicketsSubmit} className="space-y-5">
                <div className="p-4 bg-blue-50/80 border border-blue-100 rounded-2xl space-y-1 text-xs text-blue-900">
                  <p className="font-semibold">
                    الخريجون المحدّدون: <span className="font-bold text-blue-700">{selectedIds.length} خريج/خريجين</span>
                  </p>
                  <p className="text-[11px] text-blue-700">
                    سيتم توليد عدد التذاكر المكتوب أدناه لكل خريج من الخريجين المحددين.
                  </p>
                </div>

                {/* Error Banner */}
                {generateError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{generateError}</span>
                  </div>
                )}

                {/* Quantity Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-800">
                    عدد الدعوات والتذاكر لكل خريج (quantityPerGraduate):
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={1000}
                      value={quantityPerGraduate}
                      onChange={(e) => setQuantityPerGraduate(Number(e.target.value))}
                      placeholder="أدخل عدد التذاكر لكل خريج..."
                      disabled={isGenerating}
                      className="w-full pr-4 pl-12 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    <span className="absolute left-3 top-2.5 text-xs font-semibold text-slate-400">دعوة</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] text-slate-400">خيارات سريعة:</span>
                    {[1, 5, 10, 50].map((num) => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setQuantityPerGraduate(num)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${quantityPerGraduate === num
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Expected Total */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex justify-between items-center text-slate-700">
                  <span>إجمالي التذاكر المتوقع إصدارها:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedIds.length * (quantityPerGraduate || 0)} تذكرة
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>جاري توليد التذاكر...</span>
                      </>
                    ) : (
                      <>
                        <QrCode className="w-4 h-4" />
                        <span>تأكيد توليد التذاكر</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleCloseGenerateModal}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 6. SINGLE GRADUATE DETAILS MODAL (Row Click) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold">
                  {selectedGraduate?.name ? selectedGraduate.name.charAt(0) : "خ"}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {loadingModal ? "جاري تحميل تفاصيل الخريج..." : selectedGraduate?.name || "تفاصيل الخريج"}
                  </h3>
                  {selectedGraduate && (
                    <p className="text-xs text-slate-400">معرف الخريج #{selectedGraduate.id}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            {loadingModal ? (
              <div className="py-12 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-medium">
                  جاري الجلب من الباك إند: GET /api/Admin/graduates/id...
                </p>
              </div>
            ) : modalError ? (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{modalError}</span>
                </div>
              </div>
            ) : selectedGraduate ? (
              <>
                {/* Graduate Info */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold">البريد الإلكتروني:</span>
                    <span className="font-mono text-slate-900 dir-ltr">{selectedGraduate.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold">تاريخ الإنشاء:</span>
                    <span className="text-slate-900">{formatDate(selectedGraduate.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold">آخر تحديث:</span>
                    <span className="text-slate-900">{formatDate(selectedGraduate.updatedAt)}</span>
                  </div>
                </div>

                {/* Tickets Breakdown */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900">تفاصيل تذاكر ودعوات الخريج</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-blue-50/80 border border-blue-100 rounded-xl space-y-1">
                      <span className="text-[11px] font-medium text-blue-600">أجمالي الدعوات الفعليه</span>
                      <div className="text-xl font-bold text-blue-900">{selectedGraduate.ticketsCount}</div>
                    </div>
                    <div className="p-3 bg-emerald-50/80 border border-emerald-100 rounded-xl space-y-1">
                      <span className="text-[11px] font-medium text-emerald-600">المستخدمة</span>
                      <div className="text-xl font-bold text-emerald-900">{selectedGraduate.ticketsUsedCount}</div>
                    </div>
                    <div className="p-3 bg-amber-50/80 border border-amber-100 rounded-xl space-y-1">
                      <span className="text-[11px] font-medium text-amber-600">غير المستخدمة</span>
                      <div className="text-xl font-bold text-amber-900">{selectedGraduate.ticketsUnusedCount}</div>
                    </div>
                    <div className="p-3 bg-rose-50/80 border border-rose-100 rounded-xl space-y-1">
                      <span className="text-[11px] font-medium text-rose-600">الملغية</span>
                      <div className="text-xl font-bold text-rose-900">{selectedGraduate.ticketsCancelledCount}</div>
                    </div>
                  </div>
                </div>
              </>
            ) : null}

            <div className="pt-2 flex items-center gap-2">
              {selectedGraduate && (
                <>
                  <button
                    onClick={() => openEditModal(selectedGraduate)}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                    <span>تعديل البيانات</span>
                  </button>

                  <button
                    onClick={() => openSingleDeleteModal(selectedGraduate.id, selectedGraduate.name)}
                    className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>حذف</span>
                  </button>
                </>
              )}

              <button
                onClick={() => setIsModalOpen(false)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {deleteTarget.type === "batch" ? "تأكيد حذف الخريجين" : "تأكيد حذف الخريج"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    عبر <code className="dir-ltr inline-block">DELETE /api/Admin/graduates/{deleteTarget.type === "single" ? deleteTarget.id : "{id}"}</code>
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (!isDeleting) {
                    setIsDeleteModalOpen(false);
                    setDeleteTarget(null);
                  }
                }}
                disabled={isDeleting}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="space-y-4">
              {deleteError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{deleteError}</span>
                </div>
              )}

              <div className="p-4 bg-rose-50/60 border border-rose-100 rounded-2xl text-xs space-y-2 text-rose-900">
                <div className="flex items-center gap-2 font-bold text-rose-700">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>تحذير: هذه العملية لا يمكن التراجع عنها!</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {deleteTarget.type === "single" ? (
                    <>
                      هل أنت تأكد من رغبتك في حذف الخريج{" "}
                      <span className="font-bold text-slate-900">{deleteTarget.name}</span> (معرّف #{deleteTarget.id})؟
                    </>
                  ) : (
                    <>
                      هل أنت تأكد من رغبتك في حذف الخريجين المحددين وعددهم{" "}
                      <span className="font-bold text-slate-900">{deleteTarget.ids?.length}</span> خريج/خريجين؟
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري الحذف...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>تأكيد الحذف</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeleteTarget(null);
                }}
                disabled={isDeleting}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. EDIT GRADUATE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">تعديل بيانات الخريج</h3>
                  <p className="text-xs text-slate-400">
                    تعديل بيانات الخريج عبر <code className="dir-ltr inline-block">PUT /api/Admin/graduates/{editingGraduateId}</code>
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (!isUpdating) {
                    setIsEditModalOpen(false);
                    setEditingGraduateId(null);
                  }
                }}
                disabled={isUpdating}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              {updateError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{updateError}</span>
                </div>
              )}

              {/* Name field pre-filled */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  اسم الخريج (Name):
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="أدخل اسم الخريج..."
                  disabled={isUpdating}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  required
                />
              </div>

              {/* Email field pre-filled */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  البريد الإلكتروني (Email):
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="name@example.com"
                  disabled={isUpdating}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 dir-ltr text-right focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                  required
                />
              </div>

              {/* Account Status */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  حالة الحساب (Account Status):
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEditIsActive(true)}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${editIsActive
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                      }`}
                  >
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>نشط (Active)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditIsActive(false)}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 cursor-pointer ${!editIsActive
                      ? "bg-rose-50 border-rose-300 text-rose-800 shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                      }`}
                  >
                    <UserX className="w-4 h-4 text-rose-600" />
                    <span>معطل (Inactive)</span>
                  </button>
                </div>
              </div>

              {/* Password field optional */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-slate-700">
                  كلمة المرور الجديدة (Password - اختياري):
                </label>
                <input
                  type="text"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="أدخل كلمة مرور جديدة أو اتركها فارغة للإبقاء..."
                  disabled={isUpdating}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dir-ltr text-right"
                />
                <span className="text-[10px] text-slate-400 block">
                  اترك الحقل فارغاً إذا لم ترغب في تعديل كلمة المرور الخاصة بالخريج.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جاري حفظ التعديلات...</span>
                    </>
                  ) : (
                    <>
                      <Pencil className="w-4 h-4" />
                      <span>حفظ التعديلات</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingGraduateId(null);
                  }}
                  disabled={isUpdating}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
