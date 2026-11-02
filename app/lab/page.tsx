import { LabsGrid } from "@/components/labs/labs-grid";
import { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageJsonLd } from "@/components/seo/page-json-ld";
const title = "Interactive SQL and MongoDB Practice Labs";
const description =
  "Practice SQL queries and MongoDB document operations in interactive browser labs. Explore beginner-friendly lessons in relational and document databases.";
export const metadata: Metadata = pageMetadata(title, description, "/lab");
function page() {
  return (
    <>
      <PageJsonLd title={title} description={description} path="/lab" />
      <div>
        <LabsGrid />
      </div>
    </>
  );
}

export default page;
