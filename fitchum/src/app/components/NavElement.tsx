'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Dumbbell, LayoutDashboard, Medal, User, Crown, LucideIcon } from 'lucide-react';

export interface NavElementProps {
    name: string;
    link: string;
    icon: string;
}

const iconMap: Record<string, LucideIcon> = {
    BookOpen,
    Dumbbell,
    LayoutDashboard,
    Medal,
    User,
    Crown,
};

export default function NavElement({ name, link, icon }: NavElementProps) {
    const pathname = usePathname();
    const isActive = pathname.includes(link);
    const Icon = iconMap[icon];

    return (
        <Link 
            href={link} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:text-primary dark:hover:text-primary'
            }`}
        >
            <Icon 
                size={20} 
                className={`flex-shrink-0 ${
                    isActive 
                        ? 'text-white' 
                        : 'text-neutral-500 dark:text-neutral-400 group-hover:text-primary'
                }`} 
            />
            <span className="font-medium text-sm truncate">
                {name}
            </span>
        </Link>
    );
}