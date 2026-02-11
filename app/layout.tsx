import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Sora } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SearchPalette } from "@/components/SearchPalette";
import { CartDrawer } from "@/components/CartDrawer";
import { CompareBar } from "@/components/CompareBar";
import { ScrollProgress } from "@/components/ScrollProgress";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "sebdental",
  description: "Soluție practică pentru comenzi rapide de freze dentare.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <TooltipProvider>
          <div className="sticky top-0 z-[100] border-b border-black/15 bg-[#F2B94B] pt-[env(safe-area-inset-top)] text-[#1F2933]">
            <div className="mx-auto grid h-[var(--promo-height)] w-full max-w-[1280px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 text-xs md:hidden">
              <span className="truncate">Instrumentar dentar profesional</span>
              <span className="whitespace-nowrap text-center">Dezvoltat de sky.ro</span>
              <a href="tel:+40720088880" className="justify-self-end whitespace-nowrap text-right underline decoration-black/40 underline-offset-2">
                +4 0720 088 880
              </a>
            </div>
            <div className="mx-auto hidden h-[var(--promo-height)] w-full max-w-[1280px] items-center justify-between gap-3 px-4 text-sm md:flex md:px-8">
              <p className="whitespace-nowrap">
                Instrumentar dentar profesional • Portofoliu clinic actualizat • Dezvoltat de sky.ro • {" "}
                <a href="mailto:dan.trifan@sky.ro" className="underline decoration-black/40 underline-offset-2">dan.trifan@sky.ro</a> • {" "}
                <a href="tel:+40720088880" className="underline decoration-black/40 underline-offset-2">+4 0720 088 880</a>
              </p>
              <a
                href="mailto:dan.trifan@sky.ro"
                className="rounded-md bg-[#2F80ED] px-3 py-1.5 text-xs text-white transition hover:bg-[#246fd2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#246fd2]/45"
              >
                Contact rapid
              </a>
            </div>
          </div>
          <ScrollProgress />
          <SearchPalette />
          <Header />
          <main className="mx-auto min-h-[calc(100vh-8rem)] w-full max-w-[1280px] px-4 py-8 md:px-8">{children}</main>
          <Footer />
          <CartDrawer />
          <CompareBar />
        </TooltipProvider>
      </body>
    </html>
  );
}
