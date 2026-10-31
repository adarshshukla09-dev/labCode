import { LabsGrid } from '@/components/labs/labs-grid';
import { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { PageJsonLd } from '@/components/seo/page-json-ld';
const title = 'SQL Practice Labs for Students and Beginners';
const description = 'Open the interactive SQL practice lab and work through query lessons covering filtering, joins, and database fundamentals.';
export const metadata: Metadata = pageMetadata(title, description, '/Labs');
function page() {
  return (
    <>
      <PageJsonLd title={title} description={description} path="/Labs" />
      <div><LabsGrid/></div>
    </>
  )
}

export default page
