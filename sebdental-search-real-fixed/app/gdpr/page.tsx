import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GDPR",
  description: "Informații privind prelucrarea datelor personale în platforma SebDental.",
  alternates: {
    canonical: "/gdpr",
  },
};

export default function GdprPage() {
  return (
    <section className="max-w-3xl space-y-3 text-sm">
      <h1 className="text-3xl">GDPR</h1>
      <p>Datele personale sunt prelucrate exclusiv pentru procesarea comenzilor, livrare și suport clienți.</p>
    </section>
  );
}

