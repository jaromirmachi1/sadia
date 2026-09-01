import koblizna01 from "@/images/koblizna-01.jpg";
import koblizna02 from "@/images/koblizna-02.jpg";
import koblizna04 from "@/images/koblizna-04.jpg";
import koblizna07 from "@/images/koblizna-07.jpg";
import kobliznaEvening from "@/images/koblizna-evening.jpg";
import kobliznaFacade from "@/images/koblizna.jpg";
import type {
  HomeStats,
  ProjectDetail,
  ProjectSummary,
  SiteSettings,
} from "@/sanity/types";
import type { Locale } from "@/utils/routes";

const projectNames = {
  koblizna: {
    cs: "Koblížná",
    en: "Koblížná",
  },
  zabiny: {
    cs: "Panorama Žabiny",
    en: "Panorama Žabiny",
  },
} as const;

const projectCopy = {
  koblizna: {
    badge: { cs: "Centrum Brna", en: "Central Brno" },
    tagline: {
      cs: "Město na dosah",
      en: "The city within reach",
    },
    description: {
      cs: "Výrazný městský dům na adrese, odkud je celé Brno na dosah. Původní prostory jsme proměnili v současné, plně vybavené bydlení pro život v centru.",
      en: "A distinctive city building at an address that keeps all of Brno within reach. We transformed its existing spaces into contemporary, fully furnished homes for life in the centre.",
    },
    handover: { cs: "Dokončeno 2023", en: "Completed 2023" },
    locationDescription: {
      cs: "Koblížná leží v samém srdci Brna. Historie, kultura, gastronomie i každodenní život jsou tady vrstvy jednoho místa — ne kulisa.",
      en: "Koblížná sits in the heart of Brno. History, culture, food and everyday life are layers of one place here — not a backdrop.",
    },
    landmarks: {
      cs: [
        "Náměstí Svobody",
        "Mahenovo divadlo",
        "Česká",
        "Hlavní nádraží",
        "Zelný trh",
      ],
      en: [
        "Freedom Square",
        "Mahen Theatre",
        "Česká Street",
        "Main railway station",
        "Cabbage Market",
      ],
    },
    amenities: {
      cs: [
        {
          title: "Doprava",
          items: ["Tramvaj 1 min", "Hlavní nádraží 8 min", "Parkování v objektu"],
        },
        {
          title: "Gastro",
          items: ["Kavárny na České", "Restaurace v centru", "Zelný trh"],
        },
        {
          title: "Kultura",
          items: ["Mahenovo divadlo", "Janáčkovo divadlo", "Galerie"],
        },
      ],
      en: [
        {
          title: "Transport",
          items: ["Tram 1 min", "Main station 8 min", "On-site parking"],
        },
        {
          title: "Food",
          items: ["Cafés on Česká", "Restaurants in the centre", "Cabbage Market"],
        },
        {
          title: "Culture",
          items: ["Mahen Theatre", "Janáček Theatre", "Galleries"],
        },
      ],
    },
    timeline: {
      cs: [
        {
          date: "2021",
          title: "Akvizice",
          description: "Koupě domu a příprava projektu.",
        },
        {
          date: "2022",
          title: "Rekonstrukce",
          description: "Kompletní obnova konstrukcí, dispozic a společných prostor.",
        },
        {
          date: "2023",
          title: "Dokončení",
          description: "Předání bytů a spuštění provozu domu.",
        },
      ],
      en: [
        {
          date: "2021",
          title: "Acquisition",
          description: "Purchase of the building and project preparation.",
        },
        {
          date: "2022",
          title: "Reconstruction",
          description: "Full renewal of structure, layouts and shared spaces.",
        },
        {
          date: "2023",
          title: "Completion",
          description: "Handover of apartments and the house in operation.",
        },
      ],
    },
  },
  zabiny: {
    badge: { cs: "Výhledy na Brno", en: "Views over Brno" },
    tagline: {
      cs: "Světlo, klid a charakter místa",
      en: "Light, calm and a sense of place",
    },
    description: {
      cs: "Rezidenční projekt nad Žabinami s otevřenými výhledy na Brno. Dispozice zaměřené na světlo, klid a bydlení s charakterem místa.",
      en: "A residential project above Žabiny with open views over Brno. Layouts shaped around light, calm and a home that belongs to its setting.",
    },
    handover: { cs: "Q2 2027", en: "Q2 2027" },
    locationDescription: {
      cs: "Žabiny nabízejí nadhled nad městem a přitom zůstávají součástí Brna. Klidná rezidenční čtvrť s rychlým spojením do centra.",
      en: "Žabiny sits above the city while remaining part of Brno. A calm residential neighbourhood with a fast link to the centre.",
    },
    landmarks: {
      cs: ["Výhled na Brno", "Lesopark", "MHD do centra"],
      en: ["Views over Brno", "Woodland park", "Transit to the centre"],
    },
    amenities: {
      cs: [
        {
          title: "Doprava",
          items: ["Bus do centra 12 min", "Dálnice D1 8 min"],
        },
        {
          title: "Příroda",
          items: ["Lesopark", "Pěší trasy", "Klídná lokalita"],
        },
      ],
      en: [
        {
          title: "Transport",
          items: ["Bus to centre 12 min", "D1 motorway 8 min"],
        },
        {
          title: "Nature",
          items: ["Woodland park", "Walking trails", "Quiet setting"],
        },
      ],
    },
    timeline: {
      cs: [
        {
          date: "2025",
          title: "Příprava",
          description: "Projektová dokumentace a povolení.",
        },
        {
          date: "2026",
          title: "Výstavba",
          description: "Zahájení stavby a hrubá stavba.",
        },
        {
          date: "2027",
          title: "Předání",
          description: "Dokončení a předání bytů.",
        },
      ],
      en: [
        {
          date: "2025",
          title: "Preparation",
          description: "Design documentation and permits.",
        },
        {
          date: "2026",
          title: "Construction",
          description: "Start of works and superstructure.",
        },
        {
          date: "2027",
          title: "Handover",
          description: "Completion and apartment handover.",
        },
      ],
    },
  },
} as const;

