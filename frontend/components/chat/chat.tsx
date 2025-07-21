"use client";

import { useEffect, useState, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/Sidebar";
import { Gift, Send, X, ChevronLeft } from "lucide-react";
import Image from "next/image";
import { Linkedin, Github, Twitter } from "lucide-react"
import { useRouter } from "next/navigation";

type Msg = { message: string; from: string; timestamp: number };
type Match = {
  match_id: string;
  other_user: { first_name: string; last_name: string; image_url?: string };
  matched_at: string;
};
type User = {
  image_url?: string;
};


export default function DatingApp() {
  const [currentMessage, setCurrentMessage] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const socketRef = useRef<Socket>();

  const router = useRouter();


  useEffect(() => {
    const socket = io("http://localhost:8000");
    socketRef.current = socket;

    socket.on("receiveMessage", (msg: Msg) => {
      console.log("Received message:", msg);
      setMessages((prev) => [...prev, msg]);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("access_token");
      const userId = localStorage.getItem("user_id");
      console.log("userId:", userId);
      console.log(localStorage);
      if (!token) {
        router.replace('/');
        return;
      }

      try {
        const res = await fetch("/api/match", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: Match[] = await res.json();
        console.log("Loaded matches:", data);
        setMatches(data);
        if (data.length > 0) selectMatch(data[0]);

        const userRes = await fetch(`/api/user`, {
        headers: { Authorization: `Bearer ${token}` },
        });
        if (userRes.ok) {
          const userData: User = await userRes.json();
          setUser(userData);
        } else {
          console.error("Failed to fetch user", await userRes.text());
        }
      } catch (e) {
        console.error("Failed to load data", e);
      }
    })();
  }, []);

  async function selectMatch(match: Match) {
    setSelectedMatch(match);
    setMessages([]);

    try {
      const res = await fetch(`/api/messages?matchId=${match.match_id}`);
      if (res.ok) {
        const history: Msg[] = await res.json();
        setMessages(history);
      } else {
        console.error("Failed to fetch history", await res.text());
      }
    } catch (e) {
      console.error("Error fetching history", e);
    }

    socketRef.current?.emit("joinRoom", match.match_id);
  }

  const send = () => {
    if (!currentMessage.trim() || !selectedMatch) return;
    console.log("Sending message:", currentMessage);
    const payload = {
      roomId: selectedMatch.match_id,
      message: currentMessage,
      from: localStorage.getItem("user_id"),
    };

    socketRef.current?.emit("sendMessage", payload);
    setCurrentMessage("");
  };

  const other = selectedMatch?.other_user;

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Matches list */}
      <div className="w-80 border-r flex flex-col">
        <div className="bg-gradient-to-r from-green-500 to-white-400 p-4 flex items-center">
          <Avatar className="h-10 w-10 border-2 border-white">
            <Image
              src={user?.image_url || "/placeholder.svg"}
              alt="Profile"
              width={40}
              height={40}
            />
          </Avatar>
          <span className="text-white font-medium ml-3 text-lg">
            My Profile
          </span>
        </div>

        <div className="flex border-b">
          <button className="flex-1 py-3 text-green-500 font-medium border-b-2 border-green-500">
            Matches
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {matches.length === 0 ? (
            <div className="p-4 text-gray-500">No matches yet.</div>
          ) : (
            matches.map((match) => (
              <button
                key={match.match_id}
                className={`border-b p-4 flex items-center w-full text-left hover:bg-gray-50 ${
                  selectedMatch?.match_id === match.match_id
                    ? "bg-gray-100"
                    : ""
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
                    {match.other_user.first_name}{" "}
                    {match.other_user.last_name}
                  </div>
                  {/* <div className="text-sm text-gray-500 flex items-center">
                    <ChevronLeft size={16} /> Hello{" "}
                    <span className="ml-1">😊</span>
                  </div> */}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col border-r">
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

        <div className="flex-1 p-4 overflow-y-auto flex flex-col">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`mb-2 flex ${
                m.from === localStorage.getItem("user_id")
                  ? "justify-end"
                  : "justify-start"
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
          <div className="mt-1 flex items-center text-gray-500">
            <Linkedin size={16} className="mr-2" />
            {other?.linkedin_url}
          </div>
          <div className="mt-1 flex items-center text-gray-500">
            <Github size={16} className="mr-2" />
            {other?.github_url}
          </div>
          <div className="mt-1 flex items-center text-gray-500">
            <Twitter size={16} className="mr-2" />
            {other?.twitter_url}
          </div>
          <div className="border-t mt-6 pt-6 flex justify-between">
            {/* <Button variant="outline" className="flex-1 mr-2">
              UNMATCH
            </Button>
            <Button variant="outline" className="flex-1">
              REPORT
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
