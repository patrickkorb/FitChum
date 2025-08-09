'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Dumbbell, BarChart3, Medal, User, Crown, LucideIcon } from 'lucide-react';

interface NavItem {
    name: string;
    link: string;
    icon: LucideIcon;
    shortName: string;
}

const navItems: NavItem[] = [
    { name: 'Journal', link: '/journal', icon: BookOpen, shortName: 'Journal' },
    { name: 'Plan', link: '/plan', icon: Dumbbell, shortName: 'Plan' },
    { name: 'Stats', link: '/dashboard', icon: BarChart3, shortName: 'Stats' },
    { name: 'Social', link: '/social', icon: Medal, shortName: 'Social' },
    { name: 'Profile', link: '/profile', icon: User, shortName: 'Profile' },
    { name: 'Pricing', link: '/pricing', icon: Crown, shortName: 'Pro' }
];

export default function MobileNavigation() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 z-50">
            <div className="grid grid-cols-6 px-2 py-2">
                {navItems.map((item) => {
                    const isActive = pathname.includes(item.link);
                    const Icon = item.icon;
                    
                    return (
                        <Link
                            key={item.name}
                            href={item.link}
                            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200 ${
                                isActive
                                    ? 'bg-primary text-white'
                                    : 'text-neutral-600 dark:text-neutral-400 hover:text-primary hover:bg-primary/10'
                            }`}
                        >
                            <Icon 
                                size={20} 
                                className={`mb-1 ${isActive ? 'text-white' : ''}`} 
                            />
                            <span className={`text-xs font-medium truncate w-full text-center ${
                                isActive ? 'text-white' : ''
                            }`}>
                                {item.shortName}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}