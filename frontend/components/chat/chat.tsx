"use client"

import { useEffect, useState } from "react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Sidebar from '@/components/Sidebar';
import { Gift, Send, MapPin, X, ChevronLeft, ChevronRight, Briefcase } from "lucide-react"
import Image from "next/image"

export default function DatingApp() {
  const [currentMessage, setCurrentMessage] = useState("")
  const [activeTab, setActiveTab] = useState("Messages")
  const [matches, setMatches] = useState([])

  useEffect(() => {
    async function fetchMatches() {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }
      try {
        const response = await fetch("/api/match", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json()
        setMatches(data)
      } catch (err) {
        console.error("Failed to fetch matches", err)
      }
    }
    fetchMatches()
  }, [])

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      {/* Left sidebar */}
      <div className="w-80 border-r flex flex-col">
        {/* Profile header */}
        <div className="bg-gradient-to-r from-green-500 to-white-400 p-4 flex items-center">
          <Avatar className="h-10 w-10 border-2 border-white">
            <Image src="/placeholder.svg" alt="Profile" width={40} height={40} />
          </Avatar>
          <span className="text-white font-medium ml-3 text-lg">My Profile</span>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full ml-auto bg-transparent border-white/30 hover:bg-white/10"
          >
            <span className="sr-only">Messages</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            className="flex-1 py-3 relative text-green-500 font-medium border-b-2 border-green-500"
            onClick={() => setActiveTab("Matches")}
          >
            Matches
            {/* <span className="bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center absolute top-3 right-4">
              15
            </span> */}
          </button>
        </div>

        {/* Match list */}
        <div className="flex-1 overflow-y-auto">
          {matches.length === 0 ? (
            <div className="p-4 text-gray-500">No matches yet.</div>
          ) : (
            matches.map((match: any) => {
              return (
                <div key={match.match_id} className="border-b p-4 flex items-center hover:bg-gray-50 cursor-pointer">
                  <Avatar className="h-12 w-12">
                    <Image src={match.image_url || "/placeholder.svg"} alt={`${match.first_name} ${match.last_name}`} width={48} height={48} />
                  </Avatar>
                  <div className="ml-3">
                    <div className="font-medium">{match.first_name} {match.last_name}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <ChevronLeft size={16} /> Hello <span className="ml-1">😊</span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Middle chat section */}
      <div className="flex-1 flex flex-col relative border-r">
        {/* Match info bar */}
        <div className="p-4 border-b flex items-center">
          <Avatar className="h-8 w-8">
            <Image src="/placeholder.svg" alt="David" width={32} height={32} />
          </Avatar>
          <div className="ml-3">
            <div>You matched with David on 12/19/2018</div>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto rounded-full">
            <X size={18} />
          </Button>
        </div>

        {/* Messages area */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col">
          <div className="mt-auto">
            <div className="flex justify-end mb-4">
              <div className="bg-blue-500 text-white py-2 px-4 rounded-full max-w-xs">Hello 😊</div>
              <span className="text-xs text-gray-400 mt-1 ml-2">Sent</span>
            </div>
          </div>
        </div>

        {/* Message input */}
        <div className="p-4 border-t flex items-center">
          <Button variant="outline" size="icon" className="rounded-full mr-1">
            <Gift size={20} />
            <span className="sr-only">Send gift</span>
          </Button>
          <Button variant="outline" size="icon" className="rounded-full mr-2">
            <span className="text-lg">🎵</span>
            <span className="sr-only">Add music</span>
          </Button>
          <Input
            placeholder="Type a message"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            className="flex-1 rounded-full border-gray-300"
          />
          <Button size="sm" className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full">
            <Send className="h-4 w-4 mr-1" />
            SEND
          </Button>
        </div>
      </div>

      {/* Right profile panel */}
      <div className="w-96 bg-white">
        <div className="relative h-[400px] bg-gray-100">
          <Image src="/placeholder.svg" alt="Profile" fill className="object-cover" />
          <div className="absolute bottom-6 left-6">
            <div className="flex space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <div className="h-2 w-2 rounded-full bg-gray-300"></div>
              <div className="h-2 w-2 rounded-full bg-gray-300"></div>
              <div className="h-2 w-2 rounded-full bg-gray-300"></div>
              <div className="h-2 w-2 rounded-full bg-gray-300"></div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full h-10 w-10"
          >
            <ChevronLeft size={24} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full h-10 w-10"
          >
            <ChevronRight size={24} />
          </Button>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-semibold">David, 31</h2>
          <div className="mt-2 flex items-center text-gray-500">
            <Briefcase size={16} className="mr-2" />
            Client Relationship Manager
          </div>
          <div className="mt-1 flex items-center text-gray-500">
            <MapPin size={16} className="mr-2" />1 mile away
          </div>

          <div className="border-t mt-6 pt-6 flex justify-between">
            <Button variant="outline" className="flex-1 mr-2">
              UNMATCH
            </Button>
            <Button variant="outline" className="flex-1">
              REPORT
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
