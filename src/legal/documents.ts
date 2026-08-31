import { legalEntity, legalUpdatedAt } from "@/legal/entity";
import type { Locale } from "@/utils/routes";

export type LegalPageKey = "privacy" | "cookies" | "terms";

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
  table?: {
    headers: string[];
    rows: string[][];
  };
};

export type LegalDocumentContent = {
  title: string;
  description: string;
  law: string;
  updated: string;
  sections: LegalSection[];
};

function csPrivacy(): LegalDocumentContent {
  return {
    title: "Ochrana osobních údajů",
    description:
      "Zásady zpracování osobních údajů společnosti Sadia s.r.o. při provozu webu SADIA.",
    law: "Nařízení Evropského parlamentu a Rady (EU) 2016/679 (GDPR).",
    updated: `Aktualizováno ${legalUpdatedAt.cs}`,
    sections: [
      {
        heading: "1. Správce údajů",
        paragraphs: [
          `Správcem osobních údajů je ${legalEntity.name}, IČO ${legalEntity.ico}, DIČ ${legalEntity.dic}, se sídlem ${legalEntity.address}, zapsaná v obchodním rejstříku vedeném ${legalEntity.court}, spisová značka ${legalEntity.fileRef}.`,
          `Pověřence pro ochranu osobních údajů společnost nejmenovala. Ve věcech ochrany osobních údajů nás kontaktujte na ${legalEntity.privacyEmail}.`,
        ],
      },
      {
        heading: "2. Jaké údaje zpracováváme",
        paragraphs: [
          "Zpracováváme jen údaje, které nám sami poskytnete nebo které vzniknou při návštěvě webu:",
        ],
        list: [
          "identifikační a kontaktní údaje z formulářů (jméno, e-mail, zpráva, údaje o nabízené nemovitosti);",
          "technické údaje o návštěvě webu (IP adresa, typ prohlížeče, stránky) v rozsahu, který nastaví hosting a, po vašem souhlasu, Google Analytics 4;",
          "údaje o vaší volbě cookies.",
        ],
      },
      {
        heading: "3. Účely a právní základy",
        list: [
          "Vyřízení poptávky na projekt, byt nebo kontakt — čl. 6 odst. 1 písm. b) GDPR (kroky před uzavřením smlouvy na vaši žádost).",
          "Vyřízení nabídky nemovitosti přes formulář Kupujeme — čl. 6 odst. 1 písm. a) GDPR (souhlas, který udělíte zaškrtnutím).",
          "Odpověď e-mailem na adresu, kterou uvedete, a interní evidence poptávky — čl. 6 odst. 1 písm. b) a f) GDPR.",
          "Provoz a zabezpečení webu (hosting) — čl. 6 odst. 1 písm. f) GDPR (oprávněný zájem na funkčním webu).",
          "Měření návštěvnosti Google Analytics 4 — čl. 6 odst. 1 písm. a) GDPR (souhlas s analytickými cookies).",
          "Zobrazení mapy lokality — čl. 6 odst. 1 písm. f) GDPR (oprávněný zájem ukázat polohu projektů a sídla).",
        ],
      },
      {
        heading: "4. Příjemci a zpracovatelé",
        paragraphs: [
          "Údaje nepředáváme k dalšímu obchodování. Mohou je zpracovávat tito poskytovatelé v postavení zpracovatelů nebo samostatných správců:",
        ],
        list: [
          `e-mailová schránka správce — poptávky zasíláme na ${legalEntity.formEmail};`,
          "Vercel Inc. — hosting a doručení webu;",
          "Sanity US, Inc. — obsahový systém a doručování obrázků;",
          "Google Ireland Limited — Google Analytics 4 (jen se souhlasem) a Google Maps (vložená mapa na stránkách projektů);",
          "OpenStreetMap Foundation — mapa na stránce Kontakt.",
        ],
      },
      {
        heading: "5. Doba uložení",
        paragraphs: [
          "Údaje z poptávek a nabídek nemovitostí uchováváme do vyřízení záležitosti a poté ještě 12 měsíců. Delší dobu jen tehdy, pokud to vyžaduje právní předpis nebo obrana právních nároků.",
          "Souhlas s cookies uchováváme po dobu 6 měsíců, poté se zeptáme znovu.",
          "Provozní logy hostingu se řídí nastavením Vercel, zpravidla v řádu dnů až týdnů.",
        ],
      },
      {
        heading: "6. Předání mimo EU",
        paragraphs: [
          "Vercel, Sanity a Google mohou zpracovávat údaje také ve Spojených státech. Kde je to relevantní, opírají se o rozhodnutí o odpovídající ochraně (včetně EU–US Data Privacy Framework) nebo o standardní smluvní doložky.",
        ],
      },
      {
        heading: "7. Vaše práva",
        paragraphs: [
          "Máte právo na přístup, opravu, výmaz, omezení zpracování, přenositelnost, námitku proti zpracování založenému na oprávněném zájmu a na odvolání souhlasu (odvolání se nedotýká zákonnosti zpracování do té doby).",
          `Práva uplatníte e-mailem na ${legalEntity.privacyEmail}. Máte také právo podat stížnost u Úřadu pro ochranu osobních údajů, Pplk. Sochora 27, 170 00 Praha 7, uoou.gov.cz.`,
        ],
      },
      {
        heading: "8. Cookies",
        paragraphs: [
          "Podrobnosti o cookies, době platnosti a tom, jak změnit volbu, najdete v samostatných Zásadách cookies.",
        ],
      },
    ],
  };
}