const unitCopy = {
  cs: {
    alts: {
      living: "Obytný prostor bytu v projektu Koblížná",
      kitchen: "Kuchyňský kout bytu v projektu Koblížná",
      bedroom: "Ložnice bytu v projektu Koblížná",
      facade: "Fasáda domu Koblížná",
      evening: "Večerní pohled na dům Koblížná",
    },
  },
  en: {
    alts: {
      living: "Living space in a Koblížná apartment",
      kitchen: "Kitchen area in a Koblížná apartment",
      bedroom: "Bedroom in a Koblížná apartment",
      facade: "Koblížná building façade",
      evening: "Evening view of the Koblížná building",
    },
  },
} as const;

export function getMockStats(): HomeStats {
  return {
    projects: 2,
  };
}

export function getMockProjects(locale: Locale): ProjectSummary[] {
  const alts = unitCopy[locale].alts;

  return [
    {
      _id: "project-koblizna",
      name: projectNames.koblizna[locale],
      slug: "koblizna",
      status: "completed",
      salesMode: "soldByUs",
      location: "Brno · Brno-střed",
      address: "Koblížná, Brno-střed",
      heroImage: { alt: alts.evening, local: kobliznaEvening },
      gallery: [
        { alt: alts.facade, local: kobliznaFacade },
        { alt: alts.living, local: koblizna01 },
      ],
      completionDate: "2023-07-01",
    },
    {
      _id: "project-panorama-zabiny",
      name: projectNames.zabiny[locale],
      slug: "panorama-zabiny",
      status: "in-progress",
      salesMode: "sellByFirm",
      location: "Brno · Žabiny",
      address: "Žabiny, Brno",
      heroImage: {
        alt:
          locale === "cs"
            ? "Mock vizualizace projektu Panorama Žabiny"
            : "Mock visualisation of Panorama Žabiny",
        local: kobliznaFacade,
      },
      gallery: [
        { alt: alts.living, local: koblizna01 },
        { alt: alts.kitchen, local: koblizna04 },
      ],
      completionDate: "2027-06-01",
    },
  ];
}

export function getMockProjectBySlug(
  locale: Locale,
  slug: string,
): ProjectDetail | null {
  const summary = getMockProjects(locale).find((project) => project.slug === slug);

  if (!summary) {
    return null;
  }

  const alts = unitCopy[locale].alts;
  const copy = slug === "panorama-zabiny" ? projectCopy.zabiny : projectCopy.koblizna;

  return {
    ...summary,
    address:
      slug === "panorama-zabiny" ? "Žabiny, Brno" : "Koblížná, Brno-střed",
    geo:
      slug === "panorama-zabiny"
        ? { lat: 49.1784, lng: 16.5692 }
        : { lat: 49.1952, lng: 16.6086 },
    gallery:
      slug === "panorama-zabiny"
        ? [
            {
              alt:
                locale === "cs"
                  ? "Mock vizualizace projektu Panorama Žabiny"
                  : "Mock visualisation of Panorama Žabiny",
              local: kobliznaFacade,
            },
            { alt: alts.living, local: koblizna01 },
            { alt: alts.kitchen, local: koblizna04 },
          ]
        : [
            { alt: alts.facade, local: kobliznaFacade },
            { alt: alts.living, local: koblizna01 },
            { alt: alts.kitchen, local: koblizna02 },
            { alt: alts.bedroom, local: koblizna07 },
          ],
    description: copy.description[locale],
    badge: copy.badge[locale],
    tagline: copy.tagline[locale],
    landmarks: [...copy.landmarks[locale]],
    handover: copy.handover[locale],
    locationDescription: copy.locationDescription[locale],
  };
}

export function getMockSiteSettings(locale: Locale): SiteSettings {
  return {
    companyName: "SADIA",
    address:
      locale === "cs"
        ? "Radnická 376/11, Brno-město"
        : "Radnická 376/11, Brno-město",
    registrationNumber: "",
    vatNumber: "",
    email: "adam@sadiaestate.cz",
  };
}
