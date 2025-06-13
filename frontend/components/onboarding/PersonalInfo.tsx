import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-xl font-semibold">Personal Information</h2>

      {/* Profile Image Upload */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Profile Image</Label>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {formData.image_url ? (
            <div className="relative group">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-2 ring-offset-2 ring-primary/20 transition-all duration-200 hover:ring-primary/40">
                <Image
                  src={formData.image_url}
                  alt="Profile"
                  fill
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              <button
                onClick={() => onUpdate("image_url", "")}
                className="absolute -top-2 -right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors duration-200 shadow-sm"
                aria-label="Remove profile image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden">
              <div className="w-full h-full border-2 border-dashed border-muted-foreground/25 rounded-full flex items-center justify-center bg-muted/5 transition-colors duration-200 hover:bg-muted/10 hover:border-muted-foreground/40">
                <Upload className="w-8 h-8 text-muted-foreground/50" />
              </div>
            </div>
          )}
          <div className="w-full sm:flex-1 space-y-2">
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
              className="w-full sm:w-auto gap-2 transition-colors duration-200"
            >
              <Upload className="w-4 h-4" />
              {formData.image_url ? "Change Image" : "Upload Image"}
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
          placeholder="Tell us about what drives you and what you're looking for in your next opportunity..."
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
}
