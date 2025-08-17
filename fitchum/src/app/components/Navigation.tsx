'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import NavElement, { NavElementProps } from '@/app/components/NavElement';
import { createClient } from '@/lib/supabase/client';

const baseNavElements: NavElementProps[] = [
    { name: 'Journal', link: '/journal', icon: 'BookOpen' },
    { name: 'Plan', link: '/plan', icon: 'Dumbbell' },
    { name: 'Stats', link: '/stats', icon: 'BarChart3' },
    { name: 'Social', link: '/social', icon: 'Medal' },
    { name: 'Profile', link: '/profile', icon: 'User' }
];

const pricingNavElement: NavElementProps = { name: 'Pricing', link: '/pricing', icon: 'Crown' };

export default function Navigation() {
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

    // Show all elements while loading, then filter based on subscription
    const navElements = isProUser === null 
        ? [...baseNavElements, pricingNavElement] // Show all while loading
        : isProUser 
            ? baseNavElements // Pro users don't see pricing
            : [...baseNavElements, pricingNavElement]; // Free users see pricing
    return (
        <aside className="sticky top-0 h-screen p-4">
            <div className="flex flex-col gap-2 h-full">
                <div className="flex items-center justify-center mb-6">
                    <Image 
                        src="/logo.png" 
                        alt="FitChum Logo" 
                        width={64} 
                        height={64} 
                        className="object-cover rounded-xl" 
                    />
                </div>
                
                <nav className="flex flex-col gap-2 flex-1">
                    {navElements.map((navElement) => (
                        <NavElement
                            key={navElement.link}
                            name={navElement.name}
                            link={navElement.link}
                            icon={navElement.icon}
                        />
                    ))}
                </nav>
            </div>
        </aside>
    );
}