function enPrivacy(): LegalDocumentContent {
  return {
    title: "Privacy policy",
    description:
      "How Sadia s.r.o. processes personal data when you use the SADIA website.",
    law: "Regulation (EU) 2016/679 (GDPR).",
    updated: `Last updated ${legalUpdatedAt.en}`,
    sections: [
      {
        heading: "1. Controller",
        paragraphs: [
          `The controller is ${legalEntity.name}, Company ID ${legalEntity.ico}, VAT ID ${legalEntity.dic}, registered office ${legalEntity.address}, registered with ${legalEntity.court} under file ${legalEntity.fileRef}.`,
          `We have not appointed a data protection officer. For privacy matters write to ${legalEntity.privacyEmail}.`,
        ],
      },
      {
        heading: "2. Data we process",
        paragraphs: ["We process data you give us or that arise from a visit:"],
        list: [
          "identity and contact details from forms (name, email, message, details of a property you offer);",
          "technical visit data (IP address, browser, pages) from hosting and, after your consent, Google Analytics 4;",
          "your cookie choice.",
        ],
      },
      {
        heading: "3. Purposes and legal bases",
        list: [
          "Handling an enquiry about a project, home or general contact — Art. 6(1)(b) GDPR (steps at your request before a contract).",
          "Handling a property offer via We buy — Art. 6(1)(a) GDPR (consent you give by ticking the box).",
          "Replying by email and keeping an internal record of the enquiry — Art. 6(1)(b) and (f) GDPR.",
          "Running and securing the website (hosting) — Art. 6(1)(f) GDPR.",
          "Audience measurement with Google Analytics 4 — Art. 6(1)(a) GDPR (analytics cookie consent).",
          "Showing location maps — Art. 6(1)(f) GDPR (legitimate interest in presenting project and office location).",
        ],
      },
      {
        heading: "4. Recipients and processors",
        paragraphs: [
          "We do not sell personal data. These providers may process it as processors or independent controllers:",
        ],
        list: [
          `the controller’s mailbox — enquiries are sent to ${legalEntity.formEmail};`,
          "Vercel Inc. — website hosting and delivery;",
          "Sanity US, Inc. — content management and image delivery;",
          "Google Ireland Limited — Google Analytics 4 (only with consent) and Google Maps (embedded on project pages);",
          "OpenStreetMap Foundation — map on the Contact page.",
        ],
      },
      {
        heading: "5. Retention",
        paragraphs: [
          "Enquiry and property-offer data is kept until the matter is closed and then for a further 12 months, or longer only if the law or the defence of legal claims requires it.",
          "Cookie consent is stored for 6 months, after which we ask again.",
          "Hosting logs follow Vercel’s settings, typically days to weeks.",
        ],
      },
      {
        heading: "6. Transfers outside the EU",
        paragraphs: [
          "Vercel, Sanity and Google may also process data in the United States. Where relevant they rely on an adequacy decision (including the EU–US Data Privacy Framework) or standard contractual clauses.",
        ],
      },
      {
        heading: "7. Your rights",
        paragraphs: [
          "You may request access, rectification, erasure, restriction, portability, object to processing based on legitimate interest, and withdraw consent (withdrawal does not affect processing before that moment).",
          `Write to ${legalEntity.privacyEmail}. You may also lodge a complaint with the Czech Office for Personal Data Protection, Pplk. Sochora 27, 170 00 Prague 7, uoou.gov.cz.`,
        ],
      },
      {
        heading: "8. Cookies",
        paragraphs: [
          "Details of cookies, expiry and how to change your choice are in the Cookie policy.",
        ],
      },
    ],
  };
}

