import Image from "next/image";
import Link from "next/link";

export interface NavElementProps {
    name: string;
    link: string;
}

export default function NavElement( {name, link}: NavElementProps ) {
    return (
        <>
            <Link href={link} className="flex flex-row items-center gap-4 p-4 rounded-lg hover:bg-white/20 hover:cursor-pointer hover:opacity-80 transition">
                <Image src={"/file.svg"} alt={""} width={30} height={30} />
                <span className={"tracking-tight text-lg"}>{name.toUpperCase()}</span>
            </Link>
        </>
    )
}