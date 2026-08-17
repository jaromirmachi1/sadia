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
      name: "description",
      title: "Description",
      type: "localizedBlockContent",
      validation: (rule) => rule.required(),
      fieldset: "story",
    }),
    defineField({
      name: "landmarks",
      title: "Nearby landmarks",
      type: "array",
      of: [defineArrayMember({ type: "localizedString" })],
      fieldset: "story",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "In progress", value: "in-progress" },
          { title: "Completed", value: "completed" },
          { title: "Upcoming", value: "upcoming" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
      fieldset: "facts",
    }),
    defineField({
      name: "type",
      title: "Offer type",
      type: "string",
      options: {
        list: [
          { title: "For sale", value: "for-sale" },
          { title: "For rent", value: "for-rent" },
          { title: "Mixed", value: "mixed" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
      fieldset: "facts",
    }),
    defineField({
      name: "handover",
      title: "Handover",
      type: "localizedString",
      description: "Public handover label, for example Q2 2027.",
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
      fieldset: "place",
    }),
    defineField({
      name: "locationDescription",
      title: "Location description",
      type: "localizedBlockContent",
      fieldset: "place",
    }),
    defineField({
      name: "amenities",
      title: "Amenities nearby",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "amenityGroup",
          fields: [
            defineField({
              name: "title",
              title: "Category",
              type: "localizedString",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "items",
              title: "Places",
              type: "array",
              of: [defineArrayMember({ type: "localizedString" })],
            }),
          ],
          preview: {
            select: { title: "title.cs" },
          },
        }),
      ],
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
    defineField({
      name: "downloads",
      title: "Downloads",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "projectDownload",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "localizedString",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "File URL",
              type: "url",
            }),
            defineField({
              name: "file",
              title: "File",
              type: "file",
            }),
          ],
          preview: {
            select: { title: "title.cs" },
          },
        }),
      ],
    }),
    defineField({
      name: "timeline",
      title: "Construction timeline",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "timelineItem",
          fields: [
            defineField({
              name: "date",
              title: "Date label",
              type: "string",
              description: "For example Q1 2026 or 2027.",
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "localizedString",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "localizedString",
            }),
          ],
          preview: {
            select: { title: "title.cs", subtitle: "date" },
          },
        }),
      ],
    }),
    defineField({
      name: "units",
      title: "Units",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "unit" }],
        }),
      ],
      validation: (rule) => rule.unique(),
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
