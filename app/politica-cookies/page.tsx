import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de cookies",
  description: "Informații privind utilizarea cookie-urilor pe platforma SebDental.",
  alternates: {
    canonical: "/politica-cookies",
  },
};

export default function CookiesPage() {
  return (
    <section className="max-w-3xl space-y-3 text-sm">
      <h1 className="text-3xl">Politica de cookies</h1>
      <p>Acest site poate folosi cookie-uri și tehnologii similare pentru funcționarea corectă a paginilor, îmbunătățirea experienței de navigare și, dacă este cazul, pentru analiză sau marketing.</p>
      <h2>Ce sunt cookie-urile</h2>
      <p>Cookie-urile sunt fișiere de mici dimensiuni salvate în browserul utilizatorului atunci când acesta accesează un site. Acestea pot permite recunoașterea browserului, păstrarea unor preferințe sau funcționarea anumitor elemente ale site-ului.</p>
      <h2>Tipuri de cookie-uri folosite</h2>
      <p>Site-ul poate folosi:</p>
      <ul>
        <li>cookie-uri necesare, esențiale pentru funcționarea site-ului, coșului de cumpărături, formularelor sau securității;</li>
        <li>cookie-uri funcționale, care ajută la păstrarea preferințelor utilizatorului;</li>
        <li>cookie-uri de analiză, dacă vor fi integrate instrumente de măsurare a traficului;</li>
        <li>cookie-uri de marketing, dacă vor fi integrate instrumente de promovare sau remarketing.</li>
      </ul>
      <h2>Cookie-uri pentru coș și comandă</h2>
      <p>Pentru funcționarea magazinului online, site-ul poate folosi cookie-uri necesare pentru păstrarea produselor adăugate în coș, finalizarea comenzii și asigurarea unei experiențe corecte de cumpărare.</p>
      <h2>Cookie-uri de analiză și marketing</h2>
      <p>TODO – instrumentele de analiză și marketing vor fi completate ulterior, dacă vor fi folosite.</p>
      <p>Exemple posibile:</p>
      <ul>
        <li>Google Analytics;</li>
        <li>Google Ads;</li>
        <li>Meta Pixel;</li>
        <li>alte instrumente similare.</li>
      </ul>
      <h2>Controlul cookie-urilor</h2>
      <p>Utilizatorul poate controla, bloca sau șterge cookie-urile din setările browserului folosit.</p>
      <p>Dezactivarea cookie-urilor necesare poate afecta funcționarea corectă a site-ului, inclusiv coșul de cumpărături, formularele sau alte funcții tehnice.</p>
      <h2>Actualizări</h2>
      <p>Dacă ulterior vor fi adăugate instrumente noi de analiză, marketing sau servicii externe care folosesc cookie-uri, această politică va fi actualizată corespunzător.</p>
    </section>
  );
}