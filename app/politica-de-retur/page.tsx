import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de retur",
  description: "Condițiile de retur pentru produsele comandate din platforma SebDental.",
  alternates: {
    canonical: "/politica-de-retur",
  },
};

export default function ReturPage() {
  return (
    <section className="max-w-3xl space-y-3 text-sm">
      <h1 className="text-3xl">Politica de retur</h1>
      <h2>Dreptul de retragere</h2>
      <p>Consumatorii au dreptul de a se retrage dintr-un contract încheiat la distanță, fără a preciza motivul, în termen de 14 zile calendaristice de la data la care intră în posesia fizică a produselor.</p>
      <p>Pentru exercitarea dreptului de retragere, clientul trebuie să transmită o notificare scrisă către:</p>
      <p>SEBDENTAL STORE S.R.L.<br />
      Email: contact@sebdentalstore.ro<br />
      Telefon: 0737 523 888</p>
      <p>Notificarea trebuie să includă numele clientului, numărul comenzii, produsul sau produsele returnate și datele de contact.</p>
      <h2>Condiții de retur</h2>
      <p>Produsele trebuie returnate în aceeași stare în care au fost primite, fără urme de utilizare, deteriorare sau intervenții asupra lor, împreună cu ambalajul original, accesoriile, documentele și etichetele aferente, acolo unde este cazul.</p>
      <p>Clientul este responsabil pentru diminuarea valorii produselor rezultată din manipularea acestora într-un mod diferit de cel necesar pentru determinarea naturii, caracteristicelor și funcționării produselor.</p>
      <h2>Excepții de la retur</h2>
      <p>Din motive de protecție a sănătății și igienă, anumite produse sigilate nu pot fi returnate dacă au fost desigilate după livrare.</p>
      <p>Pot fi exceptate de la retur, conform legislației aplicabile:</p>
      <ul>
        <li>produse sigilate care nu pot fi returnate din motive de igienă sau protecție a sănătății, dacă au fost desigilate;</li>
        <li>produse realizate sau comandate special după specificațiile clientului;</li>
        <li>produse deteriorate, incomplete sau utilizate necorespunzător;</li>
        <li>produse care nu mai pot fi revândute din motive obiective legate de natura lor.</li>
      </ul>
      <h2>Costuri de retur</h2>
      <p>Costul transportului pentru retur este suportat de client, cu excepția cazului în care produsul livrat este greșit, deteriorat sau neconform din culpa comerciantului.</p>
      <p>TODO – costurile exacte, curierul și procedura de retur vor fi completate ulterior.</p>
      <h2>Adresa de retur</h2>
      <p>TODO – adresa exactă pentru retur va fi completată ulterior.</p>
      <p>Dacă adresa de retur va fi aceeași cu sediul social, aceasta va fi:</p>
      <p>SEBDENTAL STORE S.R.L.<br />
      Str. Liviu Rebreanu, nr. 51, camera 1, Sat Dumbrăvița, Com. Dumbrăvița, Jud. Timiș, România</p>
      <h2>Rambursarea sumelor</h2>
      <p>După primirea și verificarea produselor returnate, rambursarea sumelor eligibile se va face în termenul legal aplicabil, folosind aceeași metodă de plată sau o altă metodă agreată cu clientul.</p>
      <p>Ne rezervăm dreptul de a amâna rambursarea până la primirea produselor returnate sau până la prezentarea unei dovezi clare privind expedierea acestora.</p>
      <h2>Produse neconforme sau deteriorate</h2>
      <p>Dacă produsul primit este deteriorat, greșit sau neconform, clientul trebuie să ne contacteze cât mai curând posibil, transmițând detalii despre comandă, produs și, dacă este cazul, fotografii relevante.</p>
      <p>Solicitările vor fi analizate individual, iar soluția va fi comunicată clientului în funcție de situația constatată.</p>
    </section>
  );
}

