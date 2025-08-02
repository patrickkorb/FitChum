"use client"
import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";

export interface NavElementProps {
    name: string;
    link: string;
}

export default function NavElement( {name, link}: NavElementProps ) {

    const filepath = usePathname()
    const isActive = filepath.includes(link)

    return (
        <>
            <Link href={link} className={`flex flex-row items-center gap-4 p-4 rounded-lg hover:cursor-pointer transition ${
                isActive 
                    ? 'bg-primary text-white' 
                    : 'hover:bg-white/20 hover:opacity-80'
            }`}>
                <Image src={"/file.svg"} alt={""} width={30} height={30} />
                <span className={"tracking-tight text-lg"}>{name.toUpperCase()}</span>
            </Link>
        </>
    )
}