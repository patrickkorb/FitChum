'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { X, Users, Search, UserPlus, Check, Clock, UserMinus } from 'lucide-react';
import Button from '../ui/Button';

interface FriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: string | null;
  onFriendsUpdate?: () => void;
}

type Friend = {
  user_id: string;
  username: string;
  profile_pic_url?: string;
  current_streak: number;
  total_workouts: number;
  friendship_id?: string;
};

type FriendRequest = {
  id: string;
  created_at: string;
  requester?: {
    user_id: string;
    username: string;
    profile_pic_url?: string;
    current_streak: number;
  };
  addressee?: {
    user_id: string;
    username: string;
    profile_pic_url?: string;
    current_streak: number;
  };
};

type SearchUser = {
  user_id: string;
  username: string;
  profile_pic_url?: string;
  current_streak: number;
  friendship_status?: 'none' | 'pending_sent' | 'pending_received' | 'friends';
};

export default function FriendsModal({ isOpen, onClose, currentUserId, onFriendsUpdate }: FriendsModalProps) {
  const [activeTab, setActiveTab] = useState<'friends' | 'find' | 'requests'>('friends');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const supabase = createClient();

  // Fetch friends data
  const fetchFriends = async () => {
    if (!currentUserId) return;

    setLoading(true);
    try {
      // First get the friendships
      const { data: friendships, error: friendshipsError } = await supabase
        .from('friendships')
        .select('id, requester_id, addressee_id')
        .or(`requester_id.eq.${currentUserId},addressee_id.eq.${currentUserId}`)
        .eq('status', 'accepted');

      if (friendshipsError || !friendships) {
        console.error('Error fetching friendships:', friendshipsError);
        return;
      }

      if (friendships.length === 0) {
        setFriends([]);
        return;
      }

      // Get friend user IDs
      const friendUserIds = friendships.map(friendship => 
        friendship.requester_id === currentUserId 
          ? friendship.addressee_id 
          : friendship.requester_id
      );

      // Fetch friend profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, username, profile_pic_url, current_streak, total_workouts')
        .in('user_id', friendUserIds);

      if (profilesError || !profiles) {
        console.error('Error fetching friend profiles:', profilesError);
        return;
      }

      // Map friendships with profiles
      const friendsData: Friend[] = friendships.map(friendship => {
        console.log('🔵 Processing friendship:', friendship);
        
        const friendUserId = friendship.requester_id === currentUserId 
          ? friendship.addressee_id 
          : friendship.requester_id;
        
        const friendProfile = profiles.find(p => p.user_id === friendUserId);
        
        if (!friendProfile) {
          console.log('❌ No profile found for user:', friendUserId);
          return null;
        }

        const friendData = {
          user_id: friendProfile.user_id,
          username: friendProfile.username || `User ${friendProfile.user_id.slice(-4)}`,
          profile_pic_url: friendProfile.profile_pic_url,
          current_streak: friendProfile.current_streak || 0,
          total_workouts: friendProfile.total_workouts || 0,
          friendship_id: friendship.id
        };
        
        console.log('✅ Created friend data:', friendData);
        return friendData;
      }).filter(Boolean) as Friend[];
      
      setFriends(friendsData);
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch friend requests using the improved function
  const fetchFriendRequests = async () => {
    if (!currentUserId) return;

    try {
      const { getFriendRequests } = await import('@/lib/social');
      const requests = await getFriendRequests(currentUserId);
      
      setIncomingRequests(requests.incoming);
      setOutgoingRequests(requests.outgoing);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  // Search users
  const searchUsers = async (query: string) => {
    if (!currentUserId || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const { data: users } = await supabase
        .from('profiles')
        .select('user_id, username, profile_pic_url, current_streak')
        .ilike('username', `%${query}%`)
        .neq('user_id', currentUserId)
        .limit(20);

      if (users) {
        // Check friendship status for each user
        const { data: friendships } = await supabase
          .from('friendships')
          .select('requester_id, addressee_id, status')
          .or(`requester_id.eq.${currentUserId},addressee_id.eq.${currentUserId}`)
          .in('requester_id', users.map(u => u.user_id))
          .or(`addressee_id.in.(${users.map(u => u.user_id).join(',')})`);

        const usersWithStatus: SearchUser[] = users.map(user => {
          const friendship = friendships?.find(f => 
            (f.requester_id === currentUserId && f.addressee_id === user.user_id) ||
            (f.addressee_id === currentUserId && f.requester_id === user.user_id)
          );

          let status: SearchUser['friendship_status'] = 'none';
          if (friendship) {
            if (friendship.status === 'accepted') {
              status = 'friends';
            } else if (friendship.status === 'pending') {
              status = friendship.requester_id === currentUserId ? 'pending_sent' : 'pending_received';
            }
          }

          return {
            ...user,
            username: user.username || `User ${user.user_id.slice(-4)}`,
            friendship_status: status
          };
        });

        setSearchResults(usersWithStatus);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  // Send friend request
  const sendFriendRequest = async (addresseeId: string) => {
    if (!currentUserId) return;

    try {
      const { sendFriendRequest: sendRequest } = await import('@/lib/social');
      const success = await sendRequest(currentUserId, addresseeId);

      if (success) {
        // Update search results
        setSearchResults(prev => prev.map(user => 
          user.user_id === addresseeId 
            ? { ...user, friendship_status: 'pending_sent' }
            : user
        ));
        
        // Refresh friend requests
        fetchFriendRequests();
      } else {
        console.log('Failed to send friend request - may already exist');
        // Refresh search to get current status
        searchUsers(searchQuery);
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  // Accept friend request
  const acceptFriendRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (!error) {
        fetchFriendRequests();
        fetchFriends();
        onFriendsUpdate?.();
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  // Reject/Cancel friend request
  const rejectFriendRequest = async (requestId: string) => {
    try {
      console.log('🔴 ATTEMPTING TO CANCEL/REJECT REQUEST WITH ID:', requestId);
      
      if (!requestId) {
        console.error('❌ No request ID provided');
        return;
      }

      const { data, error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', requestId)
        .select(); // Add select to see what was deleted

      console.log('🔍 Delete result:', { data, error });

      if (!error) {
        console.log('✅ Request deleted successfully:', data);
        
        // Refresh friend requests
        fetchFriendRequests();
        
        // Always refresh search results to update button states
        if (searchQuery.length >= 2) {
          searchUsers(searchQuery);
        }
        
        // Update parent component
        onFriendsUpdate?.();
      } else {
        console.error('❌ Database error rejecting request:', error);
      }
    } catch (error) {
      console.error('❌ Error rejecting friend request:', error);
    }
  };

  // Remove friend
  const removeFriend = async (friendshipId: string) => {
    try {
      console.log('🟡 ATTEMPTING TO REMOVE FRIEND WITH ID:', friendshipId);
      
      if (!friendshipId) {
        console.error('❌ No friendship ID provided');
        return;
      }

      const { data, error } = await supabase
        .from('friendships')
        .delete()
        .eq('id', friendshipId)
        .select(); // Add select to see what was deleted

      console.log('🔍 Remove friend result:', { data, error });

      if (!error) {
        console.log('✅ Friend removed successfully:', data);
        
        // Refresh friends list
        fetchFriends();
        
        // Refresh search results to update button states
        if (searchQuery.length >= 2) {
          searchUsers(searchQuery);
        }
        
        // Update parent component
        onFriendsUpdate?.();
      } else {
        console.error('❌ Database error removing friend:', error);
      }
    } catch (error) {
      console.error('❌ Error removing friend:', error);
    }
  };

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  useEffect(() => {
    if (isOpen && currentUserId) {
      fetchFriends();
      fetchFriendRequests();
    }
  }, [isOpen, currentUserId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-dark w-full max-w-2xl mx-auto rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-dark/10 dark:border-neutral-light/10">
          <h2 className="text-2xl font-bold text-neutral-dark dark:text-neutral-light">
            Friends
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-dark/5 dark:hover:bg-neutral-light/5 transition-colors"
          >
            <X size={20} className="text-neutral-dark/70 dark:text-neutral-light/70" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-dark/10 dark:border-neutral-light/10 overflow-x-auto">
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap min-w-0 ${
              activeTab === 'friends'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-neutral-dark/70 dark:text-neutral-light/70 hover:text-neutral-dark dark:hover:text-neutral-light'
            }`}
          >
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <Users size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">Friends ({friends.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('find')}
            className={`flex-1 px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap min-w-0 ${
              activeTab === 'find'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-neutral-dark/70 dark:text-neutral-light/70 hover:text-neutral-dark dark:hover:text-neutral-light'
            }`}
          >
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <Search size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Find Friends</span>
              <span className="sm:hidden">Find</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 px-3 sm:px-6 py-3 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap min-w-0 ${
              activeTab === 'requests'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-neutral-dark/70 dark:text-neutral-light/70 hover:text-neutral-dark dark:hover:text-neutral-light'
            }`}
          >
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <UserPlus size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Requests ({incomingRequests.length + outgoingRequests.length})</span>
              <span className="sm:hidden">Req ({incomingRequests.length + outgoingRequests.length})</span>
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Friends Tab */}
          {activeTab === 'friends' && (
            <div className="space-y-3">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-12 h-12 bg-neutral-dark/10 dark:bg-neutral-light/10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-neutral-dark/10 dark:bg-neutral-light/10 rounded w-1/4" />
                        <div className="h-3 bg-neutral-dark/10 dark:bg-neutral-light/10 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : friends.length > 0 ? (
                friends.map(friend => (
                  <div key={friend.user_id} className="flex items-center justify-between p-4 border border-neutral-dark/10 dark:border-neutral-light/10 rounded-lg hover:bg-neutral-dark/5 dark:hover:bg-neutral-light/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-dark/10 dark:bg-neutral-light/10">
                        {friend.profile_pic_url ? (
                          <img src={friend.profile_pic_url} alt={friend.username} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-neutral-dark dark:text-neutral-light">
                            {friend.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-dark dark:text-neutral-light">{friend.username}</h3>
                        <p className="text-sm text-neutral-dark/70 dark:text-neutral-light/70">
                          {friend.current_streak} day streak • {friend.total_workouts} workouts
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => friend.friendship_id && removeFriend(friend.friendship_id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:border-red-200"
                    >
                      <UserMinus size={16} />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-neutral-dark/70 dark:text-neutral-light/70">
                  <Users className="mx-auto mb-4 text-neutral-dark/30 dark:text-neutral-light/30" size={48} />
                  <h3 className="text-lg font-semibold mb-2">No friends yet</h3>
                  <p>Start by searching for friends to add!</p>
                </div>
              )}
            </div>
          )}

          {/* Find Friends Tab */}
          {activeTab === 'find' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-dark/50 dark:text-neutral-light/50" />
                <input
                  placeholder="Search by username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-dark/20 dark:border-neutral-light/20 rounded-lg bg-white dark:bg-neutral-dark text-neutral-dark dark:text-neutral-light focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                {searchLoading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-10 h-10 bg-neutral-dark/10 dark:bg-neutral-light/10 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-neutral-dark/10 dark:bg-neutral-light/10 rounded w-1/4" />
                          <div className="h-3 bg-neutral-dark/10 dark:bg-neutral-light/10 rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map(user => (
                    <div key={user.user_id} className="flex items-center justify-between p-3 border border-neutral-dark/10 dark:border-neutral-light/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-dark/10 dark:bg-neutral-light/10">
                          {user.profile_pic_url ? (
                            <img src={user.profile_pic_url} alt={user.username} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-neutral-dark dark:text-neutral-light">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-neutral-dark dark:text-neutral-light">{user.username}</h4>
                          <p className="text-sm text-neutral-dark/70 dark:text-neutral-light/70">{user.current_streak} day streak</p>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => sendFriendRequest(user.user_id)}
                        disabled={user.friendship_status !== 'none'}
                        size="sm"
                        variant={user.friendship_status === 'none' ? 'primary' : 'outline'}
                      >
                        {user.friendship_status === 'none' && 'Add Friend'}
                        {user.friendship_status === 'pending_sent' && (
                          <><Clock size={14} className="mr-1" />Sent</>
                        )}
                        {user.friendship_status === 'pending_received' && 'Pending'}
                        {user.friendship_status === 'friends' && (
                          <><Check size={14} className="mr-1" />Friends</>
                        )}
                      </Button>
                    </div>
                  ))
                ) : searchQuery.length >= 2 ? (
                  <div className="text-center py-8 text-neutral-dark/70 dark:text-neutral-light/70">
                    No users found matching &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  <div className="text-center py-8 text-neutral-dark/70 dark:text-neutral-light/70">
                    <Search className="mx-auto mb-4 text-neutral-dark/30 dark:text-neutral-light/30" size={48} />
                    <h3 className="text-lg font-semibold mb-2">Find Friends</h3>
                    <p>Search for users by their username</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Requests Tab */}
          {activeTab === 'requests' && (
            <div className="space-y-6">
              {/* Incoming Requests */}
              <div>
                <h3 className="font-semibold text-neutral-dark dark:text-neutral-light mb-3">
                  Incoming Requests ({incomingRequests.length})
                </h3>
                <div className="space-y-2">
                  {incomingRequests.length > 0 ? (
                    incomingRequests.map(request => (
                      <div key={request.id} className="flex items-center justify-between p-3 border border-neutral-dark/10 dark:border-neutral-light/10 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-dark/10 dark:bg-neutral-light/10">
                            {request.requester?.profile_pic_url ? (
                              <img src={request.requester.profile_pic_url} alt={request.requester.username} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-neutral-dark dark:text-neutral-light">
                                {request.requester?.username.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-neutral-dark dark:text-neutral-light">{request.requester?.username}</h4>
                            <p className="text-sm text-neutral-dark/70 dark:text-neutral-light/70">{formatTimeAgo(request.created_at)}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => acceptFriendRequest(request.id)}
                            size="sm" 
                            variant="primary"
                          >
                            Accept
                          </Button>
                          <Button 
                            onClick={() => rejectFriendRequest(request.id)}
                            size="sm" 
                            variant="outline"
                          >
                            Decline
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-neutral-dark/70 dark:text-neutral-light/70 text-center py-4">
                      No incoming requests
                    </p>
                  )}
                </div>
              </div>

              {/* Outgoing Requests */}
              <div>
                <h3 className="font-semibold text-neutral-dark dark:text-neutral-light mb-3">
                  Sent Requests ({outgoingRequests.length})
                </h3>
                <div className="space-y-2">
                  {outgoingRequests.length > 0 ? (
                    outgoingRequests.map(request => (
                      <div key={request.id} className="flex items-center justify-between p-3 border border-neutral-dark/10 dark:border-neutral-light/10 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-dark/10 dark:bg-neutral-light/10">
                            {request.addressee?.profile_pic_url ? (
                              <img src={request.addressee.profile_pic_url} alt={request.addressee.username} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-neutral-dark dark:text-neutral-light">
                                {request.addressee?.username.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-neutral-dark dark:text-neutral-light">{request.addressee?.username}</h4>
                            <p className="text-sm text-neutral-dark/70 dark:text-neutral-light/70">Sent {formatTimeAgo(request.created_at)}</p>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => rejectFriendRequest(request.id)}
                          size="sm" 
                          variant="outline"
                        >
                          Cancel
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-neutral-dark/70 dark:text-neutral-light/70 text-center py-4">
                      No sent requests
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}