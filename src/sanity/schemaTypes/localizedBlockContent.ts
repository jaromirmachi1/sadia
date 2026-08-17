import { defineArrayMember, defineField, defineType } from "sanity";

const blockContent = [
  defineArrayMember({
    type: "block",
    styles: [
      { title: "Normal", value: "normal" },
      { title: "Heading 2", value: "h2" },
      { title: "Heading 3", value: "h3" },
    ],
  }),
];

export const localizedBlockContent = defineType({
  name: "localizedBlockContent",
  title: "Localized rich text",
  type: "object",
  fields: [
    defineField({
      name: "cs",
      title: "Czech",
      type: "array",
      of: blockContent,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "en",
      title: "English",
      type: "array",
      of: blockContent,
      validation: (rule) => rule.required(),
    }),
  ],
});
