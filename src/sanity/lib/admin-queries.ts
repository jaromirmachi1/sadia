export const ADMIN_PROJECTS_QUERY = `
  *[_type == "project"] | order(name.cs asc) {
    _id,
    "name": coalesce(name.cs, name.en),
    "slug": slug.current,
    status,
    "salesMode": coalesce(salesMode, "soldByUs"),
    location,
    "showOnHomepage": coalesce(showOnHomepage, true)
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
    "salesMode": coalesce(salesMode, "soldByUs"),
    location,
    address,
    geo,
    "descriptionCs": description.cs,
    "descriptionEn": description.en,
    completionDate,
    "badgeCs": badge.cs,
    "badgeEn": badge.en,
    "taglineCs": tagline.cs,
    "taglineEn": tagline.en,
    website,
    unitCount,
    "showOnHomepage": coalesce(showOnHomepage, true),
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
    "projects": count(*[_type == "project"])
  }
`;
