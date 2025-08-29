'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Users, UserPlus, Bell } from 'lucide-react';
import Button from '../ui/Button';
import FriendsModal from './FriendsModal';

interface FriendsBarProps {
  currentUserId?: string | null;
}

type Friend = {
  user_id: string;
  username: string;
  profile_pic_url?: string;
  current_streak: number;
};

export default function FriendsBar({ currentUserId }: FriendsBarProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    const fetchFriendsAndRequests = async () => {
      setLoading(true);
      try {

        // Fetch friends using the same approach as FriendsModal
        const { data: friendships, error: friendshipsError } = await supabase
          .from('friendships')
          .select('id, requester_id, addressee_id')
          .or(`requester_id.eq.${currentUserId},addressee_id.eq.${currentUserId}`)
          .eq('status', 'accepted');

        if (!friendshipsError && friendships && friendships.length > 0) {
          // Get friend user IDs
          const friendUserIds = friendships.map(friendship => 
            friendship.requester_id === currentUserId 
              ? friendship.addressee_id 
              : friendship.requester_id
          );

          // Fetch friend profiles
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('user_id, username, profile_pic_url, current_streak')
            .in('user_id', friendUserIds);

          if (!profilesError && profiles) {
            const friendsData: Friend[] = profiles.map(profile => ({
              user_id: profile.user_id,
              username: profile.username || `User ${profile.user_id.slice(-4)}`,
              profile_pic_url: profile.profile_pic_url,
              current_streak: profile.current_streak || 0
            }));
            
            setFriends(friendsData);
          }
        } else {
          setFriends([]);
        }

        // Fetch pending requests count
        const { count } = await supabase
          .from('friendships')
          .select('*', { count: 'exact', head: true })
          .eq('addressee_id', currentUserId)
          .eq('status', 'pending');

        setPendingRequestsCount(count || 0);

      } catch (error) {
        console.error('Error fetching friends data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendsAndRequests();
  }, [currentUserId, supabase]);

  // Real-time updates for friend requests
  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase
      .channel('friend_requests')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friendships',
          filter: `addressee_id=eq.${currentUserId}`
        },
        () => {
          // Refetch pending requests count
          supabase
            .from('friendships')
            .select('*', { count: 'exact', head: true })
            .eq('addressee_id', currentUserId)
            .eq('status', 'pending')
            .then(({ count }) => setPendingRequestsCount(count || 0));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, supabase]);

  if (!currentUserId) {
    return (
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/10">
        <div className="flex items-center gap-3">
          <Users size={20} className="text-primary" />
          <div>
            <h3 className="font-semibold text-neutral-dark dark:text-neutral-light">
              Friends & Community
            </h3>
            <p className="text-sm text-neutral-dark/70 dark:text-neutral-light/70">
              Login to connect with friends and compete together
            </p>
          </div>
        </div>
        <Button 
          variant="primary" 
          size="sm"
          onClick={() => window.location.href = '/auth/login'}
        >
          Login
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/10">
        <div className="flex items-center gap-3">
          <Users size={20} className="text-primary" />
          <div className="animate-pulse">
            <div className="h-4 bg-neutral-dark/10 dark:bg-neutral-light/10 rounded w-24"></div>
          </div>
        </div>
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-dark/10 dark:bg-neutral-light/10 rounded w-24"></div>
        </div>
      </div>
    );
  }


  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <Users size={20} className="text-primary flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-neutral-dark dark:text-neutral-light">
                Friends ({friends.length})
              </h3>
              {pendingRequestsCount > 0 && (
                <div className="flex items-center gap-1 text-sm">
                  <Bell size={14} className="text-secondary" />
                  <span className="text-secondary font-medium">
                    {pendingRequestsCount} request{pendingRequestsCount > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Friend Avatars */}
          <div className="flex items-center -space-x-2 ml-0 sm:ml-2">
            {friends.slice(0, 4).map((friend) => (
              <div
                key={friend.user_id}
                className="relative w-8 h-8 rounded-full border-2 border-white dark:border-neutral-dark overflow-hidden bg-neutral-dark/10 dark:bg-neutral-light/10 flex-shrink-0"
                title={`${friend.username} • ${friend.current_streak} day streak`}
              >
                {friend.profile_pic_url ? (
                  <img
                    src={friend.profile_pic_url}
                    alt={friend.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-neutral-dark dark:text-neutral-light">
                    {friend.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            ))}
            {friends.length > 4 && (
              <div className="w-8 h-8 rounded-full border-2 border-white dark:border-neutral-dark bg-neutral-dark/10 dark:bg-neutral-light/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-neutral-dark/70 dark:text-neutral-light/70">
                  +{friends.length - 4}
                </span>
              </div>
            )}
            {friends.length === 0 && (
              <div className="text-sm text-neutral-dark/70 dark:text-neutral-light/70 whitespace-nowrap">
                No friends yet
              </div>
            )}
          </div>
        </div>

        <Button 
          onClick={() => setIsModalOpen(true)}
          variant="outline" 
          size="sm"
          className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-center"
        >
          <UserPlus size={16} />
          <span className="hidden sm:inline">Manage Friends</span>
          <span className="sm:hidden">Manage</span>
        </Button>
      </div>

      <FriendsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentUserId={currentUserId}
        onFriendsUpdate={() => {
          // Refetch friends data when modal updates
          if (currentUserId) {
            window.location.reload(); // Simple refresh for now
          }
        }}
      />
    </>
  );
}