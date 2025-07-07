'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import ProfileCard from '@/components/ui/ProfileCard';
import { Profile } from './mockData';

export default function HomePage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentProfile = profiles[currentIndex];

  useEffect(() => {
    async function loadProfiles() {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      try {
        const response = await fetch('/api/people', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
        }

        const data: Profile[] = await response.json();
        setProfiles(data);
        setCurrentIndex(0);
      } catch (error) {
        console.error('Failed to load profiles', error);
      }
    }

    loadProfiles();
  }, []);

  const handleSwipe = () => {
    if (profiles.length === 0) return;
    setCurrentIndex((idx) => (idx + 1) % profiles.length);
  };

  const handleLike = async () => {
    if (!currentProfile) return;
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No authentication token found');
      return;
    }
    try {
      const response = await fetch('/api/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ likee_id: currentProfile.id }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to like user');
      }
      
      handleSwipe();
    } catch (error) {
      console.error('Failed to like user', error);
    }
  };

  console.log(currentProfile)

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="relative pb-24">
            {profiles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading profiles…</p>
              </div>
            ) : currentProfile ? (
              <ProfileCard
                profile={currentProfile}
                onLike={handleLike}
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
