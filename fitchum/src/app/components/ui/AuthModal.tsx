'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, User, Mail, Lock, Target, Users, Trophy } from 'lucide-react';
import Button from './Button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  showSignupFirst?: boolean;
}

export default function AuthModal({ 
  isOpen, 
  onClose, 
  title = "Ready to Start Your Fitness Journey?", 
  message = "Create an account to save your personalized workout plan and track your progress!",
  showSignupFirst = true 
}: AuthModalProps) {
  const [isSignup, setIsSignup] = useState(showSignupFirst);
  const router = useRouter();

  if (!isOpen) return null;

  const handleSignup = () => {
    router.push('/auth/login');
    onClose();
  };

  const handleLogin = () => {
    router.push('/auth/login');
    onClose();
  };

  const features = [
    {
      icon: Target,
      title: "Personalized Plans",
      description: "Custom workout plans tailored to your goals"
    },
    {
      icon: Trophy,
      title: "Track Progress", 
      description: "Monitor your streaks and achievements"
    },
    {
      icon: Users,
      title: "Social Community",
      description: "Connect with friends and stay motivated"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-dark w-full max-w-lg mx-auto rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative p-6 pb-4 bg-gradient-to-br from-primary/10 to-secondary/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <X size={20} className="text-neutral-dark/70 dark:text-neutral-light/70" />
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-neutral-dark dark:text-neutral-light mb-2">
              {title}
            </h2>
            <p className="text-neutral-dark/70 dark:text-neutral-light/70">
              {message}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="px-6 py-4">
          <div className="space-y-4">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-0.5">
                    <IconComponent size={16} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-dark dark:text-neutral-light text-sm">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-neutral-dark/70 dark:text-neutral-light/70">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 pt-4 space-y-3">
          <Button
            onClick={handleSignup}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3"
          >
            <User size={18} className="mr-2" />
            Create Account - It's Free!
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-neutral-dark/10 dark:bg-neutral-light/10"></div>
            <span className="text-xs text-neutral-dark/50 dark:text-neutral-light/50">or</span>
            <div className="flex-1 h-px bg-neutral-dark/10 dark:bg-neutral-light/10"></div>
          </div>
          
          <Button
            onClick={handleLogin}
            variant="outline"
            className="w-full py-3"
          >
            <Mail size={18} className="mr-2" />
            I Already Have an Account
          </Button>
          
          <p className="text-xs text-center text-neutral-dark/60 dark:text-neutral-light/60">
            Join thousands of fitness enthusiasts achieving their goals!
          </p>
        </div>
      </div>
    </div>
  );
}