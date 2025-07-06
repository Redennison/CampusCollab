'use client';

import { useState } from 'react';
import Sidebar from '@/components/ui/Sidebar';
import ProfileCard from '@/components/ui/ProfileCard';

interface Profile {
  id: string;
  name: string;
  sector: string;
  domain: string;
  bio: string;
  image: string;
  skills: string[];
}

export default function HomePage() {
  // Mock data - replace with actual API call
  const mockProfiles: Profile[] = [
    {
      id: '1',
      name: 'Gnet',
      sector: 'Healthcare',
      domain: 'Infrastructure',
      bio: 'Full-stack developer with 5 years of experience in healthcare tech. Passionate about building scalable systems that improve patient care.',
      image: '/gnet.jpg',
      skills: ['React.js', 'Node.js', 'AWS', 'Docker', 'TypeScript']
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      sector: 'FinTech',
      domain: 'Backend',
      bio: 'Backend specialist focused on building secure and scalable financial systems. Expert in distributed systems and microservices architecture.',
      image: '/gnet.jpg',
      skills: ['Java', 'Spring Boot', 'Kubernetes', 'PostgreSQL', 'Redis']
    },
    // Add more mock profiles as needed
  ];

  const [currentProfile, setCurrentProfile] = useState<Profile>(mockProfiles[0]);

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentIndex = mockProfiles.findIndex(p => p.id === currentProfile?.id);
    const nextIndex = (currentIndex + 1) % mockProfiles.length;
    setCurrentProfile(mockProfiles[nextIndex]);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Find Your Match</h1>
          <div className="relative pb-24">
            {currentProfile ? (
              <ProfileCard
                profile={currentProfile}
                onSwipe={handleSwipe}
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
