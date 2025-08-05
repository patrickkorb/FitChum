"use client"
import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import { BookOpen, Dumbbell, LayoutDashboard, Medal, User, Crown, LucideIcon } from "lucide-react";

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

export default function NavElement( {name, link, icon}: NavElementProps ) {

    const filepath = usePathname()
    const isActive = filepath.includes(link)
    const Icon = iconMap[icon]

    return (
        <>
            <Link href={link} className={`flex flex-row items-center gap-4 p-4 rounded-xl hover:cursor-pointer transition-all duration-200 ${
                isActive 
                    ? 'bg-primary text-white shadow-lg' 
                    : 'hover:bg-neutral-dark/10 dark:hover:bg-neutral-light/10 text-neutral-dark dark:text-neutral-light hover:shadow-md'
            }`}>
                <Icon size={24} className={`${isActive ? 'text-white' : 'text-neutral-dark/70 dark:text-neutral-light/70'}`} />
                <span className={"tracking-tight text-base font-medium"}>{name}</span>
            </Link>
        </>
    )
}