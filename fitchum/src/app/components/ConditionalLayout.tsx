'use client';

import { usePathname } from 'next/navigation';
import ConditionalNavigation from './ConditionalNavigation';
import MobileNavigation from './MobileNavigation';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  const isAuthRoute = pathname.startsWith('/auth');
  const isLandingPage = pathname === '/';
  
  if (isAuthRoute || isLandingPage) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }
  
  // Main app layout - responsive with proper container
  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-5 lg:gap-4 lg:min-h-screen">
        <ConditionalNavigation />
        <main className="lg:col-span-4 lg:px-4">
          {children}
        </main>
      </div>
      
      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col min-h-screen">
        <main className="flex-1 px-4 pb-20">
          {children}
        </main>
        <MobileNavigation />
      </div>
    </div>
  );
}