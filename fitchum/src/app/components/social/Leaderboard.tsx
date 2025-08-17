'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getUserPlan, isPro } from '@/lib/subscription';
import { Trophy, Medal, Award, Crown, Lock } from 'lucide-react';
import Button from '../ui/Button';

interface LeaderboardProps {
  currentUserId?: string | null;
}

type LeaderboardEntry = {
  user_id: string;
  username: string;
  current_streak: number;
  profile_pic_url?: string;
  rank: number;
};

export default function Leaderboard({ currentUserId }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'friends'>('all');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userHasPro, setUserHasPro] = useState(false);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const checkProStatus = async () => {
      if (!currentUserId) return;
      
      const userPlan = await getUserPlan(currentUserId);
      setUserHasPro(isPro(userPlan));
    };

    checkProStatus();
  }, [currentUserId]);


  const fetchGlobalLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, username, current_streak, profile_pic_url')
        .order('current_streak', { ascending: false })
        .limit(50);

      if (error) throw error;

      const leaderboard: LeaderboardEntry[] = data?.map((profile, index) => ({
        ...profile,
        username: profile.username || `User ${profile.user_id.slice(-4)}`,
        rank: index + 1
      })) || [];

      setLeaderboardData(leaderboard);
      
      if (currentUserId) {
        const currentUserEntry = leaderboard.find(entry => entry.user_id === currentUserId);
        setCurrentUserRank(currentUserEntry?.rank || null);
      }
    } catch (error) {
      console.error('Error fetching global leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUserId, supabase]);

  const fetchFriendsLeaderboard = useCallback(async () => {
    if (!currentUserId) return;
    
    setLoading(true);
    try {
      // Get current user's friends
      const { data: friendships, error: friendshipsError } = await supabase
        .from('friendships')
        .select('requester_id, addressee_id')
        .or(`requester_id.eq.${currentUserId},addressee_id.eq.${currentUserId}`)
        .eq('status', 'accepted');

      if (friendshipsError) throw friendshipsError;

      const friendIds = friendships?.map(friendship => 
        friendship.requester_id === currentUserId 
          ? friendship.addressee_id 
          : friendship.requester_id
      ) || [];

      // Add current user to the list
      friendIds.push(currentUserId);

      if (friendIds.length === 0) {
        setLeaderboardData([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, username, current_streak, profile_pic_url')
        .in('user_id', friendIds)
        .order('current_streak', { ascending: false });

      if (error) throw error;

      const leaderboard: LeaderboardEntry[] = data?.map((profile, index) => ({
        user_id: profile.user_id,
        username: profile.username || `User ${profile.user_id.slice(-4)}`,
        current_streak: profile.current_streak,
        profile_pic_url: profile.profile_pic_url,
        rank: index + 1
      })) || [];

      setLeaderboardData(leaderboard);
      
      const currentUserEntry = leaderboard.find(entry => entry.user_id === currentUserId);
      setCurrentUserRank(currentUserEntry?.rank || null);

    } catch (error) {
      console.error('Error fetching friends leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUserId, supabase]);

  useEffect(() => {
    if (activeTab === 'all') {
      fetchGlobalLeaderboard();
    } else {
      fetchFriendsLeaderboard();
    }
  }, [activeTab, fetchGlobalLeaderboard, fetchFriendsLeaderboard]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-500" size={24} />;
      case 2:
        return <Trophy className="text-gray-400" size={20} />;
      case 3:
        return <Medal className="text-amber-600" size={20} />;
      default:
        return <Award className="text-neutral-dark/50 dark:text-neutral-light/50" size={18} />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default:
        return 'bg-neutral-dark/5 dark:bg-neutral-light/5';
    }
  };

  const handleTabChange = (tab: 'all' | 'friends') => {
    if (tab === 'friends' && !userHasPro) {
      return;
    }
    setActiveTab(tab);
  };

  const shouldUseFixedHeight = leaderboardData.length > 5;

  return (
    <div className={`space-y-4 sm:space-y-6 ${shouldUseFixedHeight ? 'h-[600px] flex flex-col' : ''}`}>
      <div className={`flex items-center justify-between ${shouldUseFixedHeight ? 'flex-shrink-0' : ''}`}>
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-dark dark:text-neutral-light">
          Streak Leaderboard
        </h2>
        {currentUserRank && (
          <div className="text-sm text-neutral-dark/70 dark:text-neutral-light/70">
            Your rank: #{currentUserRank}
          </div>
        )}
      </div>

      <div className={`flex space-x-1 bg-neutral-dark/5 dark:bg-neutral-light/5 p-1 rounded-lg ${shouldUseFixedHeight ? 'flex-shrink-0' : ''}`}>
        <button
          onClick={() => handleTabChange('all')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'all'
              ? 'bg-white dark:bg-neutral-dark text-neutral-dark dark:text-neutral-light shadow'
              : 'text-neutral-dark/70 dark:text-neutral-light/70'
          }`}
        >
          All Users
        </button>
        <button
          onClick={() => handleTabChange('friends')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors relative ${
            activeTab === 'friends'
              ? 'bg-white dark:bg-neutral-dark text-neutral-dark dark:text-neutral-light shadow'
              : 'text-neutral-dark/70 dark:text-neutral-light/70'
          } ${!userHasPro ? 'opacity-60' : ''}`}
          disabled={!userHasPro}
        >
          <span className="flex items-center gap-2 justify-center">
            Friends
            {!userHasPro && <Lock size={14} />}
          </span>
        </button>
      </div>

      {!userHasPro && activeTab === 'friends' && (
        <div className="text-center py-8 px-4 bg-neutral-dark/5 dark:bg-neutral-light/5 rounded-lg border-2 border-dashed border-neutral-dark/20 dark:border-neutral-light/20">
          <Lock className="mx-auto mb-4 text-neutral-dark/50 dark:text-neutral-light/50" size={48} />
          <h3 className="text-lg font-semibold text-neutral-dark dark:text-neutral-light mb-2">
            Friends Leaderboard
          </h3>
          <p className="text-neutral-dark/70 dark:text-neutral-light/70 mb-4 max-w-md mx-auto">
            Upgrade to Pro to see how you stack up against your friends and create custom challenges together.
          </p>
          <Button variant="primary" size="sm">
            Upgrade to Pro
          </Button>
        </div>
      )}

      {(userHasPro || activeTab === 'all') && (
        <div className={shouldUseFixedHeight ? "flex-1 min-h-0" : ""}>
          <div className={`${shouldUseFixedHeight ? 'h-full overflow-y-auto' : ''} space-y-2`}>
            {loading ? (
              <div className="space-y-3">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center gap-4 p-4 bg-neutral-dark/5 dark:bg-neutral-light/5 rounded-lg">
                    <div className="w-8 h-8 bg-neutral-dark/10 dark:bg-neutral-light/10 rounded-full" />
                    <div className="flex-1 h-4 bg-neutral-dark/10 dark:bg-neutral-light/10 rounded" />
                    <div className="w-16 h-4 bg-neutral-dark/10 dark:bg-neutral-light/10 rounded" />
                  </div>
                ))}
              </div>
            ) : leaderboardData.length > 0 ? (
              leaderboardData.map((entry) => (
                <div
                  key={entry.user_id}
                  className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg transition-all ${
                    entry.user_id === currentUserId
                      ? 'ring-2 ring-primary bg-primary/10'
                      : getRankColor(entry.rank)
                  } ${entry.rank <= 3 ? 'shadow-md' : ''}`}
                >
                  <div className="flex items-center justify-center w-6 sm:w-8 flex-shrink-0">
                    {getRankIcon(entry.rank)}
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-neutral-dark/10 dark:bg-neutral-light/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {entry.profile_pic_url ? (
                        <img 
                          src={entry.profile_pic_url} 
                          alt={entry.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs sm:text-sm font-semibold text-neutral-dark dark:text-neutral-light">
                          {entry.username.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <p className="font-medium text-neutral-dark dark:text-neutral-light truncate">
                          {entry.username}
                        </p>
                        {entry.user_id === currentUserId && (
                          <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full self-start sm:self-auto">
                            You
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <p className="text-base sm:text-lg font-bold text-neutral-dark dark:text-neutral-light">
                      {entry.current_streak}
                    </p>
                    <p className="text-xs text-neutral-dark/70 dark:text-neutral-light/70">
                      {entry.current_streak === 1 ? 'day' : 'days'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-neutral-dark/70 dark:text-neutral-light/70">
                {activeTab === 'friends' ? 'No friends found. Add some friends to see the leaderboard!' : 'No users found.'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}