"use client"

import { Heart, X, Github, Linkedin, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface Profile {
  id: string
  first_name: string
  last_name: string
  bio: string
  image_url: string
  user_domain: string[]
  user_sector: string[]
  skills: string[]
  linkedin_url: string
  github_url: string
  twitter_url: string
}

interface ProfileCardProps {
  profile: Profile
  onLike?: () => void
  onPass?: () => void
}

export default function ProfileCard({
  profile,
  onLike,
  onPass,
}: ProfileCardProps) {
  const socialLinks = [
    { url: profile.linkedin_url, icon: Linkedin, label: "LinkedIn" },
    { url: profile.github_url, icon: Github, label: "GitHub" },
    { url: profile.twitter_url, icon: Twitter, label: "Twitter" },
  ].filter((link) => link.url)

  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden shadow-lg pt-0">
      <div className="relative">
        <img
          src={profile.image_url || "/placeholder.svg?height=400&width=400"}
          alt={`${profile.first_name} ${profile.last_name}`}
          className="w-full h-80 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h2 className="text-white text-2xl font-bold">
            {profile.first_name} {profile.last_name}
          </h2>
        </div>
      </div>

      <CardContent className="space-y-4">
        {/* Domains and Action Buttons */}
        {profile.user_domain.length > 0 && (
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Domains</h3>
              <div className="flex flex-wrap gap-1">
                {profile.user_domain.map((domain, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {domain}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                className="w-10 h-10 rounded-full border-red-200 text-red-600 hover:bg-red-50 bg-transparent p-0"
                onClick={onPass}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Pass</span>
              </Button>
              <Button size="sm" className="w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 p-0" onClick={onLike}>
                <Heart className="h-4 w-4" />
                <span className="sr-only">Like</span>
              </Button>
            </div>
          </div>
        )}

        {/* Skills */}
        {profile.skills.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-1">
              {profile.skills.map((skill, index) => (
                <Badge key={index} variant="default" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Bio */}
        <div>
          <p className="text-gray-700 text-sm leading-relaxed">{profile.bio}</p>
        </div>

        {/* Sectors */}
        {profile.user_sector.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Sectors</h3>
            <div className="flex flex-wrap gap-1">
              {profile.user_sector.map((sector, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {sector}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Connect</h3>
            <div className="flex gap-2">
              {socialLinks.map((link, index) => {
                const Icon = link.icon
                return (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="p-2 bg-transparent"
                    onClick={() => window.open(link.url, "_blank")}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="sr-only">{link.label}</span>
                  </Button>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
