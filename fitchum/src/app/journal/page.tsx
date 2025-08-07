'use client';

import { CirclePlus, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import {createClient} from "@/lib/supabase/client";

const MOTIVATIONAL_MESSAGES = [
    'Ready to crush todays workout?',
    'How did your workout go today?',
    'Time to turn up the heat!',
    'Your future self will thank you!',
    'Every rep counts towards your goal!',
    "Let's make today legendary!"
];

export default function Journal() {

    const [currentMessage, setCurrentMessage] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false);
            setTimeout(() => {
                setCurrentMessage((prev) => (prev + 1) % MOTIVATIONAL_MESSAGES.length);
                setIsVisible(true);
            }, 300);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    const handleIt = async () => {
        const supabase = await createClient();
        const {data:user} = await supabase.auth.getUser();
        if (user) {
            console.log(user);
            const {data: profile} = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.user?.id)
                .single();
            if (profile) {
                console.log(profile);
            }
        }
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 sm:px-8 py-8">
                <div className="flex flex-col gap-8 sm:gap-12 items-center max-w-2xl mx-auto text-center w-full">
                    
                    {/* Title Section */}
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 sm:gap-3 bg-neutral-dark/5 dark:bg-neutral-light/10 px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-neutral-dark/10 dark:border-neutral-light/20">
                            <div className="w-3 h-3 bg-secondary rounded-full animate-pulse" />
                            <span className="text-neutral-dark dark:text-neutral-light font-semibold text-base sm:text-lg">Today&apos;s Entry</span>
                            <span className="text-neutral-dark/70 dark:text-neutral-light/70 font-medium text-sm sm:text-base hidden sm:inline">• Not logged yet</span>
                        </div>
                    </div>

                    {/* Rotating Motivational Message */}
                    <div className="h-20 sm:h-24 flex items-center justify-center px-4">
                        <h1 className={`text-2xl sm:text-4xl lg:text-5xl font-bold text-neutral-dark dark:text-neutral-light transition-all duration-300 text-center leading-tight ${
                            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'
                        }`}>
                            {MOTIVATIONAL_MESSAGES[currentMessage]}
                        </h1>
                    </div>
                    
                    {/* CTA Section */}
                    <div className="flex flex-col items-center gap-6 sm:gap-8 w-full">
                        <button className="bg-primary hover:cursor-pointer hover:bg-primary/90 text-white font-bold py-4 sm:py-6 px-8 sm:px-12 rounded-2xl text-lg sm:text-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 sm:gap-4 group w-full sm:w-auto max-w-sm"
                                onClick={handleIt}>
                            <CirclePlus size={24} className="sm:size-8 group-hover:rotate-90 transition-transform duration-300" />
                            <span className="truncate">Log Todays Workout</span>
                        </button>
                        
                        <div className="flex flex-wrap items-center justify-center gap-2 text-sm sm:text-lg text-neutral-dark/80 dark:text-neutral-light/80">
                            <span>Track your progress</span>
                            <span className="hidden sm:inline">•</span>
                            <span>Stay accountable</span>
                            <span className="hidden sm:inline">•</span>
                            <span>Inspire others</span>
                        </div>
                    </div>

                    {/* Streak Motivation */}
                    <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-neutral-dark/5 dark:bg-neutral-light/5 rounded-2xl border-2 border-neutral-dark/10 dark:border-neutral-light/10 w-full">
                        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
                            <Zap className="text-neutral-dark dark:text-neutral-light" size={20} />
                            <span className="text-neutral-dark dark:text-neutral-light font-bold text-lg sm:text-xl text-center">Keep Your Streak Alive!</span>
                            <Zap className="text-neutral-dark dark:text-neutral-light" size={20} />
                        </div>
                        <p className="text-neutral-dark/80 dark:text-neutral-light/80 text-base sm:text-lg text-center">
                            Don&apos;t let today be the day you break your momentum. Every workout counts!
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}