import { defineArrayMember, defineField, defineType } from "sanity";

const layouts = [
  "S",
  "1+kk",
  "1+1",
  "2+kk",
  "2+1",
  "3+kk",
  "3+1",
  "4+kk",
  "4+1",
  "5+kk",
  "5+1",
];

export const unit = defineType({
  name: "unit",
  title: "Unit",
  type: "document",
  fields: [
    defineField({
      name: "project",
      title: "Project",
      type: "reference",
      to: [{ type: "project" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "identifier",
      title: "Identifier",
      type: "string",
      description: "Internal unit number or public identifier.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "identifier",
        maxLength: 96,
      },
      description: "Required for the public unit detail URL.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        list: layouts.map((layout) => ({ title: layout, value: layout })),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "unitType",
      title: "Unit type",
      type: "string",
      initialValue: "apartment",
      options: {
        list: [
          { title: "Apartment", value: "apartment" },
          { title: "Commercial", value: "commercial" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "areaM2",
      title: "Area (m²)",
      type: "number",
      validation: (rule) => rule.required().positive().precision(2),
    }),
    defineField({
      name: "floor",
      title: "Floor",
      type: "number",
      validation: (rule) => rule.required().integer().min(-2),
    }),
    defineField({
      name: "orientation",
      title: "Orientation",
      type: "string",
      description: "For example SV, JZ, or SV, JZ.",
    }),
    defineField({
      name: "cellarM2",
      title: "Cellar (m²)",
      type: "number",
      validation: (rule) => rule.min(0).precision(2),
    }),
    defineField({
      name: "balconyM2",
      title: "Balcony (m²)",
      type: "number",
      validation: (rule) => rule.min(0).precision(2),
    }),
    defineField({
      name: "loggiaM2",
      title: "Loggia (m²)",
      type: "number",
      validation: (rule) => rule.min(0).precision(2),
    }),
    defineField({
      name: "terraceM2",
      title: "Terrace (m²)",
      type: "number",
      validation: (rule) => rule.min(0).precision(2),
    }),
    defineField({
      name: "gardenM2",
      title: "Front garden (m²)",
      type: "number",
      validation: (rule) => rule.min(0).precision(2),
    }),
    defineField({
      name: "outdoorM2",
      title: "Outdoor (legacy m²)",
      type: "number",
      hidden: true,
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      validation: (rule) =>
        rule.min(0).custom((price, context) => {
          const parent = context.parent as
            | { priceOnRequest?: boolean }
            | undefined;

          return parent?.priceOnRequest || typeof price === "number"
            ? true
            : "Enter a price or enable price on request.";
        }),
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      initialValue: "CZK",
      options: {
        list: [
          { title: "CZK", value: "CZK" },
          { title: "EUR", value: "EUR" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "priceOnRequest",
      title: "Price on request",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Available", value: "available" },
          { title: "Reserved", value: "reserved" },
          { title: "Sold", value: "sold" },
          { title: "Rented", value: "rented" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "externalUrl",
      title: "External URL (legacy)",
      type: "url",
      hidden: true,
    }),
    defineField({
      name: "dealType",
      title: "Deal type",
      type: "string",
      options: {
        list: [
          { title: "Sale", value: "sale" },
          { title: "Rent", value: "rent" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "floorPlanImage",
      title: "Floor plan",
      type: "accessibleImage",
    }),
    defineField({
      name: "photos",
      title: "Photos",
      type: "array",
      of: [defineArrayMember({ type: "accessibleImage" })],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "featured",
      title: "Featured on homepage",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      identifier: "identifier",
      layout: "layout",
      project: "project.name.cs",
      media: "photos.0",
    },
    prepare({ identifier, layout, project, media }) {
      return {
        title: `${identifier} · ${layout}`,
        subtitle: project,
        media,
      };
    },
  },
});