function csCookies(): LegalDocumentContent {
  return {
    title: "Zásady cookies",
    description:
      "Jaké cookies používá web SADIA, k čemu slouží a jak můžete změnit svůj souhlas.",
    law: "Směrnice 2002/58/ES (ePrivacy) a GDPR, ve spojení s českým zákonem o elektronických komunikacích.",
    updated: `Aktualizováno ${legalUpdatedAt.cs}`,
    sections: [
      {
        heading: "1. Co jsou cookies",
        paragraphs: [
          "Cookies jsou malé textové soubory, které se ukládají ve vašem zařízení. Pomáhají webu fungovat, pamatovat si volby a — jen pokud souhlasíte — měřit návštěvnost.",
        ],
      },
      {
        heading: "2. Jaké cookies používáme",
        table: {
          headers: ["Název", "Poskytovatel", "Účel", "Doba", "Typ"],
          rows: [
            [
              "sadia_cookie_consent",
              "Sadia s.r.o.",
              "Uložení vaší volby cookies",
              "6 měsíců",
              "Nezbytné",
            ],
            [
              "sadia_admin_session",
              "Sadia s.r.o.",
              "Přihlášení do administrace (jen /admin)",
              "Relace / dle nastavení",
              "Nezbytné",
            ],
            [
              "sadia_admin_locale",
              "Sadia s.r.o.",
              "Jazyk administrace (jen /admin)",
              "1 rok",
              "Nezbytné",
            ],
            [
              "_ga, _ga_*",
              "Google Ireland Ltd",
              "Google Analytics 4 — měření návštěvnosti",
              "až 2 roky",
              "Analytické (souhlas)",
            ],
          ],
        },
      },
      {
        heading: "3. Třetí strany na stránkách",
        paragraphs: [
          "Na stránkách projektů se může načíst vložená mapa Google Maps. Na stránce Kontakt mapa OpenStreetMap. Tyto služby mohou nastavit vlastní cookies, jakmile se mapa zobrazí. Obrázky a obsah doručuje Sanity. Hosting zajišťuje Vercel.",
          "Analytika Google Analytics 4 se nenačte, dokud v liště cookies nezvolíte „Přijmout vše“.",
        ],
      },
      {
        heading: "4. Jak změnit volbu",
        paragraphs: [
          "Volbu můžete kdykoli změnit tlačítkem „Nastavení cookies“ níže, nebo smazáním cookies v prohlížeči. Odvolání souhlasu se nedotýká zákonnosti zpracování před odvoláním.",
        ],
      },
    ],
  };
}

function enCookies(): LegalDocumentContent {
  return {
    title: "Cookie policy",
    description:
      "Which cookies SADIA uses, what they do, and how you can change your choice.",
    law: "Directive 2002/58/EC (ePrivacy) and the GDPR, together with the Czech Electronic Communications Act.",
    updated: `Last updated ${legalUpdatedAt.en}`,
    sections: [
      {
        heading: "1. What cookies are",
        paragraphs: [
          "Cookies are small text files stored on your device. They help the site work, remember choices and — only if you agree — measure visits.",
        ],
      },
      {
        heading: "2. Cookies we use",
        table: {
          headers: ["Name", "Provider", "Purpose", "Expiry", "Type"],
          rows: [
            [
              "sadia_cookie_consent",
              "Sadia s.r.o.",
              "Stores your cookie choice",
              "6 months",
              "Necessary",
            ],
            [
              "sadia_admin_session",
              "Sadia s.r.o.",
              "Admin sign-in ( /admin only)",
              "Session / as configured",
              "Necessary",
            ],
            [
              "sadia_admin_locale",
              "Sadia s.r.o.",
              "Admin language ( /admin only)",
              "1 year",
              "Necessary",
            ],
            [
              "_ga, _ga_*",
              "Google Ireland Ltd",
              "Google Analytics 4 — audience measurement",
              "up to 2 years",
              "Analytics (consent)",
            ],
          ],
        },
      },
      {
        heading: "3. Third parties on the pages",
        paragraphs: [
          "Project pages may load an embedded Google Map. The Contact page loads OpenStreetMap. Those services may set their own cookies once the map is shown. Images and content are delivered by Sanity. Hosting is provided by Vercel.",
          "Google Analytics 4 does not load until you choose “Accept all” in the cookie bar.",
        ],
      },
      {
        heading: "4. How to change your choice",
        paragraphs: [
          "You can change your choice at any time with “Cookie settings” below, or by deleting cookies in your browser. Withdrawing consent does not affect processing before that moment.",
        ],
      },
    ],
  };
}

