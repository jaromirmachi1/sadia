export const ADMIN_UNITS_QUERY = `
  *[_type == "unit"] | order(identifier asc) {
    _id,
    identifier,
    "slug": slug.current,
    layout,
    "unitType": coalesce(unitType, "apartment"),
    areaM2,
    floor,
    price,
    currency,
    priceOnRequest,
    status,
    dealType,
    featured,
    externalUrl,
    _updatedAt,
    "projectId": project._ref,
    "projectName": coalesce(project->name.cs, project->name.en, "—")
  }
`;

export const ADMIN_UNIT_BY_ID_QUERY = `
  *[_type == "unit" && _id == $id][0] {
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
    featured,
    externalUrl,
    "projectId": project._ref,
    "projectName": coalesce(project->name.cs, project->name.en, "—"),
    floorPlanImage {
      _key,
      alt,
      asset->{
        _id,
        url
      }
    },
    photos[] {
      _key,
      alt,
      asset->{
        _id,
        url
      }
    }
  }
`;

export const ADMIN_PROJECTS_QUERY = `
  *[_type == "project"] | order(name.cs asc) {
    _id,
    "name": coalesce(name.cs, name.en),
    "slug": slug.current,
    status,
    type,
    "salesMode": coalesce(salesMode, "soldByUs"),
    location,
    "unitCount": count(*[_type == "unit" && references(^._id)])
  }
`;

export const ADMIN_PROJECT_BY_ID_QUERY = `
  *[_type == "project" && _id == $id][0] {
    _id,
    "name": coalesce(name.cs, name.en),
    "nameCs": name.cs,
    "nameEn": name.en,
    "slug": slug.current,
    status,
    type,
    "salesMode": coalesce(salesMode, "soldByUs"),
    location,
    address,
    "descriptionCs": description.cs,
    "descriptionEn": description.en,
    completionDate,
    "badgeCs": badge.cs,
    "badgeEn": badge.en,
    "taglineCs": tagline.cs,
    "taglineEn": tagline.en,
    "handoverCs": handover.cs,
    "handoverEn": handover.en,
    website,
    landmarks[] { cs, en },
    "locationDescriptionCs": locationDescription.cs,
    "locationDescriptionEn": locationDescription.en,
    "amenities": amenities[] {
      "titleCs": title.cs,
      "titleEn": title.en,
      "itemsCs": items[].cs,
      "itemsEn": items[].en
    },
    "downloads": downloads[] {
      "titleCs": title.cs,
      "titleEn": title.en,
      "url": coalesce(url, file.asset->url)
    },
    "timeline": timeline[] {
      date,
      "titleCs": title.cs,
      "titleEn": title.en,
      "descriptionCs": description.cs,
      "descriptionEn": description.en
    },
    "unitCount": count(*[_type == "unit" && references(^._id)]),
    heroImage {
      _key,
      alt,
      asset->{
        _id,
        url
      }
    },
    gallery[] {
      _key,
      alt,
      asset->{
        _id,
        url
      }
    }
  }
`;

export const ADMIN_STATS_QUERY = `
  {
    "projects": count(*[_type == "project"]),
    "units": count(*[_type == "unit"]),
    "available": count(*[_type == "unit" && status == "available"]),
    "forSale": count(*[_type == "unit" && dealType == "sale"]),
    "forRent": count(*[_type == "unit" && dealType == "rent"])
  }
`;
