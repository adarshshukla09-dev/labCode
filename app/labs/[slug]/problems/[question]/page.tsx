import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'SQL Challenge',
  robots: { index: false, follow: false },
};

function Page() {
  notFound();
}

export default Page
