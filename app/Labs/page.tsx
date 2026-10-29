import { LabsGrid } from '@/components/labs/labs-grid';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Labs',
};
function page() {
  return (
    <div><LabsGrid/></div>
  )
}

export default page