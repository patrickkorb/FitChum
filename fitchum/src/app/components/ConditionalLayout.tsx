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
  
  if (isAuthRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        {children}
      </div>
    );
  }
  
  // Main app layout - responsive
  return (
    <div className="min-h-screen">
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