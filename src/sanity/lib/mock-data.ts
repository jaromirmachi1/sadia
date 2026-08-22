import koblizna01 from "@/images/koblizna-01.jpg";
import koblizna02 from "@/images/koblizna-02.jpg";
import koblizna04 from "@/images/koblizna-04.jpg";
import koblizna07 from "@/images/koblizna-07.jpg";
import kobliznaEvening from "@/images/koblizna-evening.jpg";
import kobliznaFacade from "@/images/koblizna.jpg";
import type {
  HomeStats,
  NewsDetail,
  NewsSummary,
  ProjectDetail,
  ProjectSummary,
  SiteSettings,
  UnitDetail,
  UnitSummary,
} from "@/sanity/types";
import { textToPortableText } from "@/lib/admin-types";
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

function buildUnits(locale: Locale): UnitSummary[] {
  const alts = unitCopy[locale].alts;

  return [
    {
      _id: "unit-koblizna-1",
      identifier: "A1",
      slug: "koblizna-a1",
      layout: "2+kk",
      unitType: "apartment",
      areaM2: 48,
      floor: 2,
      orientation: "JZ",
      cellarM2: 3.2,
      balconyM2: 6.4,
      price: 24500,
      currency: "CZK",
      priceOnRequest: false,
      status: "available",
      dealType: "rent",
      featured: true,
      photos: [{ alt: alts.living, local: koblizna01 }],
      project: {
        _id: "project-koblizna",
        name: projectNames.koblizna[locale],
        slug: "koblizna",
        location: "Brno · Brno-střed",
      },
    },
    {
      _id: "unit-koblizna-2",
      identifier: "A2",
      slug: "koblizna-a2",
      layout: "1+kk",
      unitType: "apartment",
      areaM2: 34,
      floor: 3,
      orientation: "SV",
      cellarM2: 2.1,
      price: 18900,
      currency: "CZK",
      priceOnRequest: false,
      status: "available",
      dealType: "rent",
      featured: true,
      photos: [{ alt: alts.kitchen, local: koblizna02 }],
      project: {
        _id: "project-koblizna",
        name: projectNames.koblizna[locale],
        slug: "koblizna",
        location: "Brno · Brno-střed",
      },
    },
    {
      _id: "unit-koblizna-3",
      identifier: "B1",
      slug: "koblizna-b1",
      layout: "2+1",
      unitType: "apartment",
      areaM2: 62,
      floor: 4,
      orientation: "JV",
      cellarM2: 4.8,
      terraceM2: 8.1,
      price: 28900,
      currency: "CZK",
      priceOnRequest: false,
      status: "reserved",
      dealType: "rent",
      featured: false,
      photos: [{ alt: alts.bedroom, local: koblizna07 }],
      project: {
        _id: "project-koblizna",
        name: projectNames.koblizna[locale],
        slug: "koblizna",
        location: "Brno · Brno-střed",
      },
    },
    {
      _id: "unit-koblizna-4",
      identifier: "B2",
      slug: "koblizna-b2",
      layout: "2+kk",
      unitType: "apartment",
      areaM2: 51,
      floor: 5,
      orientation: "JZ",
      cellarM2: 3.4,
      loggiaM2: 4.2,
      price: 25900,
      currency: "CZK",
      priceOnRequest: false,
      status: "available",
      dealType: "rent",
      featured: false,
      photos: [{ alt: alts.kitchen, local: koblizna04 }],
      project: {
        _id: "project-koblizna",
        name: projectNames.koblizna[locale],
        slug: "koblizna",
        location: "Brno · Brno-střed",
      },
    },
  ];
}

export function getMockStats(): HomeStats {
  const units = buildUnits("cs");
  return {
    projects: 2,
    units: units.length,
    totalSqm: units.reduce((sum, unit) => sum + unit.areaM2, 0),
    forSale: 0,
    forRent: units.filter((unit) => unit.status === "available").length,
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
      type: "for-rent",
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
      type: "for-sale",
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
    amenities: copy.amenities[locale].map((group) => ({
      title: group.title,
      items: [...group.items],
    })),
    downloads: [],
    timeline: copy.timeline[locale].map((item) => ({ ...item })),
    units: slug === "panorama-zabiny" ? [] : buildUnits(locale),
  };
}

export function getMockUnitsByDealType(
  locale: Locale,
  dealType: "sale" | "rent",
): UnitSummary[] {
  return buildUnits(locale).filter((unit) => unit.dealType === dealType);
}

export function getMockUnitBySlug(
  locale: Locale,
  slug: string,
): UnitDetail | null {
  const unit = buildUnits(locale).find((item) => item.slug === slug);

  if (!unit) {
    return null;
  }

  return {
    ...unit,
    floorPlanImage: undefined,
    project: {
      _id: "project-koblizna",
      name: projectNames.koblizna[locale],
      slug: "koblizna",
      salesMode: "soldByUs",
      location: "Brno · Brno-střed",
      address: "Koblížná, Brno-střed",
    },
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
    phone: "+420 607 100 886",
  };
}

