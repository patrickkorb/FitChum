'use client';

import React from 'react';
import Image from 'next/image';
import NavElement, { NavElementProps } from '@/app/components/NavElement';

const navElements: NavElementProps[] = [
    { name: 'Journal', link: '/journal', icon: 'BookOpen' },
    { name: 'Plan', link: '/plan', icon: 'Dumbbell' },
    { name: 'Stats', link: '/dashboard', icon: 'BarChart3' },
    { name: 'Social', link: '/social', icon: 'Medal' },
    { name: 'Profile', link: '/profile', icon: 'User' },
    { name: 'Pricing', link: '/pricing', icon: 'Crown' }
];

export default function Navigation() {
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