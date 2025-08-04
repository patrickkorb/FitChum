'use client'

import { usePathname } from 'next/navigation'
import Navigation from './Navigation'

export default function ConditionalNavigation() {
  const pathname = usePathname()
  
  // Hide navigation on auth routes
  const hideNavigation = pathname.startsWith('/auth')
  
  if (hideNavigation) {
    return null
  }
  
  return <Navigation />
}