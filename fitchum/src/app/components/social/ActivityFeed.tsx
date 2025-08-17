'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getUserPlan, isPro } from '@/lib/subscription';
import { Dumbbell, Flame, Target, Clock, Lock } from 'lucide-react';
import Button from '../ui/Button';

interface ActivityFeedProps {
  currentUserId?: string | null;
}

type ActivityItem = {
  id: string;
  user_id: string;
  username: string;
  profile_pic_url?: string;
  activity_type: 'workout_logged' | 'streak_milestone' | 'goal_achieved';
  activity_data: Record<string, unknown>;
  created_at: string;
};

export default function ActivityFeed({ currentUserId }: ActivityFeedProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'friends'>('all');
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userHasPro, setUserHasPro] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const checkProStatus = async () => {
      if (!currentUserId) return;
      
      const userPlan = await getUserPlan(currentUserId);
      setUserHasPro(isPro(userPlan));
    };

    checkProStatus();
  }, [currentUserId]);

  const filterRestDayActivities = (activitiesData: ActivityItem[]) => {
    return activitiesData.filter(activity => {
      // Filter out rest day activities
      if (activity.activity_type === 'workout_logged') {
        const workoutType = activity.activity_data?.workout_type as string;
        return workoutType && !workoutType.toLowerCase().includes('rest');
      }
      return true; // Keep streak milestones and other activities
    });
  };

  const fetchGlobalActivity = useCallback(async () => {
    setLoading(true);
    try {
      // First get activities
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (activitiesError) throw activitiesError;

      if (!activitiesData || activitiesData.length === 0) {
        setActivities([]);
        setLoading(false);
        return;
      }

      // Filter out rest days
      const filteredActivities = filterRestDayActivities(activitiesData);

      // Get unique user IDs
      const userIds = [...new Set(filteredActivities.map(activity => activity.user_id))];

      // Then get profiles for those users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, username, profile_pic_url')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      // Create a map of user_id to profile
      const profilesMap = new Map();
      profilesData?.forEach(profile => {
        profilesMap.set(profile.user_id, profile);
      });

      const formattedActivities: ActivityItem[] = filteredActivities.map(activity => {
        const profile = profilesMap.get(activity.user_id);
        return {
          id: activity.id,
          user_id: activity.user_id,
          username: profile?.username || `User ${activity.user_id.slice(-4)}`,
          profile_pic_url: profile?.profile_pic_url,
          activity_type: activity.activity_type,
          activity_data: activity.activity_data,
          created_at: activity.created_at
        };
      });

      setActivities(formattedActivities);
    } catch (error) {
      console.error('Error fetching global activity:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const fetchFriendsActivity = useCallback(async () => {
    if (!currentUserId) return;
    
    setLoading(true);
    try {
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

      if (friendIds.length === 0) {
        setActivities([]);
        setLoading(false);
        return;
      }

      // Get activities for friends
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activity_logs')
        .select('*')
        .in('user_id', friendIds)
        .order('created_at', { ascending: false })
        .limit(50);

      if (activitiesError) throw activitiesError;

      if (!activitiesData || activitiesData.length === 0) {
        setActivities([]);
        setLoading(false);
        return;
      }

      // Filter out rest days
      const filteredActivities = filterRestDayActivities(activitiesData);

      // Get unique user IDs
      const userIds = [...new Set(filteredActivities.map(activity => activity.user_id))];

      // Then get profiles for those users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, username, profile_pic_url')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      // Create a map of user_id to profile
      const profilesMap = new Map();
      profilesData?.forEach(profile => {
        profilesMap.set(profile.user_id, profile);
      });

      const formattedActivities: ActivityItem[] = filteredActivities.map(activity => {
        const profile = profilesMap.get(activity.user_id);
        return {
          id: activity.id,
          user_id: activity.user_id,
          username: profile?.username || `User ${activity.user_id.slice(-4)}`,
          profile_pic_url: profile?.profile_pic_url,
          activity_type: activity.activity_type,
          activity_data: activity.activity_data,
          created_at: activity.created_at
        };
      });

      setActivities(formattedActivities);
    } catch (error) {
      console.error('Error fetching friends activity:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUserId, supabase]);

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'workout_logged':
        return <Dumbbell className="text-primary" size={20} />;
      case 'streak_milestone':
        return <Flame className="text-secondary" size={20} />;
      case 'goal_achieved':
        return <Target className="text-green-500" size={20} />;
      default:
        return <Dumbbell className="text-neutral-dark dark:text-neutral-light" size={20} />;
    }
  };

  const formatActivityMessage = (activity: ActivityItem): string => {
    switch (activity.activity_type) {
      case 'workout_logged':
        const workoutType = activity.activity_data?.workout_type || 'workout';
        return `just finished their ${workoutType}`;
      case 'streak_milestone':
        const streak = activity.activity_data?.streak || 0;
        return `reached a ${streak}-day workout streak! 🔥`;
      case 'goal_achieved':
        const goal = activity.activity_data?.goal || 'fitness goal';
        return `achieved their ${goal}! 🎯`;
      default:
        return 'had some activity';
    }
  };

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const activity = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activity.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  useEffect(() => {
    if (activeTab === 'all') {
      fetchGlobalActivity();
    } else {
      fetchFriendsActivity();
    }

    const channel = supabase
        .channel('activity_feed')
        .on('postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'activity_logs' },
            () => {
              if (activeTab === 'all') {
                fetchGlobalActivity();
              } else {
                fetchFriendsActivity();
              }
            }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeTab, currentUserId, fetchGlobalActivity, fetchFriendsActivity]);

  const handleTabChange = (tab: 'all' | 'friends') => {
    if (tab === 'friends' && !userHasPro) {
      return;
    }
    setActiveTab(tab);
  };

  const shouldUseFixedHeight = activities.length > 5;

  return (
    <div className={`space-y-4 sm:space-y-6 ${shouldUseFixedHeight ? 'h-[600px] flex flex-col' : ''}`}>
      <div className={`flex items-center justify-between ${shouldUseFixedHeight ? 'flex-shrink-0' : ''}`}>
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-dark dark:text-neutral-light">
          Activity Feed
        </h2>
        <div className="flex items-center gap-2 text-neutral-dark/50 dark:text-neutral-light/50">
          <Clock size={16} />
          <span className="text-sm">Live updates</span>
        </div>
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
            Friends Activity Feed
          </h3>
          <p className="text-neutral-dark/70 dark:text-neutral-light/70 mb-4 max-w-md mx-auto">
            Upgrade to Pro to see what your friends are up to and get motivated by their progress.
          </p>
          <Button variant="primary" size="sm">
            Upgrade to Pro
          </Button>
        </div>
      )}

      {(userHasPro || activeTab === 'all') && (
        <div className={shouldUseFixedHeight ? "flex-1 min-h-0" : ""}>
          <div className={`${shouldUseFixedHeight ? 'h-full overflow-y-auto' : ''} space-y-3`}>
            {loading ? (
              <div className="space-y-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-start gap-4 p-4 bg-neutral-dark/5 dark:bg-neutral-light/5 rounded-lg">
                    <div className="w-10 h-10 bg-neutral-dark/10 dark:bg-neutral-light/10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-neutral-dark/10 dark:bg-neutral-light/10 rounded w-3/4" />
                      <div className="h-3 bg-neutral-dark/10 dark:bg-neutral-light/10 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : activities.length > 0 ? (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-neutral-dark/5 dark:bg-neutral-light/5 rounded-lg hover:bg-neutral-dark/10 dark:hover:bg-neutral-light/10 transition-colors"
                >
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-neutral-dark/10 dark:bg-neutral-light/10 flex items-center justify-center overflow-hidden">
                      {activity.profile_pic_url ? (
                        <img 
                          src={activity.profile_pic_url} 
                          alt={activity.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs sm:text-sm font-semibold text-neutral-dark dark:text-neutral-light">
                          {activity.username.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center flex-shrink-0">
                      {getActivityIcon(activity.activity_type)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-neutral-dark dark:text-neutral-light text-sm sm:text-base">
                      <span className="font-semibold">{activity.username}</span>
                      {' '}
                      <span>{formatActivityMessage(activity)}</span>
                    </p>
                    <p className="text-xs sm:text-sm text-neutral-dark/70 dark:text-neutral-light/70 mt-1">
                      {formatTimeAgo(activity.created_at)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-neutral-dark/70 dark:text-neutral-light/70">
                {activeTab === 'friends' 
                  ? 'No friend activity yet. Add some friends to see their workouts!' 
                  : 'No recent activity. Be the first to log a workout!'
                }
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}