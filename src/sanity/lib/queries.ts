import { defineQuery } from "next-sanity";

export const PROJECTS_QUERY = defineQuery(`
  *[_type == "project"] | order(completionDate desc) {
    _id,
    "name": name[$locale],
    "slug": slug.current,
    status,
    "salesMode": coalesce(salesMode, "soldByUs"),
    location,
    address,
    heroImage,
    "gallery": gallery[0...2],
    completionDate
  }
`);

export const PROJECT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    "name": name[$locale],
    "slug": slug.current,
    status,
    "salesMode": coalesce(salesMode, "soldByUs"),
    location,
    address,
    geo,
    heroImage,
    gallery,
    "description": description[$locale],
    "badge": badge[$locale],
    "tagline": tagline[$locale],
    "landmarks": landmarks[][$locale],
    "handover": handover[$locale],
    website,
    "locationDescription": locationDescription[$locale],
    completionDate,
  }
`);

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"][0] {
    companyName,
    address,
    registrationNumber,
    vatNumber,
    email,
    socialLinks,
    "footerNavigation": footerNavigation[] {
      "label": label[$locale],
      href
    }
  }
`);
