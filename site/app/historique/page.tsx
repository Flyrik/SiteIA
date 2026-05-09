"use client";
import { useState, useEffect } from "react";
import { Pill, Leaf, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";

interface HistoryEntry {
  type: "plante" | "medicament";
  nom: string;
  description: string;
  confiance: number;
  date: string;
  image?: string;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return "À l'instant";
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
  if (diff < 86400 * 2) return "Hier";
  return d.toLocaleDateString("fr-FR");
}

export default function HistoriquePage() {
  const [tab, setTab] = useState<"plantes" | "medicaments">("plantes");
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("snapdiag_history");
      if (stored) setHistory(JSON.parse(stored));
    } catch {}
  }, []);

  const plantes = history.filter((e) => e.type === "plante");
  const medicaments = history.filter((e) => e.type === "medicament");

  const clearHistory = () => {
    if (!confirm("Supprimer tout l'historique ?")) return;
    localStorage.removeItem("snapdiag_history");
    localStorage.removeItem("snapdiag_last_result");
    setHistory([]);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--ink)] mb-2">Historique & Suivi</h1>
          <p className="text-[var(--muted)]">Retrouvez toutes vos analyses et suivez l&apos;évolution dans le temps.</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="shrink-0 flex items-center gap-2 text-sm text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl font-semibold transition-colors"
          >
            🗑️ Tout supprimer
          </button>
        )}
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Plantes analysées", value: plantes.length, color: "var(--plant)", bg: "var(--plant-light)", emoji: "🌿" },
          { label: "Médicaments scannés", value: medicaments.length, color: "var(--med)", bg: "var(--med-light)", emoji: "💊" },
          { label: "Analyses totales", value: history.length, color: "#7c3aed", bg: "#ede9fe", emoji: "📊" },
        ].map(({ label, value, color, bg, emoji }) => (
          <div key={label} className="bg-white rounded-2xl border border-[var(--border)] p-5">
            <div className="text-2xl mb-2">{emoji}</div>
            <div className="text-2xl font-bold" style={{ color }}>{value}</div>
            <div className="text-xs text-[var(--muted)] mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setTab("plantes")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            tab === "plantes"
              ? "bg-white shadow-sm text-[var(--plant)]"
              : "text-[var(--muted)] hover:text-[var(--ink)]"
          }`}
        >
          <Leaf size={15} />
          Mes plantes
        </button>
        <button
          onClick={() => setTab("medicaments")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            tab === "medicaments"
              ? "bg-white shadow-sm text-[var(--med)]"
              : "text-[var(--muted)] hover:text-[var(--ink)]"
          }`}
        >
          <Pill size={15} />
          Mon armoire à pharmacie
        </button>
      </div>

      {/* Plantes list */}
      {tab === "plantes" && (
        <div className="animate-scale-in">
          {plantes.length === 0 ? (
            <div className="text-center py-16 text-[var(--muted)]">
              <div className="text-5xl mb-4">🌿</div>
              <p className="font-semibold text-[var(--ink)] mb-1">Aucune plante analysée</p>
              <p className="text-sm">Prenez une photo depuis l&apos;accueil pour commencer.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {plantes.map((p, i) => (
                <div key={i} className="bg-white rounded-2xl border border-[var(--border)] p-5 flex items-center gap-4 hover:shadow-sm transition-all">
                  <div className="w-12 h-12 rounded-xl bg-[var(--plant-light)] flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                    {p.image ? <img src={p.image} alt={p.nom} className="w-full h-full object-cover" /> : "🌿"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--ink)] text-sm truncate">{p.nom}</h3>
                    <p className="text-xs text-[var(--muted)] line-clamp-1">{p.description}</p>
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-[var(--muted)]">
                      <Calendar size={10} /> {formatDate(p.date)}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-sm font-bold text-[var(--plant)]">{Math.round(p.confiance * 100)}%</div>
                    <div className="text-xs text-[var(--muted)]">confiance</div>
                    <Link href="/plante" className="flex items-center gap-1 text-xs font-semibold text-[var(--plant)] mt-1 hover:underline">
                      Fiche <ChevronRight size={11} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Médicaments list */}
      {tab === "medicaments" && (
        <div className="animate-scale-in">
          {medicaments.length === 0 ? (
            <div className="text-center py-16 text-[var(--muted)]">
              <div className="text-5xl mb-4">💊</div>
              <p className="font-semibold text-[var(--ink)] mb-1">Aucun médicament scanné</p>
              <p className="text-sm">Prenez une photo depuis l&apos;accueil pour commencer.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {medicaments.map((m, i) => (
                <div key={i} className="bg-white rounded-2xl border border-[var(--border)] p-5 flex items-center gap-4 hover:shadow-sm transition-all">
                  <div className="w-12 h-12 rounded-xl bg-[var(--med-light)] flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                    {m.image ? <img src={m.image} alt={m.nom} className="w-full h-full object-cover" /> : "💊"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--ink)] text-sm truncate">{m.nom}</h3>
                    <p className="text-xs text-[var(--muted)] line-clamp-1">{m.description}</p>
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-[var(--muted)]">
                      <Calendar size={10} /> {formatDate(m.date)}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-sm font-bold text-[var(--med)]">{Math.round(m.confiance * 100)}%</div>
                    <div className="text-xs text-[var(--muted)]">confiance</div>
                    <Link href="/medicament" className="flex items-center gap-1 text-xs font-semibold text-[var(--med)] mt-1 hover:underline">
                      Fiche <ChevronRight size={11} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
