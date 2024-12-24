import { Metadata } from "next";
import { ReactNode } from "react"
import {Footer, Navbar} from "@/components"

export const metadata: Metadata = {
    title: "Space2Heaven: Your Dream Home Awaits",
    description: "Find your perfect space with Space2Heaven – your trusted partner in buying and selling properties tailored just for you.",
    icons: {
        icon: "/logo.svg"
    }
};
const HomeLayout = ({ children }: { children: ReactNode }) => {
    return (
        <main>
            <Navbar />
            <div className="flex">
                <section className="w-full min-h-screen flex-1 flex-col">
                        {children}
                </section>
            </div>
            <Footer />
        </main>
    )
}
export default HomeLayout