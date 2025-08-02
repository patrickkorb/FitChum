import Image from "next/image";
import NavElement, {NavElementProps} from "@/app/components/NavElement";


export default function Navigation() {

    const navElements: NavElementProps[] = [
        {name: "Dashboard", link: "/home" },
        {name: "Plan", link: "/about" },
        {name: "Journal", link: "/Journal" },
        {name: "Social", link: "/social" },
        {name: "Profile", link: "/profile" },
    ]

    return (
        <>
            <div className={"grid gap-2"} style={{gridTemplateColumns: 'max-content'}}>
                <Image src={"/logo.png"} alt={"file"} width={80} height={80} className={"object-cover rounded-xl mb-4"} />
                {navElements.map((navElement: NavElementProps, index: number) => (
                    <NavElement
                        key={index}
                        name={navElement.name}
                        link={navElement.link}
                    />
                ))}
            </div>
        </>
    )
}