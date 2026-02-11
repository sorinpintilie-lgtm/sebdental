export default function ContPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl">Contul meu</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="surface rounded-2xl p-5"><p className="font-medium">Comenzi</p><p className="mt-2 text-sm text-fg/70">Istoric și reordonare în 1 click.</p></div>
        <div className="surface rounded-2xl p-5"><p className="font-medium">Liste</p><p className="mt-2 text-sm text-fg/70">Tăvile salvate pe aplicații și cabinete.</p></div>
        <div className="surface rounded-2xl p-5"><p className="font-medium">Adrese</p><p className="mt-2 text-sm text-fg/70">Date de livrare și facturare.</p></div>
      </div>
    </section>
  );
}

