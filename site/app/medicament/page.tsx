"use client";
import { useState, useEffect } from "react";
import { ChevronDown, Pill, AlertTriangle, Clock, Thermometer, RefreshCw, Info, ShieldAlert } from "lucide-react";
import Link from "next/link";

const medicament = {
  nomCommercial: "Doliprane",
  nomGenerique: "Paracétamol",
  dosage: "1000 mg",
  laboratoire: "Sanofi",
  classeTherapeutique: "Antalgique / Antipyrétique",
  formes: ["Comprimé", "Effervescent", "Pédiatrique"],
  sections: [
    {
      id: "usage",
      icon: Info,
      color: "var(--med)",
      bg: "var(--med-light)",
      titre: "À quoi ça sert",
      contenu: "Le Doliprane est utilisé pour soulager les douleurs légères à modérées (maux de tête, douleurs dentaires, règles douloureuses) et pour faire baisser la fièvre. Il agit en bloquant les signaux de douleur dans le cerveau.",
    },
    {
      id: "posologie",
      icon: Clock,
      color: "#7c3aed",
      bg: "#ede9fe",
      titre: "Posologie",
      contenu: "Adultes et enfants > 15 ans : 1 comprimé de 1000 mg toutes les 6 à 8 heures. Ne pas dépasser 3 g par jour (3 prises). Espacer les prises d'au moins 4 heures. Prendre avec un verre d'eau, pendant ou en dehors des repas.",
    },
    {
      id: "contre",
      icon: ShieldAlert,
      color: "#dc2626",
      bg: "#fee2e2",
      titre: "Contre-indications",
      contenu: "Ne pas prendre si vous avez une allergie au paracétamol, une insuffisance hépatique sévère, ou une consommation d'alcool importante. Attention en cas de maladie du foie ou des reins. Interactions avec la warfarine (anticoagulant).",
    },
    {
      id: "effets",
      icon: AlertTriangle,
      color: "var(--warning)",
      bg: "#fef3c7",
      titre: "Effets secondaires",
      contenu: "Rares aux doses recommandées. Peuvent inclure : nausées, malaise, réactions allergiques cutanées (rash, démangeaisons). En cas de surdosage, risque d'atteinte hépatique grave — consultez immédiatement un médecin.",
    },
    {
      id: "conservation",
      icon: Thermometer,
      color: "#0891b2",
      bg: "#e0f2fe",
      titre: "Conservation",
      contenu: "Conserver à température ambiante (< 30°C), à l'abri de la lumière et de l'humidité. Tenir hors de portée des enfants. Vérifier la date de péremption avant utilisation. Ne pas utiliser après la date indiquée.",
    },
    {
      id: "generiques",
      icon: RefreshCw,
      color: "var(--plant)",
      bg: "var(--plant-light)",
      titre: "Équivalents génériques",
      contenu: "Paracétamol Biogaran 1000 mg, Paracétamol Mylan 1000 mg, Paracétamol Arrow 1000 mg, Paracétamol Teva 1000 mg. Même principe actif, même efficacité, prix souvent inférieur de 20 à 40%.",
    },
  ],
};

export default function MedicamentPage() {
  const [open, setOpen] = useState<string | null>("usage");
  const [result, setResult] = useState<{ nom: string; description: string; confiance: number } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("snapdiag_last_result");
      if (stored) {
        const r = JSON.parse(stored);
        if (r.type === "medicament") setResult(r);
      }
    } catch {}
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--muted)] mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-[var(--ink)] transition-colors">Accueil</Link>
        <span>/</span>
        <span className="text-[var(--ink)] font-medium">Médicament</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
        <div className="w-16 h-16 rounded-2xl bg-[var(--med-light)] flex items-center justify-center text-3xl shrink-0">
          💊
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-[var(--ink)]">
              {result?.nom ?? `${medicament.nomCommercial} ${medicament.dosage}`}
            </h1>
            <span className="bg-[var(--med-light)] text-[var(--med)] text-xs font-semibold px-3 py-1 rounded-full">
              {medicament.classeTherapeutique}
            </span>
          </div>
          <p className="text-[var(--muted)]">
            {result?.description ?? `${medicament.nomGenerique} · ${medicament.laboratoire}`}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {medicament.formes.map((f) => (
              <span key={f} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left: photo + infos générales */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
            <div className="bg-gradient-to-br from-[var(--med-light)] to-white h-52 flex items-center justify-center">
              <div className="text-8xl animate-float">💊</div>
            </div>
            <div className="p-5 space-y-3">
              <Row label="Nom générique" value={medicament.nomGenerique} />
              <Row label="Nom commercial" value={medicament.nomCommercial} />
              <Row label="Laboratoire" value={medicament.laboratoire} />
              <Row label="Dosage" value={medicament.dosage} />
              <Row label="Classe" value={medicament.classeTherapeutique} />
            </div>
          </div>

          {/* Quick tip */}
          <div className="bg-[var(--med-light)] rounded-2xl p-5 border border-blue-100">
            <div className="flex gap-3">
              <Pill size={18} className="text-[var(--med)] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-[var(--med-dark)] mb-1">Le saviez-vous ?</p>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  Le paracétamol est l&apos;antalgique le plus vendu en France. Il est sûr aux doses recommandées mais dangereux en cas de surdosage.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: accordion sections */}
        <div className="lg:col-span-3 space-y-3">
          {medicament.sections.map(({ id, icon: Icon, color, bg, titre, contenu }) => (
            <div
              key={id}
              className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden hover:border-gray-200 transition-colors"
            >
              <button
                className="w-full flex items-center gap-4 p-5 text-left"
                onClick={() => setOpen(open === id ? null : id)}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: bg }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
                <span className="font-semibold text-[var(--ink)] flex-1">{titre}</span>
                <ChevronDown
                  size={18}
                  className={`text-[var(--muted)] transition-transform duration-300 ${open === id ? "rotate-180" : ""}`}
                />
              </button>
              <div className={`accordion-content ${open === id ? "open" : ""}`}>
                <p className="px-5 pb-5 text-sm text-[var(--muted)] leading-relaxed border-t border-[var(--border)] pt-4 ml-[3.75rem]">
                  {contenu}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warning banner */}
      <div className="mt-10 flex items-start gap-4 bg-orange-50 border border-orange-200 rounded-2xl p-5">
        <AlertTriangle size={20} className="text-orange-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-orange-800 mb-1">Ce n&apos;est pas un avis médical</p>
          <p className="text-sm text-orange-700 leading-relaxed">
            Les informations fournies sont à titre indicatif uniquement. Consultez toujours un médecin ou pharmacien avant de prendre un médicament, surtout en cas de doute, de grossesse, ou de traitement en cours.
          </p>
          <div className="flex gap-3 mt-3">
            <a href="tel:15" className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
              🚑 Urgence : 15
            </a>
            <a href="#" className="text-xs bg-white border border-orange-300 text-orange-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
              Trouver une pharmacie
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-2 text-sm">
      <span className="text-[var(--muted)] shrink-0">{label}</span>
      <span className="text-[var(--ink)] font-medium text-right">{value}</span>
    </div>
  );
}