const newsCopy = [
  {
    slug: "koblizna-dokoncena",
    publishedAt: "2026-08-19T09:00:00.000Z",
    heroImage: kobliznaEvening,
    relatedProjectSlug: "koblizna",
    cs: {
      title: "Koblížná je dokončena a připravena k nastěhování",
      excerpt:
        "Projekt v centru Brna je kompletně dokončený. Hotové jsou byty i společné prostory v domě s historickou adresou.",
      body: "Projekt Koblížná v srdci Brna je kompletně dokončený. Všechny byty i společné prostory prošly proměnou, která respektuje charakter původního domu a zároveň nabízí současný standard bydlení.\n\nPro zájemce o bydlení v centru města je k dispozici aktuální nabídka volných jednotek. Kontaktujte nás pro osobní prohlídku.",
    },
    en: {
      title: "Koblížná is complete and ready to move in",
      excerpt:
        "The central Brno project is fully finished. Apartments and shared spaces in the historic building are ready for new residents.",
      body: "The Koblížná project in the heart of Brno is fully complete. Every apartment and shared space has been transformed with respect for the building's character while offering a contemporary living standard.\n\nFor anyone looking for a home in the city centre, the current availability of units is open. Contact us to arrange a private viewing.",
    },
  },
  {
    slug: "panorama-zabiny-pripravujeme",
    publishedAt: "2026-08-12T09:00:00.000Z",
    heroImage: koblizna02,
    relatedProjectSlug: "panorama-zabiny",
    cs: {
      title: "Panorama Žabiny vstupuje do další fáze přípravy",
      excerpt:
        "Na projektu v brněnských Žabovřeskách pokračujeme v návrhu dispozic i veřejných prostor s důrazem na výhled a klid lokality.",
      body: "Panorama Žabiny se posouvá do další fáze přípravy. Tým SADIA pracuje na finálním uspořádání bytů, společných prostor i exteriéru tak, aby projekt co nejlépe využil polohu nad městem.\n\nJakmile budou k dispozici konkrétní termíny prodeje, sdílíme je v aktualitách i na stránce projektu.",
    },
    en: {
      title: "Panorama Žabiny enters the next planning phase",
      excerpt:
        "At our Žabovřesky site we continue shaping layouts and shared spaces with a focus on views and the calm of the neighbourhood.",
      body: "Panorama Žabiny is moving into the next planning phase. The SADIA team is refining apartment layouts, shared spaces and the exterior so the project makes the most of its elevated position above the city.\n\nOnce concrete sales milestones are confirmed, we will share them here and on the project page.",
    },
  },
  {
    slug: "sadia-kupuje-nemovitosti-brno",
    publishedAt: "2026-08-05T09:00:00.000Z",
    heroImage: kobliznaFacade,
    cs: {
      title: "SADIA hledá nemovitosti s potenciálem v Brně",
      excerpt:
        "Rozšiřujeme portfolio o domy, budovy a pozemky, kde dává smysl proměna s respektem k místu i původní architektuře.",
      body: "SADIA aktivně vyhledává nemovitosti v Brně a okolí, které mají potenciál pro proměnu v kvalitní bydlení nebo smysluplný rozvoj lokality.\n\nJednáme přímo s majiteli. Pokud máte dům, budovu nebo pozemek, který by mohl získat novou kapitolu, napište nám přes formulář Kupujeme.",
    },
    en: {
      title: "SADIA is looking for properties with potential in Brno",
      excerpt:
        "We are expanding our portfolio with buildings and land where transformation can respect place and original architecture.",
      body: "SADIA is actively looking for properties in Brno and the surrounding area that can become quality homes or meaningful neighbourhood development.\n\nWe negotiate directly with owners. If you have a house, building or plot that deserves a new chapter, reach out through our We Buy form.",
    },
  },
] as const;

function buildMockNewsArticles(locale: Locale): NewsSummary[] {
  return newsCopy.map((item) => {
    const copy = item[locale];

    return {
      _id: `news-${item.slug}`,
      title: copy.title,
      slug: item.slug,
      excerpt: copy.excerpt,
      publishedAt: item.publishedAt,
      heroImage: {
        alt: copy.title,
        local: item.heroImage,
      },
    };
  });
}

export function getMockNewsArticles(locale: Locale): NewsSummary[] {
  return buildMockNewsArticles(locale);
}

export function getMockNewsArticleBySlug(
  locale: Locale,
  slug: string,
): NewsDetail | null {
  const item = newsCopy.find((entry) => entry.slug === slug);

  if (!item) {
    return null;
  }

  const copy = item[locale];
  const summary = buildMockNewsArticles(locale).find(
    (article) => article.slug === slug,
  );

  if (!summary) {
    return null;
  }

  const paragraphs = copy.body.split("\n\n").filter(Boolean);

  return {
    ...summary,
    body: paragraphs.flatMap((paragraph) => textToPortableText(paragraph)),
    bodyPlain: copy.body,
    relatedProject:
      "relatedProjectSlug" in item && item.relatedProjectSlug
        ? {
            _id: `project-${item.relatedProjectSlug}`,
            name:
              item.relatedProjectSlug === "koblizna"
                ? projectNames.koblizna[locale]
                : projectNames.zabiny[locale],
            slug: item.relatedProjectSlug,
          }
        : undefined,
  };
}
