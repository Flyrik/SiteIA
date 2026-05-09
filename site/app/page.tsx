"use client";
import { useState } from "react";
import { Upload, Loader2, ChevronRight, Sparkles, AlertCircle, Pill, Leaf, X } from "lucide-react";
import Link from "next/link";

interface AnalysisResult {
  type: "medicament" | "plante";
  nom: string;
  description: string;
  confiance: number;
}

function AnalyzeZone({ mode }: { mode: "medicament" | "plante" }) {
  const isMed = mode === "medicament";
  const color = isMed ? "var(--med)" : "var(--plant)";
  const colorLight = isMed ? "var(--med-light)" : "var(--plant-light)";

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setResult(null);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const reset = () => {
    setPreview(null);
    setFile(null);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("hint", mode);
      const res = await fetch("/api/analyze", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Erreur lors de l'analyse");
      setResult(data);
      try {
        const entry = { type: mode, nom: data.nom, description: data.description, confiance: data.confiance, date: new Date().toISOString(), image: preview };
        localStorage.setItem("snapdiag_last_result", JSON.stringify(entry));
        const prev = JSON.parse(localStorage.getItem("snapdiag_history") || "[]");
        localStorage.setItem("snapdiag_history", JSON.stringify([entry, ...prev].slice(0, 50)));
      } catch {}
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 rounded-3xl border-2 transition-all" style={{ borderColor: colorLight, background: "white" }}>

      {/* Header */}
      <div className="px-6 pt-6 pb-4 rounded-t-3xl" style={{ background: colorLight }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color }}>
            {isMed ? <Pill size={18} className="text-white" /> : <Leaf size={18} className="text-white" />}
          </div>
          <div>
            <h2 className="font-bold text-[var(--ink)]" style={{ fontFamily: "'Playfair Display', serif" }}>
              {isMed ? "Médicament" : "Plante"}
            </h2>
            <p className="text-xs text-[var(--muted)]">
              {isMed ? "Boîte, blister, comprimé…" : "Espèce, état de santé…"}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">

        {/* Preview */}
        {preview && (
          <div className="relative rounded-2xl overflow-hidden border" style={{ borderColor: colorLight }}>
            <img src={preview} alt="preview" className="w-full object-contain" style={{ maxHeight: 200 }} />
            <button
              onClick={reset}
              className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X size={14} />
            </button>
            <p className="text-xs text-center text-[var(--muted)] py-2 bg-white">{file?.name}</p>
          </div>
        )}

        {/* Zone upload */}
        {!preview && (
          <label
            className="block rounded-2xl p-6 text-center cursor-pointer"
            style={{ border: `2px dashed ${color}`, background: `${colorLight}55` }}
          >
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
            <Upload size={28} style={{ color, margin: "0 auto 10px" }} />
            <p className="text-sm font-semibold text-[var(--ink)] mb-1">Cliquez pour choisir une photo</p>
            <p className="text-xs text-[var(--muted)] mb-4">ou glissez-déposez votre image ici</p>
            <span
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white pointer-events-none"
              style={{ background: color }}
            >
              <Upload size={14} />
              Choisir une photo
            </span>
          </label>
        )}

        {/* Bouton analyser */}
        {preview && (
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 text-white py-3.5 rounded-xl text-sm font-semibold disabled:opacity-60 transition-all border-0"
            style={{ background: color }}
          >
            {loading
              ? <><Loader2 size={15} className="animate-spin" /> Analyse en cours…</>
              : <><Sparkles size={15} /> Analyser avec l&apos;IA</>
            }
          </button>
        )}

        {/* Erreur */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            <AlertCircle size={15} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Résultat */}
        {result && (
          <div className="p-4 rounded-2xl border" style={{ background: colorLight, borderColor: isMed ? "#bfdbfe" : "#a7f3d0" }}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{isMed ? "💊" : "🌿"}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-0.5">
                  {isMed ? "Médicament identifié" : "Plante identifiée"}
                </p>
                <h3 className="font-bold text-[var(--ink)]">{result.nom}</h3>
                <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">{result.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-14 h-1.5 bg-white rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${result.confiance * 100}%`, background: color }} />
                  </div>
                  <span className="text-xs text-[var(--muted)]">{Math.round(result.confiance * 100)}%</span>
                </div>
              </div>
            </div>
            <Link
              href={`/${mode}`}
              className="mt-3 flex items-center justify-center gap-1.5 text-sm font-semibold py-2 rounded-lg text-white"
              style={{ background: color }}
            >
              Voir la fiche complète <ChevronRight size={13} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="max-w-5xl mx-auto px-6 pt-14 pb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-[var(--plant-light)] text-[var(--plant-dark)] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
          <Sparkles size={12} />
          Propulsé par Gemini Vision IA
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--ink)] leading-tight mb-4">
          Identifiez instantanément<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--plant)] to-[var(--med)]">
            médicaments &amp; plantes
          </span>
        </h1>
        <p className="text-base text-[var(--muted)] max-w-lg mx-auto">
          Prenez une photo et obtenez une fiche complète en quelques secondes.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="flex flex-col md:flex-row gap-6">
          <AnalyzeZone mode="medicament" />
          <AnalyzeZone mode="plante" />
        </div>
      </section>
    </div>
  );
}
