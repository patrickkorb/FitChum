'use client';

import { usePathname } from 'next/navigation';
import { useNavbar } from '@/app/contexts/NavbarContext';
import Navigation from './Navigation';
import MobileNavigation from './MobileNavigation';

export default function ConditionalNavigation() {
  const pathname = usePathname();
  const { isNavbarVisible } = useNavbar();

  // Don't show navigation on landing page
  if (pathname === '/') {
    return null;
  }

  // Don't show navigation when explicitly hidden (active workout)
  if (!isNavbarVisible) {
    return null;
  }

  return (
    <>
      <Navigation />
      <MobileNavigation />
    </>
  );
}
