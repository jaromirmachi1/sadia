import { defineArrayMember, defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fieldsets: [
    { name: "story", title: "Story" },
    { name: "facts", title: "Facts" },
    { name: "place", title: "Location" },
    { name: "media", title: "Media" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name.cs",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "badge",
      title: "Badge",
      type: "localizedString",
      description: "Short label above the title, for example Exclusive location.",
      fieldset: "story",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "localizedString",
      fieldset: "story",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "In preparation", value: "in-progress" },
          { title: "In realization", value: "in-realization" },
          { title: "Completed", value: "completed" },
          { title: "Rented", value: "rented" },
          { title: "Upcoming", value: "upcoming" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
      fieldset: "facts",
    }),
    defineField({
      name: "showOnHomepage",
      title: "Show on homepage",
      type: "boolean",
      description: "When enabled, the project appears in the homepage projects section.",
      initialValue: false,
      fieldset: "facts",
    }),
    defineField({
      name: "completionDate",
      title: "Completion date",
      type: "date",
      options: {
        dateFormat: "MM.YYYY",
      },
      fieldset: "facts",
    }),
    defineField({
      name: "website",
      title: "Project website",
      type: "url",
      fieldset: "facts",
    }),
    defineField({
      name: "salesMode",
      title: "Sales mode",
      type: "string",
      initialValue: "soldByUs",
      options: {
        list: [
          { title: "Sold by SADIA", value: "soldByUs" },
          { title: "Sold by external firm", value: "sellByFirm" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
      fieldset: "facts",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "District and city, for example Brno – Žabovřesky.",
      validation: (rule) => rule.required(),
      fieldset: "place",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "string",
      validation: (rule) => rule.required(),
      fieldset: "place",
    }),
    defineField({
      name: "geo",
      title: "Map location",
      type: "geopoint",
      description:
        "Pin shown on the full-width Google Map on the project page. You can also set this in the admin dashboard using latitude and longitude.",
      fieldset: "place",
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "accessibleImage",
      validation: (rule) => rule.required(),
      fieldset: "media",
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [defineArrayMember({ type: "accessibleImage" })],
      validation: (rule) => rule.unique(),
      fieldset: "media",
    }),
  ],
  preview: {
    select: {
      title: "name.cs",
      subtitle: "location",
      media: "heroImage",
    },
  },
});
