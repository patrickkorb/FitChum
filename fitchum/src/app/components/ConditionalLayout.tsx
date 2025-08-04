'use client'

import { usePathname } from 'next/navigation'
import ConditionalNavigation from './ConditionalNavigation'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Check if we're on auth routes
  const isAuthRoute = pathname.startsWith('/auth')
  
  if (isAuthRoute) {
    // Auth layout - no navigation, no grid, full width
    return (
      <div className="min-h-screen">
        {children}
      </div>
    )
  }
  
  // Main app layout - with navigation and grid
  return (
    <div className="grid grid-cols-5 gap-4">
      <ConditionalNavigation />
      {children}
    </div>
  )
}