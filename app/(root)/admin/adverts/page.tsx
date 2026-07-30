"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Megaphone,
  Plus,
  Save,
  Trash2,
  Eye,
  Loader2,
  ToggleLeft,
  ToggleRight,
  ImageIcon,
  ExternalLink,
  ShieldCheck,
  LayoutGrid,
  Activity,
  BadgeDollarSign,
  Link2,
  RotateCw,
} from "lucide-react";
import {
  deleteAdvert,
  getAdminAdverts,
  saveAdvert,
  syncTcgplayerAdverts,
} from "@/lib/queries/admin/adverts";
import CustomDropdown from "@/components/CustomDropdown";
import MetricCard from "@/components/admin/MetricCard";
import { cn } from "@/lib/utils";

const EMPTY_FORM = {
  id: 0,
  provider: "internal",
  external_id: "",
  placement: "homepage_stats_card",
  title: "",
  subtitle: "",
  description: "",
  image_url: "",
  target_url: "",
  cta_label: "Learn More",
  disclosure: "",
  status: "active",
  priority: 0,
  weight: 1,
  starts_at: "",
  ends_at: "",
};

const PLACEMENTS = [
  {
    label: "Homepage Stats Card",
    value: "homepage_stats_card",
    description: "Promoted ad card beside the homepage market stats.",
  },
  {
    label: "Card Details Sidebar",
    value: "card_details_sidebar",
    description: "Sponsored block on the right side of card details pages.",
  },
];


const PROVIDERS = [
  {
    label: "CardMarketCap",
    value: "internal",
  },
  {
    label: "TCGplayer",
    value: "tcgplayer",
  },
  {
    label: "eBay",
    value: "ebay",
  },
];

function getProviderLabel(value: string) {
  return (
    PROVIDERS.find(
      (item) => item.value === value
    )?.label || value
  );
}

function getPlacementLabel(value: string) {
  return PLACEMENTS.find((item) => item.value === value)?.label || value;
}

function toInputDateTime(value: any) {
  if (!value) return "";

  const raw = String(value);
  if (raw.includes("T")) return raw.slice(0, 16);

  return raw.replace(" ", "T").slice(0, 16);
}

function toMysqlDateTime(value: string) {
  if (!value) return "";
  return value.replace("T", " ") + ":00";
}

