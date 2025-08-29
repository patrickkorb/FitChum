'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import ConditionalNavigation from './ConditionalNavigation';
import MobileNavigation from './MobileNavigation';
import TrialWrapper from './trial/TrialWrapper';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  
  const isAuthRoute = pathname.startsWith('/auth');
  const isLandingPage = pathname === '/';

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
      setLoading(false);
    };
    getUser();
  }, [supabase.auth]);
  
  if (isAuthRoute || isLandingPage) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-light to-primary/5 dark:from-neutral-dark dark:to-primary/10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Main app layout - responsive with proper container wrapped in TrialWrapper
  return (
    <TrialWrapper currentUserId={userId}>
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
    </TrialWrapper>
  );
}