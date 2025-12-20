'use client';

import Image from 'next/image';
import { User, Settings } from 'lucide-react';

interface ProfileHeaderProps {
  username: string;
  avatarUrl?: string;
  bio?: string;
}

export default function ProfileHeader({ username, avatarUrl, bio }: ProfileHeaderProps) {
  return (
    <div className="rounded-lg">
      <div className="flex items-start gap-6">
        {/* Avatar */}
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={`${username}'s avatar`}
              fill
              className="object-cover"
            />
          ) : (
            <User size={48} className="text-muted-foreground" />
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-foreground">{username}</h1>
            <button
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Settings"
            >
              <Settings size={20} className="text-muted-foreground" />
            </button>
          </div>

          {bio && (
            <p className="text-muted-foreground text-sm leading-relaxed">
              {bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
