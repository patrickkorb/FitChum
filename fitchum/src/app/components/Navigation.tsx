import Image from "next/image";
import NavElement, {NavElementProps} from "@/app/components/NavElement";


export default function Navigation() {

    const navElements: NavElementProps[] = [
        {name: "Journal", link: "/journal", icon: "BookOpen" },
        {name: "Plan", link: "/plan", icon: "Calendar" },
        {name: "Dashboard", link: "/dashboard", icon: "LayoutDashboard" },
        {name: "Social", link: "/social", icon: "Users" },
        {name: "Profile", link: "/profile", icon: "User" },
    ]

    return (
        <>
            <div className={"grid gap-2 h-fit"} style={{gridTemplateColumns: 'max-content'}}>
                <Image src={"/logo.png"} alt={"file"} width={80} height={80} className={"object-cover rounded-xl mb-4"} />
                {navElements.map((navElement: NavElementProps, index: number) => (
                    <NavElement
                        key={index}
                        name={navElement.name}
                        link={navElement.link}
                        icon={navElement.icon}
                    />
                ))}
            </div>
        </>
    )
}