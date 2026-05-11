import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-fg/10">
      <div className="mx-auto grid w-full max-w-[1280px] gap-6 px-4 py-10 text-sm md:grid-cols-4 md:px-8">
        <div>
          <p className="font-semibold">FrezeDentare Pro</p>
          <p className="mt-2 text-fg/65">Program: L–V 08:00–18:00</p>
        </div>
        <div>
          <p className="font-semibold">Contact</p>
          <p className="mt-2 text-fg/65">+40 721 000 000</p>
          <p className="text-fg/65">contact@frezedentare.ro</p>
        </div>
        <div className="space-y-2">
          <Link href="/politica-de-retur">Livrare și retur</Link>
          <br />
          <Link href="/gdpr">GDPR</Link>
          <br />
          <Link href="/termeni-si-conditii">Termeni și condiții</Link>
        </div>
        <div className="text-fg/65">Soluție practică pentru reordonare rapidă în cabinet.</div>
      </div>
    </footer>
  );
}