export default function AdminAdvertsPage() {
  const [adverts, setAdverts] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY_FORM);
  const [placementFilter, setPlacementFilter] = useState("all");

  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [advertsLoading, setAdvertsLoading] = useState(false);
  const [adminUserId, setAdminUserId] = useState(0);

  const selectedId = Number(selected?.id || form.id || 0);

  async function loadAdverts(filter = placementFilter) {
    setAdvertsLoading(true);

    const res =
      filter === "all" ? await getAdminAdverts() : await getAdminAdverts(filter);

    setAdvertsLoading(false);

    if (res.success) {
      setAdverts(res.adverts || []);
    } else {
      setAdverts([]);
      alert(res.message || "Failed to load adverts.");
    }
  }

  useEffect(() => {
    loadAdverts("all");
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("user_data");

    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      setAdminUserId(Number(parsed.id || parsed.user_id || 0));
    } catch {
      setAdminUserId(0);
    }
  }, []);

  const stats = useMemo(() => {
    return {
      total: adverts.length,
      active: adverts.filter((item) => item.status === "active").length,
      homepage: adverts.filter((item) => item.placement === "homepage_stats_card").length,
      details: adverts.filter(
        (item) =>
          item.placement ===
          "card_details_sidebar"
      ).length,
      affiliate: adverts.filter(
        (item) =>
          item.provider &&
          item.provider !==
            "internal"
      ).length,
    };
  }, [adverts]);

  const handleNew = () => {
    setSelected(null);
    setForm(EMPTY_FORM);
  };

  const handleSelect = (item: any) => {
    setSelected(item);

    setForm({
      id: Number(item.id || 0),
      provider: item.provider || "internal",
      external_id:
        item.external_id ||
        item.externalId ||
        "",
      placement:
        item.placement ||
        "homepage_stats_card",
      title: item.title || "",
      subtitle: item.subtitle || "",
      description:
        item.description || "",
      image_url:
        item.image_url ||
        item.imageUrl ||
        "",
      target_url:
        item.target_url ||
        item.targetUrl ||
        "",
      cta_label:
        item.cta_label ||
        item.ctaLabel ||
        "Learn More",
      disclosure:
        item.disclosure ||
        (item.provider &&
        item.provider !== "internal"
          ? "Sponsored"
          : ""),
      status:
        item.status || "inactive",
      priority: Number(
        item.priority || 0
      ),
      weight: Math.max(
        1,
        Number(item.weight || 1)
      ),
      starts_at:
        toInputDateTime(
          item.starts_at
        ),
      ends_at:
        toInputDateTime(
          item.ends_at
        ),
    });
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      alert("Advert title is required.");
      return;
    }

    setLoading(true);

    const res = await saveAdvert({
      ...form,
      starts_at: toMysqlDateTime(form.starts_at),
      ends_at: toMysqlDateTime(form.ends_at),
      created_by: adminUserId,
    });

    setLoading(false);

    if (res.success) {
      await loadAdverts();

      const saved = {
        ...form,
        id: Number(res.id || form.id || 0),
      };

      setSelected(saved);
      setForm(saved);
    } else {
      alert(res.message || "Failed to save advert.");
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    if (!confirm("Delete this advert permanently?")) return;

    const res = await deleteAdvert(selectedId);

    if (res.success) {
      handleNew();
      await loadAdverts();
    } else {
      alert(res.message || "Failed to delete advert.");
    }
  };


  const handleSyncTcgplayer = async () => {
    if (syncing) return;

    setSyncing(true);

    try {
      const res =
        await syncTcgplayerAdverts();

      if (!res.success) {
        alert(
          res.message ||
            "Failed to sync TCGplayer adverts."
        );
        return;
      }

      const stats = res.stats || {};
      const usableCount =
        Number(stats.inserted || 0) +
        Number(stats.updated || 0) +
        Number(stats.unchanged || 0);

      /*
       * A successful API request can still produce zero usable creatives.
       * Treat that as an actionable sync problem instead of silently
       * pretending the advert import succeeded.
       */
      if (
        Number(stats.matched || 0) > 0 &&
        usableCount === 0
      ) {
        alert(
          "Impact was reached successfully, but none of the matched " +
            "TCGplayer creatives contained a usable image and tracking URL. " +
            "Please run the Impact advert diagnostic endpoint so we can map " +
            "the exact fields returned by this account."
        );
        return;
      }

      /*
       * No success popup. Refreshing the list is enough confirmation:
       * newly imported/updated adverts appear automatically.
       */
      await loadAdverts();
    } catch (error) {
      console.error(
        "TCGplayer sync error:",
        error
      );

      alert(
        "Failed to sync TCGplayer adverts."
      );
    } finally {
      setSyncing(false);
    }
  };

  const handleFilterChange = async (label: string) => {
    const next =
      label === "All Placements"
        ? "all"
        : PLACEMENTS.find((item) => item.label === label)?.value || "all";

    setPlacementFilter(next);
    await loadAdverts(next);
  };

  const previewUrl =
    form.placement === "homepage_stats_card"
      ? "/"
      : "/card-search";

  return (
    <div className="space-y-6 font-inter pt-15 md:pt-0 max-w-[1600px] mx-auto text-slate-900 dark:text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-sora">
            Advert Manager
          </h1>

          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mt-0.5 max-w-2xl">
            Manage sponsored placements across the homepage and card details pages without changing frontend code.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleNew}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#00BA88] text-white text-xs font-black hover:bg-[#00a377] transition"
          >
            <Plus size={14} />
            New Advert
          </button>

          <button
            onClick={handleSyncTcgplayer}
            disabled={syncing}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 transition hover:border-[#00BA88]/50 hover:text-[#00BA88] disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            {syncing ? (
              <Loader2
                size={14}
                className="animate-spin"
              />
            ) : (
              <RotateCw size={14} />
            )}

            {syncing
              ? "Syncing..."
              : "Sync TCGplayer"}
          </button>

          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-[#00BA88]/5 dark:bg-[#00BA88]/10 text-[#00BA88] border border-[#00BA88]/10 text-xs font-bold">
            <ShieldCheck size={14} />
            <span>Admin Controlled Ads</span>
          </div>
        </div>
      </div>

      <section className="w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory">
        <div className="flex md:grid md:grid-cols-5 gap-4 min-w-max md:min-w-0 pb-2">
          {[
            {
              label: "Total Adverts",
              value: String(stats.total),
              sub: "cmc_adverts",
              icon: Megaphone,
              color: "text-blue-600 bg-blue-50 dark:bg-blue-500/10",
            },
            {
              label: "Active Ads",
              value: String(stats.active),
              sub: "status = active",
              icon: Activity,
              color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10",
            },
            {
              label: "Homepage Slots",
              value: String(stats.homepage),
              sub: "homepage_stats_card",
              icon: LayoutGrid,
              color: "text-purple-600 bg-purple-50 dark:bg-purple-500/10",
            },
            {
              label: "Details Slots",
              value: String(stats.details),
              sub: "card_details_sidebar",
              icon: ImageIcon,
              color: "text-orange-600 bg-orange-50 dark:bg-orange-500/10",
            },
            {
              label: "Affiliate Ads",
              value: String(stats.affiliate),
              sub: "TCGplayer + eBay",
              icon: BadgeDollarSign,
              color: "text-cyan-600 bg-cyan-50 dark:bg-cyan-500/10",
            },
          ].map((metric, idx) => (
            <div
              key={metric.label}
              className="w-[285px] sm:w-[320px] md:w-auto snap-start shrink-0"
            >
              <MetricCard
                label={metric.label}
                value={metric.value}
                sub={metric.sub}
                icon={metric.icon}
                color={metric.color}
                index={idx}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:items-start">
        <div className="xl:col-span-4 bg-white dark:bg-slate-900 rounded-[24px] md:rounded-[28px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <div className="p-4 md:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black">
                    Adverts
                  </h2>

                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                    {adverts.length}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 font-bold mt-0.5">
                  Active, inactive, and scheduled campaigns
                </p>
              </div>

              {advertsLoading && (
                <Loader2 size={16} className="animate-spin text-slate-400" />
              )}
            </div>

            <CustomDropdown
              value={
                placementFilter === "all"
                  ? "All Placements"
                  : getPlacementLabel(placementFilter)
              }
              options={["All Placements", ...PLACEMENTS.map((item) => item.label)]}
              onChange={handleFilterChange}
              className="w-full"
            />
          </div>

          <div className="admin-advert-list divide-y divide-slate-100 dark:divide-slate-800 max-h-[720px] xl:max-h-[1188px] overflow-y-auto">
            {adverts.length > 0 ? (
              adverts.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={cn(
                    "w-full text-left p-4 md:p-5 xl:h-[108px] xl:min-h-[108px] flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-950 transition",
                    selectedId === Number(item.id) && "bg-[#00BA88]/10"
                  )}
                >
                  <div className="min-w-0 flex items-center gap-3">
                    <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                      {item.image_url || item.imageUrl ? (
                        <img
                          src={item.image_url || item.imageUrl}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Megaphone size={20} className="text-[#00BA88]" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-black text-slate-900 dark:text-white truncate">
                        {item.title}
                      </p>

                      <p className="text-[11px] font-bold text-slate-400 truncate">
                        {getPlacementLabel(item.placement)}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <span className="text-[9px] font-black uppercase tracking-wider text-[#00BA88]">
                          {getProviderLabel(
                            item.provider ||
                              "internal"
                          )}
                        </span>

                        {item.provider ===
                          "tcgplayer" &&
                        item.external_id ? (
                          <span className="text-[9px] font-black uppercase tracking-wider text-blue-500">
                            Synced from Impact
                          </span>
                        ) : null}

                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                          Priority{" "}
                          {item.priority || 0}
                        </span>

                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                          Weight{" "}
                          {item.weight || 1}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={cn(
                      "text-[10px] font-black px-2 py-1 rounded-lg shrink-0",
                      item.status === "active"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-slate-500/10 text-slate-400"
                    )}
                  >
                    {item.status === "active" ? "LIVE" : "OFF"}
                  </span>
                </button>
              ))
            ) : (
              <div className="p-8 text-center">
                <Megaphone className="mx-auto text-slate-400 mb-3" />

                <p className="text-sm font-bold text-slate-400">
                  No adverts found.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[24px] md:rounded-[28px] border border-slate-100 dark:border-slate-800 p-4 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="text-sm font-black">Advert Configuration</h2>

                <p className="text-[11px] text-slate-400 font-bold mt-0.5">
                  Control provider, placement, creative, destination, schedule, and rotation weight.
                </p>
              </div>

              {selectedId > 0 && (
                <div className="flex items-center gap-2">
                  <a
                    href={previewUrl}
                    target="_blank"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-xs font-black"
                  >
                    <Eye size={14} />
                    Preview Area
                  </a>

                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 text-red-500 text-xs font-black"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomDropdown
                value={getProviderLabel(
                  form.provider
                )}
                options={PROVIDERS.map(
                  (item) => item.label
                )}
                onChange={(label) => {
                  const provider =
                    PROVIDERS.find(
                      (item) =>
                        item.label === label
                    )?.value ||
                    "internal";

                  setForm({
                    ...form,
                    provider,
                    disclosure:
                      provider === "internal"
                        ? ""
                        : form.disclosure ||
                          "Sponsored",
                  });
                }}
                className="w-full md:w-full"
              />

              <CustomDropdown
                value={getPlacementLabel(form.placement)}
                options={PLACEMENTS.map((item) => item.label)}
                onChange={(label) => {
                  const placement =
                    PLACEMENTS.find((item) => item.label === label)?.value ||
                    "homepage_stats_card";

                  setForm({ ...form, placement });
                }}
                className="w-full md:w-full"
              />

              <button
                onClick={() =>
                  setForm({
                    ...form,
                    status: form.status === "active" ? "inactive" : "active",
                  })
                }
                className="h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-black flex items-center justify-between"
              >
                <span>{form.status === "active" ? "Active" : "Inactive"}</span>

                {form.status === "active" ? (
                  <ToggleRight className="text-[#00BA88]" />
                ) : (
                  <ToggleLeft className="text-slate-400" />
                )}
              </button>

              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Advert title e.g. Grading"
                className="h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold outline-none focus:border-[#00BA88]"
              />

              <input
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="Subtitle e.g. PSA Grading Partner"
                className="h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold outline-none focus:border-[#00BA88]"
              />

              <div className="relative">
                <Link2
                  size={14}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={form.external_id}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      external_id:
                        e.target.value,
                    })
                  }
                  placeholder="External creative ID (optional)"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-bold outline-none focus:border-[#00BA88] dark:border-slate-800 dark:bg-slate-950"
                />
              </div>

              <input
                value={form.disclosure}
                onChange={(e) =>
                  setForm({
                    ...form,
                    disclosure:
                      e.target.value,
                  })
                }
                placeholder={
                  form.provider ===
                  "internal"
                    ? "Disclosure (optional)"
                    : "Disclosure e.g. Sponsored"
                }
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#00BA88] dark:border-slate-800 dark:bg-slate-950"
              />

              <input
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                placeholder="Image URL"
                className="md:col-span-2 h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold outline-none focus:border-[#00BA88]"
              />

              <input
                value={form.target_url}
                onChange={(e) => setForm({ ...form, target_url: e.target.value })}
                placeholder="Target URL e.g. https://..."
                className="h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold outline-none focus:border-[#00BA88]"
              />

              <input
                value={form.cta_label}
                onChange={(e) => setForm({ ...form, cta_label: e.target.value })}
                placeholder="CTA Label e.g. Learn More"
                className="h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold outline-none focus:border-[#00BA88]"
              />

              <div className="grid grid-cols-2 gap-3">
                <label className="space-y-1.5">
                  <span className="flex items-center gap-1.5 px-1 text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Priority
                  </span>

                  <input
                    type="number"
                    value={form.priority}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        priority: Number(
                          e.target.value ||
                            0
                        ),
                      })
                    }
                    min={0}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#00BA88] dark:border-slate-800 dark:bg-slate-950"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="flex items-center gap-1.5 px-1 text-[9px] font-black uppercase tracking-wider text-slate-400">
                    <RotateCw size={11} />
                    Rotation Weight
                  </span>

                  <input
                    type="number"
                    value={form.weight}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        weight: Math.max(
                          1,
                          Math.min(
                            10,
                            Number(
                              e.target
                                .value ||
                                1
                            )
                          )
                        ),
                      })
                    }
                    min={1}
                    max={10}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none focus:border-[#00BA88] dark:border-slate-800 dark:bg-slate-950"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="datetime-local"
                  value={form.starts_at}
                  onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
                  className="h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none focus:border-[#00BA88]"
                />

                <input
                  type="datetime-local"
                  value={form.ends_at}
                  onChange={(e) => setForm({ ...form, ends_at: e.target.value })}
                  className="h-11 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none focus:border-[#00BA88]"
                />
              </div>

              <div className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-[10px] font-bold leading-relaxed text-slate-500 dark:text-slate-400">
                  Rotation weight controls frequency among adverts with the same placement. Use 1 for equal rotation, 2 to show this advert about twice as often, up to 10.
                </p>
              </div>

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Advert description"
                className="md:col-span-2 min-h-28 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium outline-none focus:border-[#00BA88] resize-none"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={loading}
              className="mt-5 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#00BA88] text-white text-xs font-black disabled:opacity-50 hover:bg-[#00a377] transition"
            >
              {loading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}
              {loading ? "Saving..." : "Save Advert"}
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[24px] md:rounded-[28px] border border-slate-100 dark:border-slate-800 p-4 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="text-sm font-black">Live Preview</h2>

                <p className="text-[11px] text-slate-400 font-bold mt-0.5">
                  Preview how this advert will appear in the public interface.
                </p>
              </div>

              {form.target_url && (
                <a
                  href={form.target_url}
                  target="_blank"
                  className="inline-flex items-center gap-2 text-xs font-black text-[#00BA88]"
                >
                  Open URL <ExternalLink size={13} />
                </a>
              )}
            </div>

            <div className="max-w-md rounded-[2rem] border border-[#00BA88]/30 bg-[#00BA88]/5 dark:bg-[#00BA88]/10 p-6">
              <div className="flex items-center justify-between gap-3 text-[#00BA88] mb-5">
                <Megaphone size={16} />
                <span className="text-[11px] md:text-[12px] font-black uppercase tracking-[0.2em]">
                  {form.disclosure ||
                    (form.provider ===
                    "internal"
                      ? "Promotion"
                      : "Sponsored")}
                </span>

                <span className="rounded-full bg-white/70 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-slate-500 dark:bg-white/10 dark:text-slate-300">
                  {getProviderLabel(
                    form.provider
                  )}
                </span>
              </div>

              {form.image_url ? (
                <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-white/50 dark:bg-white/5 mb-5">
                  <img
                    src={form.image_url}
                    alt={form.title || "Advert"}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[16/10] rounded-2xl bg-white/70 dark:bg-white/5 border border-dashed border-[#00BA88]/30 flex items-center justify-center mb-5">
                  <ImageIcon className="text-[#00BA88]" size={30} />
                </div>
              )}

              <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight mb-2">
                {form.title || "Advert Title"}
              </h3>

              <p className="text-[11px] font-black uppercase tracking-widest text-[#00BA88] mb-3">
                {form.subtitle || "Advert subtitle"}
              </p>

              <p className="text-sm text-slate-500 dark:text-slate-300 font-semibold leading-relaxed mb-5">
                {form.description ||
                  "Advert description will appear here for promoted campaigns."}
              </p>

              <span className="inline-flex items-center gap-2 rounded-xl bg-[#00BA88] text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest">
                {form.cta_label || "Learn More"} <ExternalLink size={12} />
              </span>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .admin-advert-list {
          scrollbar-width: thin;
          scrollbar-color: rgba(148, 163, 184, 0.42) transparent;
          overscroll-behavior: contain;
        }

        .admin-advert-list::-webkit-scrollbar {
          width: 7px;
        }

        .admin-advert-list::-webkit-scrollbar-track {
          background: transparent;
        }

        .admin-advert-list::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.34);
          border-radius: 999px;
        }

        .admin-advert-list::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 186, 136, 0.55);
        }
      `}</style>
    </div>
  );
}
