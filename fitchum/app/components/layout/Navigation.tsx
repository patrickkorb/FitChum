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
    label: 'Benachrichtigungen',
  },
  {
    href: '/profil',
    icon: '👤',
    label: 'Profil',
  },
];

export default function Navigation() {
  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen border-r border-border bg-background sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          FitChum
        </h1>
      </div>

      <nav className="flex flex-col gap-2 px-4 flex-1">
        {navItems.map((item) => (
          <NavElement
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Your fitness journey starts here
        </p>
      </div>
    </aside>
  );
}
