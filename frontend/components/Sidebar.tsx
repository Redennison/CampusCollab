'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import MessageIcon from '@mui/icons-material/Message';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

const navigationItems = [
  { name: 'Messages', href: '/messages', icon: MessageIcon },
];

const bottomNavigationItems = [
  { name: 'Profile', href: '/profile', icon: PersonIcon },
  { name: 'Settings', href: '/settings', icon: SettingsIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-16 bg-white shadow-lg h-screen flex flex-col">
      <div className="flex flex-col items-center py-4 space-y-6">
        <Link
          href="/"
          className={`relative group p-4 pb-2 transition-colors ${
            pathname === '/'
              ? 'bg-green-100'
              : 'hover:bg-green-50'
          }`}
        >
          <Image
            src="/logo.png"
            alt="MatchaGoose Logo"
            width={40}
            height={40}
            className="mx-auto"
          />
          <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            Home
          </span>
        </Link>
        
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative group p-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:bg-green-50'
              }`}
            >
              <Icon className="text-2xl" />
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>

      <nav className="flex flex-col items-center py-4 space-y-6 mt-auto mb-4">
        {bottomNavigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative group p-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:bg-green-50'
              }`}
            >
              <Icon className="text-2xl" />
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 