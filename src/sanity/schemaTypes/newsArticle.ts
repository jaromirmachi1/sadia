import { defineField, defineType } from "sanity";

export const newsArticle = defineType({
  name: "newsArticle",
  title: "Aktuality",
  type: "document",
  fieldsets: [
    { name: "content", title: "Content" },
    { name: "meta", title: "Publishing" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localizedString",
      validation: (rule) => rule.required(),
      fieldset: "content",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title.cs",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
      fieldset: "content",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "localizedString",
      description: "Short summary shown in the news listing.",
      validation: (rule) => rule.required(),
      fieldset: "content",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "localizedBlockContent",
      validation: (rule) => rule.required(),
      fieldset: "content",
    }),
    defineField({
      name: "heroImage",
      title: "Cover image",
      type: "accessibleImage",
      validation: (rule) => rule.required(),
      fieldset: "content",
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      validation: (rule) => rule.required(),
      fieldset: "meta",
    }),
    defineField({
      name: "relatedProject",
      title: "Related project",
      type: "reference",
      to: [{ type: "project" }],
      fieldset: "meta",
    }),
  ],
  orderings: [
    {
      title: "Published date, newest",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title.cs",
      subtitle: "publishedAt",
      media: "heroImage",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle
          ? new Date(subtitle).toLocaleDateString("cs-CZ")
          : undefined,
        media,
      };
    },
  },
});
