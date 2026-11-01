import { Metadata } from 'next';
import React from 'react'
export const metadata: Metadata = {
  title: 'Learning analytics',
  description: 'View your Labs learning activity.',
  robots: { index: false, follow: false },
};
function page() {
  return (
    <div>page</div>
  )
}

export default page
