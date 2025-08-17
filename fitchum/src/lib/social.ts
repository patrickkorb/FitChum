import { createClient } from '@/lib/supabase/client';
import { getTodayDateString } from './dateUtils';

const supabase = createClient();

export async function logActivity(
  userId: string, 
  activityType: 'workout_logged' | 'streak_milestone' | 'goal_achieved', 
  activityData: Record<string, unknown>
): Promise<void> {
  try {
    const { error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: userId,
        activity_type: activityType,
        activity_data: activityData,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error logging activity:', error);
    throw error;
  }
}

export async function getUserStreak(userId: string): Promise<{ current: number; longest: number } | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('current_streak, longest_streak')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    return {
      current: data.current_streak || 0,
      longest: data.longest_streak || 0
    };
  } catch (error) {
    console.error('Error fetching user streak:', error);
    return null;
  }
}

export async function getFriends(userId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('friendships')
      .select('requester_id, addressee_id')
      .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
      .eq('status', 'accepted');

    if (error) throw error;

    return data?.map(friendship => 
      friendship.requester_id === userId 
        ? friendship.addressee_id 
        : friendship.requester_id
    ) || [];
  } catch (error) {
    console.error('Error fetching friends:', error);
    return [];
  }
}

export async function sendFriendRequest(requesterId: string, addresseeId: string): Promise<boolean> {
  try {
    // Check if any relationship already exists between these users
    const { data: existing } = await supabase
      .from('friendships')
      .select('id, status')
      .or(`and(requester_id.eq.${requesterId},addressee_id.eq.${addresseeId}),and(requester_id.eq.${addresseeId},addressee_id.eq.${requesterId})`);

    if (existing && existing.length > 0) {
      console.log('Friendship or request already exists');
      return false;
    }

    const { error } = await supabase
      .from('friendships')
      .insert({
        requester_id: requesterId,
        addressee_id: addresseeId,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Insert error:', error);
      throw error;
    }
    return true;
  } catch (error) {
    console.error('Error sending friend request:', error);
    return false;
  }
}

export async function acceptFriendRequest(friendshipId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('friendships')
      .update({
        status: 'accepted',
        updated_at: new Date().toISOString()
      })
      .eq('id', friendshipId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error accepting friend request:', error);
    return false;
  }
}

export async function removeFriend(userId: string, friendId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('friendships')
      .delete()
      .or(`and(requester_id.eq.${userId},addressee_id.eq.${friendId}),and(requester_id.eq.${friendId},addressee_id.eq.${userId})`);

    if (error) {
      console.error('Remove friend error:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error removing friend:', error);
    return false;
  }
}

export async function rejectFriendRequest(friendshipId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('friendships')
      .delete()
      .eq('id', friendshipId);

    return !error;
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    return false;
  }
}

export async function getFriendRequests(userId: string): Promise<{
  incoming: Array<{
    id: string;
    created_at: string;
    requester: {
      user_id: string;
      username: string;
      profile_pic_url?: string;
      current_streak: number;
    };
  }>;
  outgoing: Array<{
    id: string;
    created_at: string;
    addressee: {
      user_id: string;
      username: string;
      profile_pic_url?: string;
      current_streak: number;
    };
  }>;
}> {
  try {
    // Incoming requests - get basic friendship data first
    const { data: incomingRequests, error: incomingError } = await supabase
      .from('friendships')
      .select('id, created_at, requester_id')
      .eq('addressee_id', userId)
      .eq('status', 'pending');

    if (incomingError) {
      console.error('Error fetching incoming requests:', incomingError);
    }

    // Outgoing requests - get basic friendship data first
    const { data: outgoingRequests, error: outgoingError } = await supabase
      .from('friendships')
      .select('id, created_at, addressee_id')
      .eq('requester_id', userId)
      .eq('status', 'pending');

    if (outgoingError) {
      console.error('Error fetching outgoing requests:', outgoingError);
    }

    // Fetch requester profiles for incoming requests
    const incoming = [];
    if (incomingRequests && incomingRequests.length > 0) {
      const requesterIds = incomingRequests.map(req => req.requester_id);
      const { data: requesterProfiles } = await supabase
        .from('profiles')
        .select('user_id, username, profile_pic_url, current_streak')
        .in('user_id', requesterIds);

      for (const request of incomingRequests) {
        const requesterProfile = requesterProfiles?.find(p => p.user_id === request.requester_id);
        if (requesterProfile) {
          incoming.push({
            id: request.id,
            created_at: request.created_at,
            requester: {
              user_id: requesterProfile.user_id,
              username: requesterProfile.username || `User ${requesterProfile.user_id.slice(-4)}`,
              profile_pic_url: requesterProfile.profile_pic_url,
              current_streak: requesterProfile.current_streak || 0
            }
          });
        }
      }
    }

    // Fetch addressee profiles for outgoing requests
    const outgoing = [];
    if (outgoingRequests && outgoingRequests.length > 0) {
      const addresseeIds = outgoingRequests.map(req => req.addressee_id);
      const { data: addresseeProfiles } = await supabase
        .from('profiles')
        .select('user_id, username, profile_pic_url, current_streak')
        .in('user_id', addresseeIds);

      for (const request of outgoingRequests) {
        const addresseeProfile = addresseeProfiles?.find(p => p.user_id === request.addressee_id);
        if (addresseeProfile) {
          outgoing.push({
            id: request.id,
            created_at: request.created_at,
            addressee: {
              user_id: addresseeProfile.user_id,
              username: addresseeProfile.username || `User ${addresseeProfile.user_id.slice(-4)}`,
              profile_pic_url: addresseeProfile.profile_pic_url,
              current_streak: addresseeProfile.current_streak || 0
            }
          });
        }
      }
    }

    return { incoming, outgoing };
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    return { incoming: [], outgoing: [] };
  }
}

export async function searchUsers(query: string, currentUserId: string): Promise<Array<{
  user_id: string;
  username: string;
  profile_pic_url?: string;
  current_streak: number;
  friendship_status: 'none' | 'pending_sent' | 'pending_received' | 'friends';
}>> {
  try {
    if (query.trim().length < 2) return [];

    const { data: users } = await supabase
      .from('profiles')
      .select('user_id, username, profile_pic_url, current_streak')
      .ilike('username', `%${query}%`)
      .neq('user_id', currentUserId)
      .limit(20);

    if (!users) return [];

    // Check friendship status for each user
    const { data: friendships } = await supabase
      .from('friendships')
      .select('requester_id, addressee_id, status')
      .or(`requester_id.eq.${currentUserId},addressee_id.eq.${currentUserId}`)
      .in('requester_id', users.map(u => u.user_id))
      .or(`addressee_id.in.(${users.map(u => u.user_id).join(',')})`);

    return users.map(user => {
      const friendship = friendships?.find(f => 
        (f.requester_id === currentUserId && f.addressee_id === user.user_id) ||
        (f.addressee_id === currentUserId && f.requester_id === user.user_id)
      );

      let status: 'none' | 'pending_sent' | 'pending_received' | 'friends' = 'none';
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
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
}