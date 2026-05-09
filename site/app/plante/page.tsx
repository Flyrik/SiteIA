"use client";
import { useState, useEffect } from "react";
import { Droplets, Sun, Thermometer, Wind, AlertCircle, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

const plante = {
  nom: "Monstera deliciosa",
  nomCommun: "Plante Monstera",
  etat: "stresse" as "saine" | "stresse" | "malade",
  scoresSante: 72,
  observations: [
    { type: "warning", texte: "Légère décoloration jaune sur les feuilles inférieures" },
    { type: "warning", texte: "Bords des feuilles légèrement bruns (environ 15%)" },
    { type: "ok", texte: "Tiges fermes et en bonne santé" },
    { type: "ok", texte: "Pas de parasites visibles" },
    { type: "ok", texte: "Nouvelles feuilles en développement" },
  ],
  causes: [
    { label: "Carence en fer (principale)", prob: 75, color: "var(--warning)" },
    { label: "Excès d'arrosage", prob: 45, color: "#3b82f6" },
    { label: "Manque de luminosité", prob: 30, color: "#f59e0b" },
  ],
  planSoin: [
    { jour: "Aujourd'hui", actions: ["Réduire l'arrosage de 50%", "Ajouter de l'engrais ferrique dilué à l'eau", "Retirer les feuilles jaunes abîmées"], done: false },
    { jour: "Dans 1 semaine", actions: ["Vérifier le niveau d'humidité du sol", "Déplacer vers une meilleure lumière indirecte", "Observer l'évolution des nouvelles feuilles"], done: false },
    { jour: "Dans 1 mois", actions: ["Rempotage si les racines sortent du pot", "Deuxième apport en engrais ferrique", "Photo de suivi pour comparaison"], done: false },
  ],
  profil: {
    arrosage: "1×/semaine",
    lumiere: "Lumière indirecte vive",
    temperature: "18–27°C",
    humidite: "60–80%",
  },
};

const etatConfig = {
  saine: { label: "Saine", color: "var(--plant)", bg: "var(--plant-light)", icon: "✅" },
  stresse: { label: "Stressée", color: "var(--warning)", bg: "#fef3c7", icon: "⚠️" },
  malade: { label: "Malade", color: "#dc2626", bg: "#fee2e2", icon: "🚨" },
};

export default function PlantePage() {
  const [activeStep, setActiveStep] = useState<number | null>(0);
  const [result, setResult] = useState<{ nom: string; description: string; confiance: number; image?: string } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("snapdiag_last_result");
      if (stored) {
        const r = JSON.parse(stored);
        if (r.type === "plante") setResult(r);
      }
    } catch {}
  }, []);

  const nom = result?.nom ?? plante.nom;
  const etat = etatConfig[plante.etat];

  // SVG circle progress
  const r = 38;
  const circ = 2 * Math.PI * r;
  const offset = circ - (plante.scoresSante / 100) * circ;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-[var(--muted)] mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-[var(--ink)] transition-colors">Accueil</Link>
        <span>/</span>
        <span className="text-[var(--ink)] font-medium">Plante</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
        <div className="w-16 h-16 rounded-2xl bg-[var(--plant-light)] flex items-center justify-center text-3xl shrink-0">
          🌿
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-[var(--ink)]">{nom}</h1>
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: etat.bg, color: etat.color }}
            >
              {etat.icon} {etat.label}
            </span>
          </div>
          <p className="text-[var(--muted)]">{result?.description ?? plante.nomCommun}</p>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left */}
        <div className="lg:col-span-2 space-y-5">
          {/* Photo + score */}
          <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
            <div className="bg-gradient-to-br from-[var(--plant-light)] to-white h-52 flex items-center justify-center relative">
              <div className="text-8xl animate-float">🌿</div>
              {/* Health score circle */}
              <div className="absolute bottom-4 right-4 bg-white rounded-xl p-3 shadow-sm">
                <svg width="90" height="90" viewBox="0 0 90 90">
                  <circle cx="45" cy="45" r={r} fill="none" stroke="#f1f5f9" strokeWidth="8" />
                  <circle
                    cx="45" cy="45" r={r}
                    fill="none"
                    stroke={etat.color}
                    strokeWidth="8"
                    strokeDasharray={circ}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="health-ring"
                    style={{ transition: "stroke-dashoffset 1s ease" }}
                  />
                  <text x="45" y="45" textAnchor="middle" dominantBaseline="middle" fontSize="18" fontWeight="bold" fill={etat.color}>
                    {plante.scoresSante}
                  </text>
                  <text x="45" y="60" textAnchor="middle" fontSize="9" fill="#94a3b8">
                    /100
                  </text>
                </svg>
                <p className="text-xs text-center text-[var(--muted)] mt-1">Score santé</p>
              </div>
            </div>

            {/* Observations */}
            <div className="p-5">
              <h3 className="font-semibold text-[var(--ink)] mb-3 text-sm uppercase tracking-wide">Observations visuelles</h3>
              <ul className="space-y-2">
                {plante.observations.map((obs, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    {obs.type === "ok"
                      ? <CheckCircle size={15} className="text-[var(--plant)] shrink-0 mt-0.5" />
                      : <AlertCircle size={15} className="text-orange-400 shrink-0 mt-0.5" />
                    }
                    <span className={obs.type === "ok" ? "text-[var(--muted)]" : "text-[var(--ink)]"}>
                      {obs.texte}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Profil entretien */}
          <div className="bg-white rounded-2xl border border-[var(--border)] p-5">
            <h3 className="font-semibold text-[var(--ink)] mb-4 text-sm uppercase tracking-wide">Profil d&apos;entretien</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Droplets, label: "Arrosage", value: plante.profil.arrosage, color: "#3b82f6", bg: "#dbeafe" },
                { icon: Sun, label: "Lumière", value: plante.profil.lumiere, color: "#f59e0b", bg: "#fef3c7" },
                { icon: Thermometer, label: "Température", value: plante.profil.temperature, color: "#dc2626", bg: "#fee2e2" },
                { icon: Wind, label: "Humidité", value: plante.profil.humidite, color: "#0891b2", bg: "#e0f2fe" },
              ].map(({ icon: Icon, label, value, color, bg }) => (
                <div key={label} className="rounded-xl p-3" style={{ background: bg }}>
                  <Icon size={16} className="mb-1" style={{ color }} />
                  <p className="text-xs text-[var(--muted)]">{label}</p>
                  <p className="text-sm font-semibold" style={{ color }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-3 space-y-5">
          {/* Causes probables */}
          <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
            <h2 className="font-bold text-[var(--ink)] mb-4">Causes probables</h2>
            <div className="space-y-4">
              {plante.causes.map(({ label, prob, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-[var(--ink)] font-medium">{label}</span>
                    <span className="font-semibold" style={{ color }}>{prob}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${prob}%`, background: color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plan de soin */}
          <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
            <h2 className="font-bold text-[var(--ink)] mb-4">Plan de soin</h2>
            <div className="space-y-3">
              {plante.planSoin.map(({ jour, actions }, i) => (
                <div
                  key={i}
                  className={`rounded-xl border cursor-pointer transition-all duration-200 ${
                    activeStep === i
                      ? "border-[var(--plant)] bg-[var(--plant-light)]"
                      : "border-[var(--border)] hover:border-gray-300"
                  }`}
                  onClick={() => setActiveStep(activeStep === i ? null : i)}
                >
                  <div className="flex items-center gap-3 p-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                        activeStep === i ? "bg-[var(--plant)] text-white" : "bg-gray-100 text-[var(--muted)]"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Clock size={13} className="text-[var(--muted)]" />
                        <span className="text-sm font-semibold text-[var(--ink)]">{jour}</span>
                      </div>
                    </div>
                  </div>
                  {activeStep === i && (
                    <ul className="px-4 pb-4 space-y-2 border-t border-emerald-200 pt-3 ml-11">
                      {actions.map((a, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-[var(--plant-dark)]">
                          <span className="text-[var(--plant)] mt-0.5">→</span>
                          {a}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
