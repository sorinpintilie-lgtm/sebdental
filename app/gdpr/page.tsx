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
      <h1 className="text-3xl">Politica de confidențialitate</h1>
      <h2>Operatorul de date</h2>
      <p>Operatorul datelor personale colectate prin intermediul acestui site este:</p>
      <p>SEBDENTAL STORE S.R.L.<br />
      CUI: RO4529355<br />
      Nr. Reg. Com.: J2022000302353<br />
      Sediu social: Str. Liviu Rebreanu, nr. 51, camera 1, Sat Dumbrăvița, Com. Dumbrăvița, Jud. Timiș, România<br />
      Email: contact@sebdentalstore.ro<br />
      Telefon: 0737 523 888</p>
      <p>Pentru orice solicitare privind prelucrarea datelor personale, ne puteți contacta folosind datele de mai sus.</p>
      <h2>Ce date colectăm</h2>
      <p>Datele personale pot fi colectate atunci când utilizatorul navighează pe site, completează un formular, creează un cont, transmite o solicitare, plasează o comandă sau comunică direct cu noi.</p>
      <p>Datele colectate pot include:</p>
      <ul>
        <li>nume și prenume;</li>
        <li>adresă de email;</li>
        <li>număr de telefon;</li>
        <li>adresă de facturare;</li>
        <li>adresă de livrare;</li>
        <li>date despre companie, dacă este cazul;</li>
        <li>CUI sau alte date fiscale, dacă sunt necesare pentru facturare;</li>
        <li>produse comandate sau solicitate;</li>
        <li>conținutul mesajelor transmise;</li>
        <li>date tehnice, precum adresa IP, tipul browserului, dispozitivul folosit și informații generate de server.</li>
      </ul>
      <p>Dacă site-ul integrează plată online cu cardul, datele de plată sunt procesate de furnizorul autorizat al serviciului de plată. SEBDENTAL STORE S.R.L. nu stochează datele cardului bancar.</p>
      <p>TODO – procesatorul de plată online va fi completat ulterior, dacă va fi cazul.</p>
      <h2>Scopul prelucrării datelor</h2>
      <p>Datele personale sunt folosite pentru:</p>
      <ul>
        <li>preluarea și procesarea comenzilor;</li>
        <li>emiterea facturilor;</li>
        <li>livrarea produselor;</li>
        <li>comunicarea cu clientul privind comenzile, solicitările sau produsele;</li>
        <li>oferirea de informații despre produse, disponibilitate și oferte;</li>
        <li>gestionarea retururilor, reclamațiilor și garanțiilor;</li>
        <li>administrarea conturilor de client, dacă această funcție este disponibilă;</li>
        <li>respectarea obligațiilor legale și fiscale;</li>
        <li>asigurarea securității și funcționării corecte a site-ului.</li>
      </ul>
      <h2>Temeiul prelucrării</h2>
      <p>Prelucrarea datelor se poate baza pe:</p>
      <ul>
        <li>executarea unui contract sau efectuarea demersurilor înainte de încheierea unui contract;</li>
        <li>respectarea obligațiilor legale, inclusiv obligații fiscale și contabile;</li>
        <li>interesul legitim al operatorului pentru administrarea site-ului, securitate și comunicare;</li>
        <li>consimțământul utilizatorului, acolo unde este necesar.</li>
      </ul>
      <h2>Cui pot fi transmise datele</h2>
      <p>Datele personale nu sunt vândute către terți.</p>
      <p>Datele pot fi transmise sau accesate de furnizori implicați în:</p>
      <ul>
        <li>găzduirea și mentenanța site-ului;</li>
        <li>procesarea comenzilor;</li>
        <li>emiterea facturilor;</li>
        <li>livrarea produselor;</li>
        <li>procesarea plăților online, dacă este cazul;</li>
        <li>servicii de comunicare prin email sau telefon;</li>
        <li>contabilitate, consultanță juridică sau fiscală;</li>
        <li>autorități publice, atunci când există o obligație legală.</li>
      </ul>
      <p>TODO – furnizorii specifici, precum curierul, procesatorul de plată, platforma de facturare sau serviciile de email, vor fi completați ulterior.</p>
      <h2>Durata păstrării datelor</h2>
      <p>Datele sunt păstrate atât timp cât este necesar pentru scopurile pentru care au fost colectate.</p>
      <p>Datele aferente comenzilor și documentelor fiscale pot fi păstrate conform termenelor legale aplicabile.</p>
      <p>Datele transmise prin formulare pot fi păstrate pentru gestionarea solicitării și pentru comunicări ulterioare legate de aceasta.</p>
      <h2>Drepturile persoanelor vizate</h2>
      <p>Conform legislației privind protecția datelor, aveți dreptul de a solicita:</p>
      <ul>
        <li>accesul la datele personale;</li>
        <li>rectificarea datelor incorecte;</li>
        <li>ștergerea datelor;</li>
        <li>restricționarea prelucrării;</li>
        <li>portabilitatea datelor;</li>
        <li>opoziția față de prelucrare;</li>
        <li>retragerea consimțământului, acolo unde prelucrarea se bazează pe consimțământ.</li>
      </ul>
      <p>De asemenea, aveți dreptul de a depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal.</p>
      <h2>Securitatea datelor</h2>
      <p>SEBDENTAL STORE S.R.L. aplică măsuri tehnice și organizatorice rezonabile pentru protejarea datelor personale împotriva accesului neautorizat, pierderii, modificării sau divulgării neautorizate.</p>
      <h2>Modificări ale politicii</h2>
      <p>Această politică poate fi actualizată periodic, în funcție de modificările site-ului, serviciilor oferite sau legislației aplicabile.</p>
    </section>
  );
}

