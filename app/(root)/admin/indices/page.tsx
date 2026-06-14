"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Save,
  Trash2,
  Layers,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  BarChart3,
  Activity,
  Eye,
  Loader2,
} from "lucide-react";
import {
  deleteIndex,
  getAdminIndices,
  getIndexCards,
  removeIndexCard,
  saveIndex,
  saveIndexCard,
  searchCardsForIndex,
} from "@/lib/queries/adminIndices";
import { cn } from "@/lib/utils";
import MetricCard from "@/components/admin/MetricCard";

const EMPTY_FORM = {
  id: 0,
  name: "",
  slug: "",
  description: "",
  category: "index",
  is_active: 1,
};

const PLACEHOLDER_IMAGE = "https://pokecollectorhub.com/assets/placeholder.png";

export default function AdminIndicesPage() {
  const [indices, setIndices] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY_FORM);
  const [indexCards, setIndexCards] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [adminUserId, setAdminUserId] = useState<number>(0);

  async function loadIndices() {
    const res = await getAdminIndices();
    if (res.success) {
      setIndices(res.indices || []);
    }
  }

  async function loadCards(indexId: number) {
    if (!indexId) {
      setIndexCards([]);
      return;
    }

    setCardsLoading(true);
    const res = await getIndexCards(indexId);
    setCardsLoading(false);

    if (res.success) {
      setIndexCards(res.cards || []);
    } else {
      setIndexCards([]);
      alert(res.message || "Failed to load index cards.");
    }
  }

  useEffect(() => {
    loadIndices();
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

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!search.trim() || !selectedId) {
        setResults([]);
        return;
      }

      setSearching(true);
      const res = await searchCardsForIndex(search);
      setSearching(false);

      if (res.success) {
        setResults(res.cards || []);
      } else {
        setResults([]);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  const selectedId = Number(selected?.id || form?.id || 0);

  const stats = useMemo(() => {
    return {
      total: indices.length,
      active: indices.filter((i) => Number(i.is_active) === 1).length,
      cards: indexCards.length,
    };
  }, [indices, indexCards]);

  const handleSelectIndex = async (item: any) => {
    setSelected(item);
    setForm({
      id: Number(item.id),
      name: item.name || "",
      slug: item.slug || "",
      description: item.description || "",
      category: item.category || "index",
      is_active: Number(item.is_active) === 1 ? 1 : 0,
    });

    setSearch("");
    setResults([]);
    await loadCards(Number(item.id));
  };

  const handleNew = () => {
    setSelected(null);
    setForm(EMPTY_FORM);
    setIndexCards([]);
    setResults([]);
    setSearch("");
  };

  const handleSaveIndex = async () => {
    setLoading(true);

    const res = await saveIndex({
      ...form,
      user_id: adminUserId,
    });

    setLoading(false);

    if (res.success) {
      await loadIndices();

      const savedId = Number(res.id || form.id || 0);

      if (savedId) {
        const saved = {
          ...form,
          id: savedId,
          slug: res.slug || form.slug,
        };

        setSelected(saved);
        setForm(saved);
        await loadCards(savedId);
      }
    } else {
      alert(res.message || "Failed to save index.");
    }
  };

  const handleDeleteIndex = async () => {
    if (!selectedId) return;
    if (!confirm("Delete this index and all cards inside it?")) return;

    const res = await deleteIndex(selectedId);

    if (res.success) {
      handleNew();
      await loadIndices();
    } else {
      alert(res.message || "Failed to delete index.");
    }
  };

  const handleAddCard = async (card: any) => {
    if (!selectedId) {
      alert("Create or select an index first.");
      return;
    }

    const res = await saveIndexCard({
      index_id: selectedId,
      card_id: card.card_id || card.id,
      grade: "PSA 10",
      weight: 1,
      sort_order: indexCards.length + 1,
      user_id: adminUserId,
    });

    if (res.success) {
      setSearch("");
      setResults([]);
      await loadCards(selectedId);
      await loadIndices();
    } else {
      alert(res.message || "Failed to add card.");
    }
  };

  const handleRemoveCard = async (card: any) => {
    if (!selectedId) return;

    const res = await removeIndexCard(Number(card.id), selectedId);

    if (res.success) {
      await loadCards(selectedId);
      await loadIndices();
    } else {
      alert(res.message || "Failed to remove card.");
    }
  };

  return (
    <div className="space-y-6 font-inter pt-15 md:pt-0 max-w-[1600px] mx-auto text-slate-900 dark:text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-sora">
            Market Index Builder
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mt-0.5 max-w-2xl">
            Create market indices, select cards, assign weights, and control which index portfolios appear on the public app.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#00BA88]/5 dark:bg-[#00BA88]/10 text-[#00BA88] border border-[#00BA88]/10 text-xs font-bold">
          <ShieldCheck size={14} />
          <span>Admin Controlled Indices</span>
        </div>
      </div>

      <section className="w-full overflow-x-auto scrollbar-hide snap-x snap-mandatory">
        <div className="flex md:grid md:grid-cols-3 gap-4 min-w-max md:min-w-0 pb-2">
          {[
            {
              label: "Total Indices",
              value: String(stats.total),
              sub: "cmc_indices",
              icon: BarChart3,
              color: "text-blue-600 bg-blue-50 dark:bg-blue-500/10",
            },
            {
              label: "Active Published",
              value: String(stats.active),
              sub: "is_active = 1",
              icon: Activity,
              color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10",
            },
            {
              label: "Selected Cards",
              value: String(stats.cards),
              sub: "cmc_index_cards",
              icon: Layers,
              color: "text-purple-600 bg-purple-50 dark:bg-purple-500/10",
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

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-4 bg-white dark:bg-slate-900 rounded-[24px] md:rounded-[28px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <div className="p-4 md:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black">Indices</h2>
              <p className="text-[11px] text-slate-400 font-bold mt-0.5">
                Published and draft baskets
              </p>
            </div>

            <button
              onClick={handleNew}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#00BA88] text-white text-xs font-black hover:bg-[#00a377] transition"
            >
              <Plus size={14} />
              New
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[520px] xl:max-h-[680px] overflow-y-auto scrollbar-hide">
            {indices.length > 0 ? (
              indices.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectIndex(item)}
                  className={cn(
                    "w-full text-left p-4 md:p-5 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-950 transition",
                    selectedId === Number(item.id) && "bg-[#00BA88]/10"
                  )}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-black text-slate-900 dark:text-white truncate">
                      {item.name}
                    </p>

                    <p className="text-[11px] font-bold text-slate-400 truncate">
                      /overview/indices/{item.slug}
                    </p>

                    <p className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase mt-1">
                      {item.category} · {item.card_count || 0} cards
                    </p>
                  </div>

                  <span
                    className={cn(
                      "text-[10px] font-black px-2 py-1 rounded-lg shrink-0",
                      Number(item.is_active) === 1
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-slate-500/10 text-slate-400"
                    )}
                  >
                    {Number(item.is_active) === 1 ? "LIVE" : "DRAFT"}
                  </span>
                </button>
              ))
            ) : (
              <div className="p-8 text-center">
                <BarChart3 className="mx-auto text-slate-400 mb-3" />
                <p className="text-sm font-bold text-slate-400">
                  No index created yet.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[24px] md:rounded-[28px] border border-slate-100 dark:border-slate-800 p-4 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="text-sm font-black">Index Configuration</h2>
                <p className="text-[11px] text-slate-400 font-bold mt-0.5">
                  Define the public index identity and status.
                </p>
              </div>

              {selectedId > 0 && (
                <div className="flex items-center gap-2">
                  <a
                    href={`/indices/${form.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-xs font-black"
                  >
                    <Eye size={14} />
                    Preview
                  </a>

                  <button
                    onClick={handleDeleteIndex}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 text-red-500 text-xs font-black"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Index name e.g. Top 20 Index"
                className="h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold outline-none focus:border-[#00BA88]"
              />

              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="Slug e.g. top-20"
                className="h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold outline-none focus:border-[#00BA88]"
              />

              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold outline-none focus:border-[#00BA88]"
              >
                <option value="market">Market</option>
                <option value="index">Index</option>
                <option value="specialty">Specialty</option>
              </select>

              <button
                onClick={() =>
                  setForm({
                    ...form,
                    is_active: Number(form.is_active) === 1 ? 0 : 1,
                  })
                }
                className="h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-black flex items-center justify-between"
              >
                <span>{Number(form.is_active) === 1 ? "Published" : "Draft"}</span>
                {Number(form.is_active) === 1 ? (
                  <ToggleRight className="text-[#00BA88]" />
                ) : (
                  <ToggleLeft className="text-slate-400" />
                )}
              </button>

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Short description"
                className="md:col-span-2 min-h-24 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium outline-none focus:border-[#00BA88] resize-none"
              />
            </div>

            <button
              onClick={handleSaveIndex}
              disabled={loading}
              className="mt-5 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#00BA88] text-white text-xs font-black disabled:opacity-50 hover:bg-[#00a377] transition"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {loading ? "Saving..." : "Save Index"}
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[24px] md:rounded-[28px] border border-slate-100 dark:border-slate-800 p-4 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-sm font-black">Cards In Index</h2>
                <p className="text-[11px] text-slate-400 font-bold mt-0.5">
                  Add canonical cards into this managed basket.
                </p>
              </div>

              <div className="relative w-full md:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  disabled={!selectedId}
                  placeholder={
                    selectedId ? "Search cards to add..." : "Save/select index first"
                  }
                  className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-bold outline-none focus:border-[#00BA88] disabled:opacity-50"
                />

                {searching && (
                  <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-slate-400" />
                )}
              </div>
            </div>

            {results.length > 0 && (
              <div className="mb-5 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden max-h-[320px] overflow-y-auto">
                {results.map((card) => (
                  <button
                    key={`${card.game}-${card.card_id}`}
                    onClick={() => handleAddCard(card)}
                    className="w-full p-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-950 text-left border-b last:border-b-0 border-slate-100 dark:border-slate-800"
                  >
                    <img
                      src={card.imageUrl || PLACEHOLDER_IMAGE}
                      alt={card.name || card.card_id}
                      className="w-8 h-11 object-cover rounded bg-slate-100 dark:bg-slate-800"
                    />

                    <div className="min-w-0">
                      <p className="text-sm font-black truncate">
                        {card.name || card.card_id}
                      </p>

                      <p className="text-[11px] text-slate-400 font-bold truncate">
                        {card.setName || card.set || "Unknown Set"} · {card.game || "unknown"} ·{" "}
                        {card.card_id}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
              {cardsLoading ? (
                <div className="p-8 text-center">
                  <Loader2 className="mx-auto text-slate-400 mb-3 animate-spin" />
                  <p className="text-sm font-bold text-slate-400">
                    Loading index cards...
                  </p>
                </div>
              ) : indexCards.length > 0 ? (
                indexCards.map((card) => (
                  <div
                    key={card.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b last:border-b-0 border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <img
                        src={card.imageUrl || PLACEHOLDER_IMAGE}
                        alt={card.name || card.card_id}
                        className="w-10 h-14 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0"
                      />

                      <div className="min-w-0">
                        <p className="text-sm font-black truncate">
                          {card.name || card.card_id}
                        </p>

                        <p className="text-[11px] text-slate-400 font-bold truncate">
                          {card.setName || card.set || "Unknown Set"} ·{" "}
                          {card.game || "unknown"}
                        </p>

                        <p className="text-[11px] text-slate-500 font-bold">
                          {card.grade} · Weight{" "}
                          {Number(card.weight || 1).toFixed(2)} · Sort{" "}
                          {card.sort_order}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveCard(card)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 p-2 rounded-xl bg-red-500/10 text-red-500 text-xs font-black"
                    >
                      <Trash2 size={15} />
                      <span className="sm:hidden">Remove Card</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <Layers className="mx-auto text-slate-400 mb-3" />
                  <p className="text-sm font-bold text-slate-400">
                    No cards added to this index yet.
                  </p>
                </div>
              )}
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
      `}</style>
    </div>
  );
}