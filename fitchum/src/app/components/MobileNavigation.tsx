'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Dumbbell, BarChart3, Medal, User, Crown, LucideIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface NavItem {
    name: string;
    link: string;
    icon: LucideIcon;
    shortName: string;
}

const baseNavItems: NavItem[] = [
    { name: 'Journal', link: '/journal', icon: BookOpen, shortName: 'Journal' },
    { name: 'Plan', link: '/plan', icon: Dumbbell, shortName: 'Plan' },
    { name: 'Stats', link: '/stats', icon: BarChart3, shortName: 'Stats' },
    { name: 'Social', link: '/social', icon: Medal, shortName: 'Social' },
    { name: 'Profile', link: '/profile', icon: User, shortName: 'Profile' }
];

const pricingNavItem: NavItem = { name: 'Pricing', link: '/pricing', icon: Crown, shortName: 'Pro' };

export default function MobileNavigation() {
    const pathname = usePathname();
    const [isProUser, setIsProUser] = useState<boolean | null>(null);
    const supabase = createClient();

    useEffect(() => {
        checkUserSubscription();
    }, []);

    const checkUserSubscription = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) {
                // Not authenticated - show pricing
                setIsProUser(false);
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('subscription_plan')
                .eq('user_id', user.id)
                .single();

            setIsProUser(profile?.subscription_plan === 'pro');
        } catch (error) {
            console.error('Error checking subscription:', error);
            // Default to showing pricing on error
            setIsProUser(false);
        }
    };

    // Show all items while loading, then filter based on subscription
    const navItems = isProUser === null 
        ? [...baseNavItems, pricingNavItem] // Show all while loading
        : isProUser 
            ? baseNavItems // Pro users don't see pricing
            : [...baseNavItems, pricingNavItem]; // Free users see pricing

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 z-50">
            <div className={`grid px-2 py-2 ${navItems.length === 6 ? 'grid-cols-6' : 'grid-cols-5'}`}>
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