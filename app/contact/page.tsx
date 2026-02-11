export default function ContactPage() {
  return (
    <section className="space-y-8">
      <header className="max-w-3xl">
        <h1 className="text-3xl">Contact FrezeDentare Pro</h1>
        <p className="mt-2 text-fg/70">Echipa noastră te ajută cu selecția produselor, comenzi și livrare.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-12">
        <article className="surface rounded-2xl p-6 lg:col-span-4">
          <h2 className="text-xl">Vânzări</h2>
          <p className="mt-3 text-sm">Telefon: +40 721 000 000</p>
          <p className="text-sm">Email: vanzari@frezedentare.ro</p>
          <p className="mt-3 text-sm text-fg/70">Asistență pentru selecție produse și oferte personalizate.</p>
        </article>

        <article className="surface rounded-2xl p-6 lg:col-span-4">
          <h2 className="text-xl">Suport tehnic</h2>
          <p className="mt-3 text-sm">Telefon: +40 721 000 010</p>
          <p className="text-sm">Email: suport@frezedentare.ro</p>
          <p className="mt-3 text-sm text-fg/70">Întrebări despre compatibilitate FG/RA/HP, ISO și aplicații clinice.</p>
        </article>

        <article className="surface rounded-2xl p-6 lg:col-span-4">
          <h2 className="text-xl">Livrare & logistică</h2>
          <p className="mt-3 text-sm">Telefon: +40 721 000 020</p>
          <p className="text-sm">Email: logistica@frezedentare.ro</p>
          <p className="mt-3 text-sm text-fg/70">Status comenzi, termene de livrare și retururi comerciale.</p>
        </article>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <article className="surface rounded-2xl p-6 lg:col-span-7">
          <h2 className="text-xl">Trimite un mesaj</h2>
          <form className="mt-4 grid gap-3 sm:grid-cols-2">
            <input className="rounded-xl border border-fg/15 px-3 py-2" placeholder="Nume și prenume" />
            <input className="rounded-xl border border-fg/15 px-3 py-2" placeholder="Telefon" />
            <input className="rounded-xl border border-fg/15 px-3 py-2 sm:col-span-2" placeholder="Email" />
            <textarea className="min-h-32 rounded-xl border border-fg/15 px-3 py-2 sm:col-span-2" placeholder="Spune-ne ce produse te interesează" />
            <button className="rounded-xl bg-primary px-4 py-2 text-white sm:col-span-2">Trimite solicitarea</button>
          </form>
        </article>

        <article className="surface rounded-2xl p-6 lg:col-span-5">
          <h2 className="text-xl">Program și adresă</h2>
          <p className="mt-3 text-sm">Luni – Vineri: 08:00 – 18:00</p>
          <p className="text-sm">Sâmbătă: 09:00 – 13:00</p>
          <p className="mt-3 text-sm">Bulevardul Independenței 12, București</p>
          <p className="mt-3 text-sm text-fg/70">Ridicare comenzi disponibilă cu confirmare telefonică în aceeași zi.</p>
        </article>
      </div>
    </section>
  );
}

