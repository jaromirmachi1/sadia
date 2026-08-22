import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "companyName",
      title: "Company name",
      type: "string",
      initialValue: "SADIA",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "address",
      title: "Registered address",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "registrationNumber",
      title: "Company registration number (IČ)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "vatNumber",
      title: "VAT number (DIČ)",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      initialValue: "adam@sadiaestate.cz",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      initialValue: "+420 607 100 886",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [
        defineArrayMember({
          name: "socialLink",
          title: "Social link",
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) =>
                rule.required().uri({ scheme: ["https"] }),
            }),
          ],
          preview: {
            select: {
              title: "platform",
              subtitle: "url",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "footerNavigation",
      title: "Footer navigation",
      type: "array",
      of: [
        defineArrayMember({
          name: "footerLink",
          title: "Footer link",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "localizedString",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "href",
              title: "Path",
              type: "string",
              description: "Internal path beginning with /.",
              validation: (rule) =>
                rule.required().regex(/^\//, {
                  name: "internal path",
                }),
            }),
          ],
          preview: {
            select: {
              title: "label.cs",
              subtitle: "href",
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Site settings",
      };
    },
  },
});
