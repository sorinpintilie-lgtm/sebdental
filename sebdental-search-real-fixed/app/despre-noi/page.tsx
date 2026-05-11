import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Despre SebDental",
  description: "SebDental ajută cabinetele și laboratoarele să comande freze dentare corecte, rapid și fără ambiguități.",
  alternates: {
    canonical: "/despre-noi",
  },
};

export default function DespreNoiPage() {
  return (
    <section className="max-w-3xl space-y-4">
      <h1 className="text-3xl">Despre noi</h1>
      <p className="text-fg/75">Ajutăm cabinetele să comande freze corecte, rapid și fără ambiguități.</p>
    </section>
  );
}

