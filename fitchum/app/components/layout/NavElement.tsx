'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/app/lib/utils';

interface NavElementProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isMobile?: boolean;
}

export default function NavElement({ href, icon, label, isMobile = false }: NavElementProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  if (isMobile) {
    return (
      <Link
        href={href}
        className={cn(
          'flex flex-col items-center justify-center gap-1 py-2 px-3 transition-colors',
          isActive
            ? 'text-primary'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <span className="text-xl">{icon}</span>
        <span className="text-xs font-medium">{label}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
        isActive
          ? 'bg-primary text-primary-foreground font-medium'
          : 'text-foreground hover:bg-muted'
      )}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}
