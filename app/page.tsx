import LandingPage from "@/components/blocks/landingpage"
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageJsonLd } from "@/components/seo/page-json-ld";

const title = "Learn SQL and MongoDB with Hands-on Database Labs";
const description = "Practice SQL and MongoDB in interactive database labs. Learn queries, document operations, filtering, joins, and aggregation through hands-on lessons for students and beginner developers.";

export const metadata: Metadata = pageMetadata(title, description, "/");

export default function Home() {
  return (
    <>
      <PageJsonLd title={title} description={description} path="/" />
    <LandingPage/>
    </>
  )
}
