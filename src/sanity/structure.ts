import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.documentTypeListItem("project").title("Projects"),
      S.documentTypeListItem("unit").title("Units"),
      S.divider(),
      S.listItem()
        .id("siteSettings")
        .title("Site settings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Site settings"),
        ),
    ]);
