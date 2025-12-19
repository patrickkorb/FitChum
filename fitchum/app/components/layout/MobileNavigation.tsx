'use client';

import { Home, Dumbbell, BarChart3, Bell, User } from 'lucide-react';
import NavElement from './NavElement';

const navItems = [
  {
    href: '/feed',
    icon: <Home size={20} />,
    label: 'Feed',
  },
  {
    href: '/workout',
    icon: <Dumbbell size={20} />,
    label: 'Workout',
  },
  {
    href: '/verlauf',
    icon: <BarChart3 size={20} />,
    label: 'Verlauf',
  },
  {
    href: '/benachrichtigungen',
    icon: <Bell size={20} />,
    label: 'Benach.',
  },
  {
    href: '/profil',
    icon: <User size={20} />,
    label: 'Profil',
  },
];

export default function MobileNavigation() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex items-center justify-around max-w-screen-sm mx-auto">
        {navItems.map((item) => (
          <NavElement
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isMobile
          />
        ))}
      </div>
    </nav>
  );
}
