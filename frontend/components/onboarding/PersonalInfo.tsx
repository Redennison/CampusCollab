import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface PersonalInfoProps {
  formData: {
    firstName: string;
    lastName: string;
    bio: string;
    image_url: string;
  };
  onUpdate: (field: string, value: string) => void;
}

export function PersonalInfo({ formData, onUpdate }: PersonalInfoProps) {
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Profile Image Upload */}
        <div className="space-y-2">
          <Label>Profile Image</Label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {formData.image_url ? (
              <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                <Image
                  src={formData.image_url}
                  alt="Profile"
                  fill
                  className="rounded-full object-cover"
                />
                <button
                  onClick={() => onUpdate("image_url", "")}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
              </div>
            )}
            <div className="w-full sm:flex-1">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById("image-upload")?.click()}
                className="w-full sm:w-auto"
              >
                Upload Image
              </Button>
            </div>
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">
              First Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => onUpdate("firstName", e.target.value)}
              placeholder="John"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">
              Last Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => onUpdate("lastName", e.target.value)}
              placeholder="Doe"
              required
            />
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => onUpdate("bio", e.target.value)}
            placeholder="Tell us about yourself..."
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
    </Card>
  );
}
