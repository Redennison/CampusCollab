'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ProfileCard from '@/components/ui/ProfileCard';
import {mockProfiles, Profile} from './mockData';

export default function HomePage() {
  const [currentProfile, setCurrentProfile] = useState<Profile>(mockProfiles[0]);

  const handleSwipe = () => {
    const currentIndex = mockProfiles.findIndex(p => p.id === currentProfile?.id);
    const nextIndex = (currentIndex + 1) % mockProfiles.length;
    setCurrentProfile(mockProfiles[nextIndex]);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="relative pb-24">
            {currentProfile ? (
              <ProfileCard
                profile={currentProfile}
                onLike={handleSwipe}
                onPass={handleSwipe}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No more profiles to show</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
