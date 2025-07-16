"use client"

import { useEffect, useState, useRef } from "react"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Sidebar from "@/components/Sidebar"
import { Gift, Send, X, ChevronLeft } from "lucide-react"
import Image from "next/image"
import io from "socket.io-client"

type Msg = { message: string; from: string; timestamp: number }

let socket: ReturnType<typeof io>

export default function DatingApp() {
  const [currentMessage, setCurrentMessage] = useState("")
  const [matches, setMatches] = useState<any[]>([])
  const [selectedMatch, setSelectedMatch] = useState<any>(null)
  const [messages, setMessages] = useState<Msg[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  console.log(localStorage.getItem("user_id"))

  // 1) Initialize Socket.IO once
  useEffect(() => {
    fetch("/api/socket").finally(() => {
      socket = io()
      socket.on("receiveMessage", (msg: Msg) => {
        setMessages((prev) => [...prev, msg])
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      })
    })
  }, [])

  // 2) Load your match list on mount
  useEffect(() => {
    async function fetchMatches() {
      const token = localStorage.getItem("access_token")
      if (!token) return console.error("No auth token")

      try {
        const res = await fetch("/api/match", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setMatches(data)
        if (data.length > 0) {
          selectMatch(data[0])
          console.log("Selected matches:", data)
        }
      } catch (e) {
        console.error("Failed to load matches", e)
      }
    }
    fetchMatches()
  }, [])

  // 3) When you pick a match: fetch history, then join room
  async function selectMatch(match: any) {
    setSelectedMatch(match)
    setMessages([]) // clear while loading

    // fetch persisted history from your Next.js API
    try {
      const res = await fetch(`/api/messages?matchId=${match.match_id}`)
      if (res.ok) {
        const history: Msg[] = await res.json()
        console.log("Fetched message history:", history)
        setMessages(history)
      } else {
        console.error("Failed to fetch history", await res.text())
      }
    } catch (e) {
      console.error("Error fetching history", e)
    }

    // now join the Socket.IO room
    console.log("Joining socket room:", match.match_id)
    socket.emit("joinRoom", match.match_id)
  }

  // 4) Send a new message
  const send = () => {
    console.log(localStorage.getItem("user_id"))
    if (!currentMessage.trim() || !selectedMatch) return

    const payload = {
      roomId: selectedMatch.match_id,
      message: currentMessage,
      from: localStorage.getItem("user_id"),
    }
    console.log("Sending message payload:", payload)
    socket.emit("sendMessage", payload)
    setCurrentMessage("")
  }

  const other = selectedMatch?.other_user

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
        </div>

        {/* Matches tab */}
        <div className="flex border-b">
          <button className="flex-1 py-3 text-green-500 font-medium border-b-2 border-green-500">
            Matches
          </button>
        </div>

        {/* Match list */}
        <div className="flex-1 overflow-y-auto">
          {matches.length === 0 ? (
            <div className="p-4 text-gray-500">No matches yet.</div>
          ) : (
            matches.map((match) => (
              <button
                key={match.match_id}
                className={`border-b p-4 flex items-center w-full text-left hover:bg-gray-50 ${
                  selectedMatch?.match_id === match.match_id ? "bg-gray-100" : ""
                }`}
                onClick={() => selectMatch(match)}
              >
                <Avatar className="h-12 w-12">
                  <Image
                    src={match.other_user.image_url || "/placeholder.svg"}
                    alt={`${match.other_user.first_name} ${match.other_user.last_name}`}
                    width={48}
                    height={48}
                  />
                </Avatar>
                <div className="ml-3">
                  <div className="font-medium">
                    {match.other_user.first_name} {match.other_user.last_name}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <ChevronLeft size={16} /> Hello <span className="ml-1">😊</span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Middle chat */}
      <div className="flex-1 flex flex-col relative border-r">
        {/* Header */}
        <div className="p-4 border-b flex items-center">
          <Avatar className="h-8 w-8">
            <Image
              src={other?.image_url || "/placeholder.svg"}
              alt={other?.first_name || "Profile"}
              width={32}
              height={32}
            />
          </Avatar>
          <div className="ml-3">
            {selectedMatch
              ? `You matched with ${other?.first_name} on ${new Date(
                  selectedMatch.matched_at
                ).toLocaleDateString()}`
              : "Select a match to start chatting"}
          </div>
          <Button variant="ghost" size="icon" className="ml-auto rounded-full">
            <X size={18} />
          </Button>
        </div>

        {/* Messages area */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`mb-2 flex ${
                m.from === localStorage.getItem("user_id") ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`py-2 px-4 rounded-full max-w-xs ${
                  m.from === localStorage.getItem("user_id")
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {m.message}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t flex items-center">
          <Button variant="outline" size="icon" className="rounded-full mr-1">
            <Gift size={20} />
          </Button>
          <Input
            placeholder="Type a message"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            className="flex-1 rounded-full border-gray-300"
          />
          <Button onClick={send} size="sm" className="ml-2">
            <Send className="h-4 w-4 mr-1" /> SEND
          </Button>
        </div>
      </div>

      {/* Right profile panel */}
      <div className="w-96 bg-white">
        <div className="relative h-[400px] bg-gray-100">
          <Image
            src={other?.image_url || "/placeholder.svg"}
            alt={other?.first_name || "Profile"}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-semibold">
            {other?.first_name || "Select a match"}
          </h2>
          {/* … your socials / buttons … */}
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
