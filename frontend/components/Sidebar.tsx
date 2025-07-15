"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import MessageIcon from "@mui/icons-material/Message";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { name: "Messages", href: "/chat", icon: MessageIcon },
];

const bottomNavigationItems = [
  { name: "Profile", href: "/profile", icon: PersonIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setShowSettingsModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    // Clear the JWT token from localStorage
    localStorage.removeItem("access_token");

    // Close the modal
    setShowSettingsModal(false);

    // Redirect to login page
    router.push("/");
  };

  return (
    <div className="w-16 bg-white shadow-lg h-screen flex flex-col">
      <div className="flex flex-col items-center py-4 space-y-6">
        <div
          onClick={() => router.push("/home")}
          className={`relative group p-4 pb-2 transition-colors cursor-pointer ${
            pathname === "/home" ? "bg-green-100" : "hover:bg-green-50"
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
        </div>

        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative group p-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-green-100 text-green-700"
                  : "text-gray-600 hover:bg-green-50"
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
                  ? "bg-green-100 text-green-700"
                  : "text-gray-600 hover:bg-green-50"
              }`}
            >
              <Icon className="text-2xl" />
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                {item.name}
              </span>
            </Link>
          );
        })}

        {/* Settings button with modal */}
        <div className="relative" ref={settingsRef}>
          <button
            onClick={() => setShowSettingsModal(!showSettingsModal)}
            className="relative group p-3 rounded-lg transition-colors text-gray-600 hover:bg-green-50"
          >
            <SettingsIcon className="text-2xl" />
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              Settings
            </span>
          </button>

          {/* Settings Modal */}
          {showSettingsModal && (
            <div className="absolute left-full ml-2 bottom-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[120px] z-50">
              <Button
                onClick={handleSignOut}
                variant="ghost"
                className="w-full justify-start px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
