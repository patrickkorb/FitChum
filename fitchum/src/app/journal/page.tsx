"use client"
import Image from "next/image";
import {CirclePlus, Zap} from "lucide-react"
import { useState, useEffect } from "react"

export default function Journal() {
    const motivationalMessages: string[] = [
        "Ready to crush todays workout?",
        "How did your workout go today?",
        "Time to turn up the heat!",
        "Your future self will thank you!",
        "Every rep counts towards your goal!",
        "Let's make today legendary!"
    ]

    const [currentMessage, setCurrentMessage] = useState<number>(0)
    const [isVisible, setIsVisible] = useState<boolean>(true)

    useEffect(() => {
        const interval: NodeJS.Timeout = setInterval(() => {
            setIsVisible(false)
            setTimeout(() => {
                setCurrentMessage((prev) => (prev + 1) % motivationalMessages.length)
                setIsVisible(true)
            }, 300)
        }, 4000)

        return () => clearInterval(interval)
    }, [])

    return (
        <>
            <div className={"col-span-3 flex flex-col items-center justify-center min-h-[80vh] px-8"}>
                <div className={"flex flex-col gap-12 items-center max-w-2xl mx-auto text-center"}>
                    
                    {/* Title Section */}
                    <div className={"space-y-4"}>
                        <div className={"inline-flex items-center gap-3 bg-neutral-dark/5 dark:bg-neutral-light/10 px-6 py-3 rounded-full border border-neutral-dark/10 dark:border-neutral-light/20"}>
                            <div className={"w-3 h-3 bg-secondary rounded-full animate-pulse"}></div>
                            <span className={"text-neutral-dark dark:text-neutral-light font-semibold text-lg"}>Today's Entry</span>
                            <span className={"text-neutral-dark/70 dark:text-neutral-light/70 font-medium"}>• Not logged yet</span>
                        </div>
                    </div>

                    {/* Rotating Motivational Message */}
                    <div className={"h-24 flex items-center justify-center"}>
                        <h1 className={`text-5xl font-bold text-neutral-dark dark:text-neutral-light transition-all duration-300 ${
                            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'
                        }`}>
                            {motivationalMessages[currentMessage]}
                        </h1>
                    </div>
                    
                    {/* CTA Section */}
                    <div className={"flex flex-col items-center gap-8"}>
                        
                        <button className={"bg-primary hover:cursor-pointer hover:bg-primary/90 text-white font-bold py-6 px-12 rounded-2xl text-2xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center gap-4 group"}>
                            <CirclePlus size={32} className={"group-hover:rotate-90 transition-transform duration-300"} />
                            Log Todays Workout
                        </button>
                        
                        <div className={"flex items-center gap-2 text-lg text-neutral-dark/80 dark:text-neutral-light/80"}>
                            <span>Track your progress</span>
                            <span>•</span>
                            <span>Stay accountable</span>
                            <span>•</span>
                            <span>Inspire others</span>
                        </div>
                    </div>

                    {/* Streak Motivation */}
                    <div className={"mt-8 p-6 bg-neutral-dark/5 dark:bg-neutral-light/5 rounded-2xl border-2 border-neutral-dark/10 dark:border-neutral-light/10"}>
                        <div className={"flex items-center justify-center gap-3 mb-2"}>
                            <Zap className={"text-neutral-dark dark:text-neutral-light"} size={24} />
                            <span className={"text-neutral-dark dark:text-neutral-light font-bold text-xl"}>Keep Your Streak Alive!</span>
                            <Zap className={"text-neutral-dark dark:text-neutral-light"} size={24} />
                        </div>
                        <p className={"text-neutral-dark/80 dark:text-neutral-light/80 text-lg"}>
                            Dont let today be the day you break your momentum. Every workout counts!
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}