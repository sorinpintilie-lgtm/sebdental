import { Article } from "@/lib/types";

export const articles: Article[] = [
  {
    id: "a1",
    slug: "granulatie-fine-medium-coarse-alegerea-rapida",
    title: "Granulație: Fine vs Medium vs Coarse — alegerea rapidă",
    excerpt: "Un reper simplu pentru etapizare fără ezitare în cabinet.",
    sections: [
      {
        heading: "Când alegi Fine",
        bullets: [
          "Ajustări finale înainte de lustruire.",
          "Control bun la margini subgingivale.",
          "Încălzire redusă dacă lucrezi intermitent.",
        ],
      },
      {
        heading: "Când alegi Medium",
        bullets: [
          "Corecții de formă în timp scurt.",
          "Bun compromis între viteză și finisaj.",
          "Util pentru restaurări mixte.",
        ],
      },
      {
        heading: "Când alegi Coarse",
        bullets: [
          "Îndepărtare rapidă de material.",
          "Doar cu răcire și presiune controlată.",
          "Urmează obligatoriu cu medium/fine.",
        ],
      },
    ],
  },
  {
    id: "a2",
    slug: "freze-pentru-zirconiu-ce-verifici",
    title: "Freze pentru zirconiu: ce verifici înainte să comanzi",
    excerpt: "Checklist scurt pentru tăiere eficientă și uzură predictibilă.",
    sections: [
      {
        heading: "Verificări rapide",
        bullets: [
          "Granulație potrivită etapei (nu începe cu fine).",
          "Diametru și formă potrivite accesului clinic.",
          "Compatibilitate FG/RA/HP afișată clar.",
        ],
      },
      {
        heading: "Specificații utile",
        bullets: [
          "ISO complet pentru reordonare fără erori.",
          "RPM recomandat pentru material dur.",
          "Stoc real și termen de livrare estimat.",
        ],
      },
    ],
  },
  {
    id: "a3",
    slug: "fg-ra-hp-compatibilitati-si-greseli",
    title: "FG / RA / HP: compatibilități și greșeli frecvente",
    excerpt: "Diferențele esențiale ca să eviți comenzi incompatibile.",
    sections: [
      {
        heading: "Compatibilități pe scurt",
        bullets: [
          "FG: turbină de mare viteză.",
          "RA: contraunghi, control la turații moderate.",
          "HP: piesă de mână, laborator/ajustări extraorale.",
        ],
      },
      {
        heading: "Greșeli frecvente",
        bullets: [
          "Comandă după nume, fără verificare shank.",
          "Ignorarea ISO în reaprovizionare.",
          "Presiune excesivă în loc de etapizare corectă.",
        ],
      },
    ],
  },
];

