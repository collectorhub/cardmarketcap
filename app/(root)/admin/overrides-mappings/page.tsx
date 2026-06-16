"use client";

import React, { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import OverridesSummary from "@/components/admin/overrides-mappings/OverridesSummary";
import OverridesFilters from "@/components/admin/overrides-mappings/OverridesFilters";
import OverrideRuleRow from "@/components/admin/overrides-mappings/OverrideRuleRow";
import { OverrideRule } from "@/types/overrides";
import { Plus, Layers, ShieldCheck, Loader2, X } from "lucide-react";
import {
  getAdminOverrideRules,
  createAdminOverrideRule,
  toggleAdminOverrideRule,
  deleteAdminOverrideRule,
} from "@/lib/queries/admin/overrides-mappings";
import CustomDropdown from "@/components/CustomDropdown";

export default function OverridesMappingsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "alias" | "exclusion" | "frontend">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [rules, setRules] = useState<OverrideRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const [summary, setSummary] = useState({
    totalRules: 0,
    aliasCleanups: 0,
    globalExclusions: 0,
    frontendHelpers: 0,
  });

  const [form, setForm] = useState({
    type: "alias_cleanup",
    raw_incoming_string: "",
    mapped_canonical_target: "",
    scope_target: "All Ingest",
  });

  async function loadRules() {
    try {
      setLoading(true);

      const res = await getAdminOverrideRules({
        search: searchQuery,
        tab: activeTab,
      });

      if (res?.success) {
        setRules(Array.isArray(res.rules) ? res.rules : []);
        setSummary({
          totalRules: Number(res.summary?.totalRules || 0),
          aliasCleanups: Number(res.summary?.aliasCleanups || 0),
          globalExclusions: Number(res.summary?.globalExclusions || 0),
          frontendHelpers: Number(res.summary?.frontendHelpers || 0),
        });
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(loadRules, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, activeTab]);

  const handleToggleStatus = async (id: string) => {
    const res = await toggleAdminOverrideRule(id);

    if (res?.success) {
      setRules((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, status: r.status === "active" ? "suspended" : "active" }
            : r
        )
      );
    } else {
      alert(res?.message || "Failed to update rule.");
    }
  };

  const handleDeleteRule = async (id: string) => {
    const ok = confirm("Delete this override/mapping rule?");
    if (!ok) return;

    const res = await deleteAdminOverrideRule(id);

    if (res?.success) {
      setRules((prev) => prev.filter((r) => r.id !== id));
    } else {
      alert(res?.message || "Failed to delete rule.");
    }
  };

  const handleCreateRule = async () => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem("user_data") : null;
    const parsed = stored ? JSON.parse(stored) : null;
    const userId = Number(parsed?.id || parsed?.user_id || 0);

    const res = await createAdminOverrideRule({
      ...form,
      created_by: userId,
    });

    if (res?.success) {
      setShowCreate(false);
      setForm({
        type: "alias_cleanup",
        raw_incoming_string: "",
        mapped_canonical_target: "",
        scope_target: "All Ingest",
      });
      loadRules();
    } else {
      alert(res?.message || "Failed to create rule.");
    }
  };

  return (
    <div className="space-y-6 pt-15 md:pt-0">
      <AdminPageHeader
        title="Override & Mapping Rules Engine"
        description="Govern normalization strings, configure title sanitization dictionaries, and alter frontend/helper records safely."
      />

      <div className="p-4 bg-[#00BA88]/5 dark:bg-[#00BA88]/10 border border-[#00BA88]/10 rounded-2xl flex items-start gap-3 select-none font-inter">
        <ShieldCheck size={16} className="text-[#00BA88] shrink-0 mt-0.5 stroke-[2.5]" />
        <div className="space-y-1 text-xs font-medium text-slate-600 dark:text-slate-400">
          <p className="font-black uppercase tracking-wider text-[#00BA88]">
            Canonical Integrity Enforcement Protocol Active
          </p>
          <p className="leading-relaxed text-[11px] sm:text-xs">
            Rules are saved into admin helper tables only. Canonical tables remain{" "}
            <strong className="text-slate-900 dark:text-slate-200 font-bold font-mono">
              read-only
            </strong>.
          </p>
        </div>
      </div>

      <OverridesSummary
        totalRules={summary.totalRules}
        aliasCleanups={summary.aliasCleanups}
        globalExclusions={summary.globalExclusions}
        frontendHelpers={summary.frontendHelpers}
      />

      <OverridesFilters
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="flex flex-row items-center justify-between gap-2 px-1 font-inter select-none w-full">
        <div className="flex items-center gap-1.5 min-w-0">
          <Layers size={11} className="text-slate-400 dark:text-slate-500 shrink-0" />
          <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 font-sans truncate">
            Active Dictionary Rules ({rules.length})
          </span>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center justify-center gap-1 h-7 sm:h-9 px-2.5 sm:px-3.5 bg-[#00BA88] hover:bg-[#00a377] text-white font-black text-[9px] sm:text-xs uppercase tracking-wider rounded-lg sm:rounded-xl transition-all cursor-pointer shadow-xs shrink-0 whitespace-nowrap"
        >
          <Plus size={11} strokeWidth={3} />
          <span>Create Rule Override</span>
        </button>
      </div>

      {showCreate && (
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              Create Safe Rule
            </h3>
            <button onClick={() => setShowCreate(false)}>
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <CustomDropdown
              value={
                form.type === "alias_cleanup"
                  ? "Alias Cleanup"
                  : form.type === "global_exclusion"
                  ? "Global Exclusion"
                  : "Frontend Helper"
              }
              options={["Alias Cleanup", "Global Exclusion", "Frontend Helper"]}
              onChange={(value) =>
                setForm((p) => ({
                  ...p,
                  type:
                    value === "Alias Cleanup"
                      ? "alias_cleanup"
                      : value === "Global Exclusion"
                      ? "global_exclusion"
                      : "frontend_helper",
                }))
              }
              className="w-full md:w-full"
            />

            <input
              value={form.raw_incoming_string}
              onChange={(e) =>
                setForm((p) => ({ ...p, raw_incoming_string: e.target.value }))
              }
              placeholder="Raw incoming string"
              className="md:col-span-1 h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 text-sm"
            />

            <input
              value={form.mapped_canonical_target}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  mapped_canonical_target: e.target.value,
                }))
              }
              placeholder="Mapped output / target"
              className="md:col-span-1 h-11 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 text-sm"
            />

            <button
              onClick={handleCreateRule}
              className="h-11 rounded-xl bg-[#00BA88] text-white text-xs font-black uppercase"
            >
              Save Rule
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {loading ? (
          <div className="py-16 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-center gap-3 text-slate-400 text-sm font-bold">
            <Loader2 className="animate-spin text-[#00BA88]" size={18} />
            Loading active rules...
          </div>
        ) : rules.length > 0 ? (
          rules.map((rule) => (
            <OverrideRuleRow
              key={rule.id}
              rule={rule}
              onToggleStatus={handleToggleStatus}
              onDeleteRule={handleDeleteRule}
            />
          ))
        ) : (
          <div className="py-16 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-center text-sm font-bold text-slate-400">
            No override or mapping rules found.
          </div>
        )}
      </div>
    </div>
  );
}