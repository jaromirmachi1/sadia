import { defineField, defineType } from "sanity";

export const accessibleImage = defineType({
  name: "accessibleImage",
  title: "Image",
  type: "image",
  options: {
    hotspot: true,
  },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "localizedString",
      description: "Describe the image for accessibility and search engines.",
      validation: (rule) => rule.required(),
    }),
  ],
});
