'use client';

import NavElement from './NavElement';

const navItems = [
  {
    href: '/feed',
    icon: '🏠',
    label: 'Feed',
  },
  {
    href: '/workout',
    icon: '💪',
    label: 'Workout',
  },
  {
    href: '/verlauf',
    icon: '📊',
    label: 'Verlauf',
  },
  {
    href: '/benachrichtigungen',
    icon: '🔔',
    label: 'Benach.',
  },
  {
    href: '/profil',
    icon: '👤',
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
