"use client";
import { useState } from "react";
import { Search, Pill, Leaf, ChevronRight, X } from "lucide-react";
import Link from "next/link";

const suggestions = ["Doliprane", "Ibuprofène", "Monstera", "Pothos", "Paracétamol", "Aspégic"];

const allResults = [
  { id: 1, type: "medicament", emoji: "💊", nom: "Doliprane 1000 mg", desc: "Antalgique et antipyrétique à base de paracétamol. Soulage douleurs et fièvre.", tags: ["douleur", "fièvre", "tête"] },
  { id: 2, type: "medicament", emoji: "💊", nom: "Ibuprofène 400 mg", desc: "Anti-inflammatoire non stéroïdien. Efficace contre douleurs, inflammations et fièvre.", tags: ["inflammation", "douleur", "fièvre"] },
  { id: 3, type: "medicament", emoji: "💊", nom: "Aspirine 500 mg", desc: "Antalgique, antipyrétique et anti-inflammatoire classique.", tags: ["douleur", "fièvre", "cœur"] },
  { id: 4, type: "medicament", emoji: "💊", nom: "Smecta", desc: "Traitement des diarrhées aiguës et chroniques. Protège la muqueuse intestinale.", tags: ["diarrhée", "intestin", "ventre"] },
  { id: 5, type: "plante", emoji: "🌿", nom: "Monstera deliciosa", desc: "Plante tropicale aux grandes feuilles découpées. Facile d'entretien en intérieur.", tags: ["intérieur", "tropical", "décorative"] },
  { id: 6, type: "plante", emoji: "🍃", nom: "Pothos doré", desc: "Plante grimpante très résistante. Parfaite pour débutants, supporte l'ombre.", tags: ["facile", "intérieur", "grimpante"] },
  { id: 7, type: "plante", emoji: "🌵", nom: "Cactus barrel", desc: "Cactus sphérique du désert. Nécessite très peu d'eau, idéal pour les oublieux.", tags: ["désert", "facile", "sec"] },
  { id: 8, type: "plante", emoji: "🌸", nom: "Orchidée Phalaenopsis", desc: "Orchidée élégante aux longues tiges fleuries. Lumière indirecte et peu d'eau.", tags: ["fleur", "élégante", "intérieur"] },
];

type Filter = "all" | "medicament" | "plante";

export default function RecherchePage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = allResults.filter((r) => {
    const matchFilter = filter === "all" || r.type === filter;
    const q = query.toLowerCase();
    const matchQuery = !q
      || r.nom.toLowerCase().includes(q)
      || r.desc.toLowerCase().includes(q)
      || r.tags.some((t) => t.includes(q));
    return matchFilter && matchQuery;
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--ink)] mb-2">Recherche</h1>
        <p className="text-[var(--muted)]">Recherchez un médicament par symptôme, ou une plante par problème.</p>
      </div>

      {/* Search field */}
      <div className="relative mb-4">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ex: mal de tête, taches noires sur feuilles, Doliprane..."
          className="w-full pl-12 pr-12 py-4 bg-white border border-[var(--border)] rounded-2xl text-[var(--ink)] placeholder:text-gray-400 focus:outline-none focus:border-[var(--plant)] focus:ring-2 focus:ring-[var(--plant)]/20 transition-all text-sm shadow-sm"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--ink)] transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Suggestions rapides */}
      {!query && (
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-xs text-[var(--muted)] self-center">Suggestions :</span>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setQuery(s)}
              className="text-xs bg-white border border-[var(--border)] text-[var(--ink)] px-3 py-1.5 rounded-full hover:border-[var(--plant)] hover:text-[var(--plant)] transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {([["all", "Tout"], ["medicament", "Médicaments"], ["plante", "Plantes"]] as [Filter, string][]).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === val
                ? val === "medicament"
                  ? "bg-[var(--med)] text-white"
                  : val === "plante"
                  ? "bg-[var(--plant)] text-white"
                  : "bg-[var(--ink)] text-white"
                : "bg-white border border-[var(--border)] text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            {val === "medicament" && <Pill size={13} />}
            {val === "plante" && <Leaf size={13} />}
            {label}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[var(--muted)]">
            <Search size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">Aucun résultat pour &quot;{query}&quot;</p>
            <p className="text-sm mt-1">Essayez d&apos;autres mots clés ou prenez une photo pour une identification précise.</p>
            <Link href="/" className="inline-flex items-center gap-1.5 mt-4 text-sm text-[var(--plant)] font-semibold hover:underline">
              Analyser une photo <ChevronRight size={13} />
            </Link>
          </div>
        ) : (
          filtered.map((r) => (
            <Link
              key={r.id}
              href={`/${r.type}`}
              className="flex items-start gap-4 bg-white rounded-2xl border border-[var(--border)] p-5 hover:shadow-md hover:border-transparent transition-all group"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform ${
                  r.type === "medicament" ? "bg-[var(--med-light)]" : "bg-[var(--plant-light)]"
                }`}
              >
                {r.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-[var(--ink)]">{r.nom}</h3>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: r.type === "medicament" ? "var(--med-light)" : "var(--plant-light)",
                      color: r.type === "medicament" ? "var(--med)" : "var(--plant)",
                    }}
                  >
                    {r.type === "medicament" ? "Médicament" : "Plante"}
                  </span>
                </div>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{r.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {r.tags.map((t) => (
                    <span key={t} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
              <ChevronRight size={16} className="text-[var(--muted)] shrink-0 mt-1 group-hover:text-[var(--plant)] transition-colors" />
            </Link>
          ))
        )}
      </div>

      {filtered.length > 0 && (
        <p className="text-xs text-center text-[var(--muted)] mt-6">
          {filtered.length} résultat{filtered.length > 1 ? "s" : ""} · Données à titre indicatif
        </p>
      )}
    </div>
  );
}
