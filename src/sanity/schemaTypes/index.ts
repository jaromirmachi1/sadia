import type { SchemaTypeDefinition } from "sanity";

import { accessibleImage } from "./accessibleImage";
import { localizedBlockContent } from "./localizedBlockContent";
import { localizedString } from "./localizedString";
import { project } from "./project";
import { siteSettings } from "./siteSettings";
import { unit } from "./unit";

export const schemaTypes: SchemaTypeDefinition[] = [
  localizedString,
  localizedBlockContent,
  accessibleImage,
  project,
  unit,
  siteSettings,
];
