'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';
import MobileNavigation from './MobileNavigation';

export default function ConditionalNavigation() {
  const pathname = usePathname();

  // Don't show navigation on landing page
  if (pathname === '/') {
    return null;
  }

  return (
    <>
      <Navigation />
      <MobileNavigation />
    </>
  );
}
