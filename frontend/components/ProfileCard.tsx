'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Profile {
  id: string;
  name: string;
  sector: string;
  domain: string;
  bio: string;
  image: string;
  skills: string[];
}

interface ProfileCardProps {
  profile: Profile;
  onSwipe: (direction: 'left' | 'right') => void;
}

export default function ProfileCard({ profile, onSwipe }: ProfileCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-full">
      {/* Card Container */}
      <div
        className="relative w-full aspect-[16/9] rounded-md overflow-hidden shadow-xl transition-transform duration-300 hover:scale-[1.01]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >

        {/* Info Section */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-white p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {profile.name}
              </h2>
              <div className="flex gap-2 text-sm text-gray-600">
                <span className="px-2 py-1 bg-green-50 rounded-md">
                  {profile.sector}
                </span>
                <span className="px-2 py-1 bg-green-50 rounded-md">
                  {profile.domain}
                </span>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => onSwipe('left')}
                className="w-12 h-12 cursor-pointer rounded-full bg-white shadow-md flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
              >
                <span className="text-2xl">✕</span>
              </button>
              <button
                onClick={() => onSwipe('right')}
                className="w-12 h-12 cursor-pointer rounded-full bg-white shadow-md flex items-center justify-center text-green-500 hover:bg-green-50 transition-colors"
              >
                <span className="text-2xl">✓</span>
              </button>
            </div>
          </div>

          {/* Skills Section */}
          <div className={`transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-gray-600 text-sm mb-3">{profile.bio}</p>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-green-50 rounded-md text-gray-700 text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 