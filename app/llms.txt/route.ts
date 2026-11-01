import { absoluteUrl, seoConfig } from "@/lib/seo";

export function GET() {
  if (!seoConfig.siteUrl) {
    return new Response("Set NEXT_PUBLIC_SITE_URL to enable llms.txt.\n", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const content = [
    "# Labs",
    "",
    "> Labs offers interactive SQL and MongoDB lessons, query practice, and beginner database learning resources.",
    "",
    "## Learning resources",
    "",
    `- [Labs home](${absoluteUrl("/")}): Overview of interactive SQL and MongoDB learning and hands-on database practice.`,
    `- [Interactive practice labs](${absoluteUrl("/labs")}): Browse SQL and MongoDB browser-based lessons and practice tools.`,
    `- [Interactive SQL practice lab](${absoluteUrl("/labs/sql")}): Work through SQL lessons and practice query writing in the browser.`,
    `- [Interactive MongoDB practice lab](${absoluteUrl("/labs/mongodb")}): Practice document queries and MongoDB aggregation in the browser.`,
    `- [Learn SQL, MongoDB, and databases](${absoluteUrl("/Learn")}): Browse beginner notes, MongoDB tutorials, database guides, comparisons, and practice questions.`,
    `- [SQL basics for beginners](${absoluteUrl("/Learn/sql-basics-for-beginners")}): Learn SELECT, filtering, sorting, and grouping through beginner examples.`,
    `- [SQL practice questions](${absoluteUrl("/Learn/sql-practice-questions-beginners")}): Try beginner query exercises with worked answers.`,
    `- [MongoDB basics](${absoluteUrl("/Learn/mongodb-basics-for-beginners")}): Learn documents, collections, BSON, and the MongoDB data model.`,
    `- [MongoDB CRUD operations](${absoluteUrl("/Learn/mongodb-crud-operations")}): Learn to create, read, update, and delete MongoDB documents.`,
    `- [MongoDB data modeling](${absoluteUrl("/Learn/mongodb-data-modeling-basics")}): Compare embedding and references using application access patterns.`,
    `- [MongoDB aggregation pipeline](${absoluteUrl("/Learn/mongodb-aggregation-pipeline")}): Understand filtering, grouping, and sorting with pipeline stages.`,
    "",
    "## Key facts",
    "",
    "- Current focus: SQL and MongoDB learning and interactive database practice.",
    "- Intended for students and people learning SQL fundamentals.",
    "- Labs currently has interactive SQL and MongoDB practice tracks.",
    "",
  ].join("\n");

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
