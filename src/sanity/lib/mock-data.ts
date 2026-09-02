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
  },
  zabiny: {
    badge: { cs: "Výhledy na Brno", en: "Views over Brno" },
    tagline: {
      cs: "Světlo, klid a charakter místa",
      en: "Light, calm and a sense of place",
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
      showOnHomepage: true,
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
      showOnHomepage: false,
    },
  ];
}

export function getMockHomepageProjects(locale: Locale): ProjectSummary[] {
  return getMockProjects(locale).filter((project) => project.showOnHomepage !== false);
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
    badge: copy.badge[locale],
    tagline: copy.tagline[locale],
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
