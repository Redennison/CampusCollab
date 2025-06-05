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
    
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Image Upload */}
        <div className="space-y-2">
          <Label>Profile Image</Label>
          <div className="flex items-center gap-4">
            {formData.image_url ? (
              <div className="relative w-24 h-24">
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
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <div className="flex-1">
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
              >
                Upload Image
              </Button>
            </div>
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
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
