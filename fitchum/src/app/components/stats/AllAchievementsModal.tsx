'use client';

import { useState } from 'react';
import { X, Trophy, Target, Calendar, Clock, TrendingUp } from 'lucide-react';
import Button from '../ui/Button';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  requirement: number;
  userValue: number;
  unlocked: boolean;
  category: 'streak' | 'workouts' | 'consistency' | 'duration';
}

interface AllAchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
}

const categoryInfo = {
  streak: { name: 'Streak Masters', icon: Trophy, description: 'Consistency is key to fitness success' },
  workouts: { name: 'Workout Warriors', icon: TrendingUp, description: 'Total workout milestones' },
  consistency: { name: 'Consistency Champions', icon: Calendar, description: 'Regular training achievements' },
  duration: { name: 'Time Keepers', icon: Clock, description: 'Duration-based accomplishments' }
};

export default function AllAchievementsModal({ isOpen, onClose, achievements }: AllAchievementsModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'streak' | 'workouts' | 'consistency' | 'duration'>('all');

  if (!isOpen) return null;

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-dark w-full max-w-4xl mx-auto rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-dark/10 dark:border-neutral-light/10">
          <div>
            <h2 className="text-2xl font-bold text-neutral-dark dark:text-neutral-light">
              All Achievements
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {unlockedCount} of {totalCount} achievements unlocked
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-dark/5 dark:hover:bg-neutral-light/5 transition-colors"
          >
            <X size={20} className="text-neutral-dark/70 dark:text-neutral-light/70" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-800/50">
          <div className="flex items-center justify-between text-sm text-neutral-600 dark:text-neutral-400 mb-2">
            <span>Overall Progress</span>
            <span>{Math.round((unlockedCount / totalCount) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
              style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex border-b border-neutral-dark/10 dark:border-neutral-light/10 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex-shrink-0 px-4 sm:px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-neutral-dark/70 dark:text-neutral-light/70 hover:text-neutral-dark dark:hover:text-neutral-light'
            }`}
          >
            All ({totalCount})
          </button>
          {Object.entries(categoryInfo).map(([key, info]) => {
            const count = achievements.filter(a => a.category === key).length;
            const IconComponent = info.icon;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key as 'streak' | 'workouts' | 'consistency' | 'duration')}
                className={`flex-shrink-0 px-4 sm:px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === key
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-neutral-dark/70 dark:text-neutral-light/70 hover:text-neutral-dark dark:hover:text-neutral-light'
                }`}
              >
                <div className="flex items-center gap-2">
                  <IconComponent size={16} />
                  <span className="hidden sm:inline">{info.name}</span>
                  <span className="sm:hidden">{key}</span>
                  <span>({count})</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Achievement Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {selectedCategory !== 'all' && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-neutral-dark dark:text-neutral-light mb-2">
                {categoryInfo[selectedCategory as keyof typeof categoryInfo].name}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {categoryInfo[selectedCategory as keyof typeof categoryInfo].description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAchievements.map((achievement) => {
              const IconComponent = achievement.icon;
              const progress = Math.min((achievement.userValue / achievement.requirement) * 100, 100);
              
              return (
                <div
                  key={achievement.id}
                  className={`relative group p-4 rounded-xl border transition-all duration-200 hover:shadow-lg ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br ' + achievement.color + ' text-white border-transparent shadow-md hover:scale-105'
                      : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    {/* Icon */}
                    <div className={`p-3 rounded-full ${
                      achievement.unlocked 
                        ? 'bg-white/20' 
                        : 'bg-gradient-to-br ' + achievement.color + ' opacity-20'
                    }`}>
                      <IconComponent 
                        size={24} 
                        className={achievement.unlocked ? 'text-white' : 'text-neutral-600 dark:text-neutral-400'} 
                      />
                    </div>

                    {/* Title and Description */}
                    <div>
                      <h4 className={`font-semibold text-sm mb-1 ${
                        achievement.unlocked 
                          ? 'text-white' 
                          : 'text-neutral-dark dark:text-neutral-light'
                      }`}>
                        {achievement.title}
                      </h4>
                      <p className={`text-xs leading-relaxed ${
                        achievement.unlocked 
                          ? 'text-white/90' 
                          : 'text-neutral-600 dark:text-neutral-400'
                      }`}>
                        {achievement.description}
                      </p>
                    </div>

                    {/* Progress */}
                    <div className="w-full">
                      {achievement.unlocked ? (
                        <div className="flex items-center justify-center gap-1 text-white/90">
                          <Trophy size={14} />
                          <span className="text-xs font-medium">Unlocked!</span>
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                            <span>{achievement.userValue}</span>
                            <span>{achievement.requirement}</span>
                          </div>
                          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full bg-gradient-to-r ${achievement.color} transition-all duration-500`}
                              style={{ width: `${Math.max(progress, 5)}%` }}
                            />
                          </div>
                          <div className="text-center mt-1">
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                              {Math.round(progress)}% complete
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shine effect for unlocked achievements */}
                  {achievement.unlocked && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </div>
              );
            })}
          </div>

          {filteredAchievements.length === 0 && (
            <div className="text-center py-12 text-neutral-600 dark:text-neutral-400">
              <Target size={48} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No achievements in this category yet</h3>
              <p>Keep working out to unlock achievements!</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-dark/10 dark:border-neutral-light/10 bg-neutral-50 dark:bg-neutral-800/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-neutral-600 dark:text-neutral-400 text-center sm:text-left">
              Keep working out to unlock more achievements!
            </div>
            <Button
              onClick={onClose}
              variant="primary"
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}