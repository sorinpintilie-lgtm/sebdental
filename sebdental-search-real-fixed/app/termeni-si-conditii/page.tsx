import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termeni și condiții",
  description: "Termeni și condiții pentru utilizarea platformei și procesarea comenzilor SebDental.",
  alternates: {
    canonical: "/termeni-si-conditii",
  },
};

export default function TermeniPage() {
  return (
    <section className="max-w-3xl space-y-3 text-sm">
      <h1 className="text-3xl">Termeni și condiții</h1>
      <p>Comenzile se procesează în ordinea confirmării, în limita stocului disponibil.</p>
    </section>
  );
}

