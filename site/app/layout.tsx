import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "SnapDiag — Identifiez médicaments et plantes",
  description: "Photographiez n'importe quel médicament ou plante et obtenez instantanément une fiche complète grâce à l'IA.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[var(--border)] py-8 mt-16">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--muted)]">
            <div className="flex items-center gap-2">
              <span className="text-lg">💊🌿</span>
              <span className="font-semibold text-[var(--ink)]">SnapDiag</span>
            </div>
            <p>© 2026 SnapDiag · Cet outil ne remplace pas un médecin ou pharmacien.</p>
            <div className="flex gap-6">
              <a href="/recherche" className="hover:text-[var(--plant)] transition-colors">Recherche</a>
              <a href="/historique" className="hover:text-[var(--plant)] transition-colors">Historique</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
