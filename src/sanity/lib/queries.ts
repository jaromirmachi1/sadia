import { defineQuery } from "next-sanity";

export const PROJECTS_QUERY = defineQuery(`
  *[_type == "project"] | order(completionDate desc) {
    _id,
    "name": name[$locale],
    "slug": slug.current,
    status,
    type,
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
    type,
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
    "amenities": amenities[] {
      "title": title[$locale],
      "items": items[][$locale]
    },
    "downloads": downloads[] {
      "title": title[$locale],
      "url": coalesce(url, file.asset->url)
    },
    "timeline": timeline[] {
      "title": title[$locale],
      date,
      "description": description[$locale]
    },
    completionDate,
    "units": *[_type == "unit" && project._ref == ^._id] | order(floor asc, identifier asc) {
      _id,
      identifier,
      "slug": slug.current,
      layout,
      "unitType": coalesce(unitType, "apartment"),
      areaM2,
      floor,
      orientation,
      cellarM2,
      outdoorM2,
      balconyM2,
      loggiaM2,
      terraceM2,
      gardenM2,
      price,
      currency,
      priceOnRequest,
      status,
      dealType,
      photos
    }
  }
`);

export const UNITS_BY_DEAL_TYPE_QUERY = defineQuery(`
  *[_type == "unit" && dealType == $dealType] | order(featured desc, price asc) {
    _id,
    identifier,
    "slug": slug.current,
    layout,
    areaM2,
    floor,
    price,
    currency,
    priceOnRequest,
    status,
    dealType,
    featured,
    photos,
    project-> {
      _id,
      "name": name[$locale],
      "slug": slug.current,
      location
    }
  }
`);

export const UNIT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "unit" && slug.current == $slug][0] {
    _id,
    identifier,
    "slug": slug.current,
    layout,
    areaM2,
    floor,
    price,
    currency,
    priceOnRequest,
    status,
    dealType,
    floorPlanImage,
    photos,
    project-> {
      _id,
      "name": name[$locale],
      "slug": slug.current,
      location,
      address
    }
  }
`);

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"][0] {
    companyName,
    address,
    registrationNumber,
    vatNumber,
    email,
    phone,
    socialLinks,
    "footerNavigation": footerNavigation[] {
      "label": label[$locale],
      href
    }
  }
`);