function csTerms(): LegalDocumentContent {
  return {
    title: "Podmínky použití",
    description:
      "Pravidla používání webu SADIA, ochrany obsahu a omezení odpovědnosti.",
    law: "Občanský zákoník a zákon č. 480/2004 Sb., o některých službách informační společnosti — informační web, nikoli spotřebitelská kupní smlouva na dálku.",
    updated: `Aktualizováno ${legalUpdatedAt.cs}`,
    sections: [
      {
        heading: "1. Provozovatel",
        paragraphs: [
          `Web provozuje ${legalEntity.name}, IČO ${legalEntity.ico}, DIČ ${legalEntity.dic}, se sídlem ${legalEntity.address}. Kontakt: ${legalEntity.privacyEmail}.`,
        ],
      },
      {
        heading: "2. Charakter webu",
        paragraphs: [
          "Web představuje developerské projekty a nabídku bydlení. Ceníky, popisy a vizualizace jsou informativní. Nejde o e-shop: přes web nelze uzavřít kupní smlouvu ani zaplatit cenu bytu. Závazný vztah vzniká až samostatnou smlouvou mimo tento web.",
          "U některých projektů odkazujeme na web třetí strany. Za obsah a prodej tam odpovídá provozovatel toho webu.",
        ],
      },
      {
        heading: "3. Duševní vlastnictví",
        paragraphs: [
          "Texty, fotografie, loga a grafika webu jsou chráněny. Bez písemného souhlasu je nesmíte kopírovat ke komerčnímu užití. Můžete web prohlížet a sdílet odkazy na veřejné stránky.",
        ],
      },
      {
        heading: "4. Odpovědnost",
        paragraphs: [
          "Snažíme se o aktuální údaje, ale dostupnost jednotek, ceny a termíny se mohou změnit. Web může být dočasně nedostupný z technických důvodů.",
          "Neodpovídáme za obsah odkazovaných webů třetích stran ani za rozhodnutí, která učiníte jen na základě informací na webu, bez ověření u nás.",
        ],
      },
      {
        heading: "5. Rozhodné právo",
        paragraphs: [
          "Tyto podmínky se řídí právem České republiky. Spory, které nepůjde vyřešit dohodou, řeší věcně a místně příslušné soudy v České republice, zpravidla podle sídla provozovatele v Brně, pokud kogentní předpisy nestanoví jinak.",
        ],
      },
    ],
  };
}

function enTerms(): LegalDocumentContent {
  return {
    title: "Terms of use",
    description:
      "Rules for using the SADIA website, content protection and limits of liability.",
    law: "Czech Civil Code and Act No. 480/2004 Coll. on certain information society services — an information site, not a distance consumer sale.",
    updated: `Last updated ${legalUpdatedAt.en}`,
    sections: [
      {
        heading: "1. Operator",
        paragraphs: [
          `The site is operated by ${legalEntity.name}, Company ID ${legalEntity.ico}, VAT ID ${legalEntity.dic}, registered office ${legalEntity.address}. Contact: ${legalEntity.privacyEmail}.`,
        ],
      },
      {
        heading: "2. Nature of the site",
        paragraphs: [
          "The site presents development projects and homes. Price lists, descriptions and visuals are informational. This is not an e-shop: you cannot conclude a purchase contract or pay for a home through the site. A binding relationship arises only from a separate contract off this website.",
          "Some projects link to a third-party site. That operator is responsible for the content and sale there.",
        ],
      },
      {
        heading: "3. Intellectual property",
        paragraphs: [
          "Texts, photographs, logos and graphics are protected. Do not copy them for commercial use without written consent. You may browse the site and share links to public pages.",
        ],
      },
      {
        heading: "4. Liability",
        paragraphs: [
          "We aim to keep information current, but unit availability, prices and dates can change. The site may be temporarily unavailable for technical reasons.",
          "We are not responsible for third-party websites we link to, nor for decisions you make solely from information on this site without checking with us.",
        ],
      },
      {
        heading: "5. Governing law",
        paragraphs: [
          "These terms are governed by the law of the Czech Republic. Disputes that cannot be settled amicably shall be heard by the competent Czech courts, generally those for the operator’s seat in Brno, unless mandatory rules provide otherwise.",
        ],
      },
    ],
  };
}

const documents: Record<Locale, Record<LegalPageKey, LegalDocumentContent>> = {
  cs: {
    privacy: csPrivacy(),
    cookies: csCookies(),
    terms: csTerms(),
  },
  en: {
    privacy: enPrivacy(),
    cookies: enCookies(),
    terms: enTerms(),
  },
};

export function getLegalDocument(
  locale: Locale,
  key: LegalPageKey,
): LegalDocumentContent {
  return documents[locale][key];
}
