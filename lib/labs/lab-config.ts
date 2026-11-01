export type LabSlug = "sql" | "mongodb";

export type LabConfig = {
  slug: LabSlug;
  title: string;
  description: string;
  editorType: "sql" | "mongodb";
};

export const labConfig: Record<LabSlug, LabConfig> = {
  sql: {
    slug: "sql",
    title: "SQL Playground",
    description: "Learn and practice SQL queries",
    editorType: "sql",
  },

  mongodb: {
    slug: "mongodb",
    title: "MongoDB Playground",
    description: "Learn and practice MongoDB queries",
    editorType: "mongodb",
  },
};

export function isLabSlug(slug: string): slug is LabSlug {
  return slug in labConfig;
}
