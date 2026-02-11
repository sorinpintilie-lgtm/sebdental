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
  title: "FrezeDentare Pro",
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
