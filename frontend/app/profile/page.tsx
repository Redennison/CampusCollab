"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { PersonalInfo } from "@/components/onboarding/PersonalInfo";
import { Interests } from "@/components/onboarding/Interests";
import { Skills } from "@/components/onboarding/Skills";
import { SocialLinks } from "@/components/onboarding/SocialLinks";
import { SecuritySettings } from "@/components/profile/SecuritySettings";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast, ToastContainer } from "react-toastify";
import { validateSocialUrl } from "@/lib/validation";
import "react-toastify/dist/ReactToastify.css";

interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  bio: string;
  image_url: string;
  user_sector: string[];
  user_domain: string[];
  desired_domain: string[];
  skills: string[];
  desired_skills: string[];
  linkedin_url: string;
  github_url: string;
  twitter_url: string;
  has_onboarded: boolean;
}

interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  bio?: string;
  image_url?: string;
  user_sector?: string[];
  user_domain?: string[];
  desired_domain?: string[];
  skills?: string[];
  desired_skills?: string[];
  linkedin_url?: string;
  github_url?: string;
  twitter_url?: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  bio: string;
  image_url: string;
  sector: string[];
  domain: string[];
  desiredDomain: string[];
  skills: string[];
  desiredSkills: string[];
  github: string;
  linkedin: string;
  x: string;
}

export default function ProfilePage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    bio: "",
    image_url: "",
    sector: [],
    domain: [],
    desiredDomain: [],
    skills: [],
    desiredSkills: [],
    github: "",
    linkedin: "",
    x: "",
  });
  
  const [originalData, setOriginalData] = useState<FormData>({
    firstName: "",
    lastName: "",
    bio: "",
    image_url: "",
    sector: [],
    domain: [],
    desiredDomain: [],
    skills: [],
    desiredSkills: [],
    github: "",
    linkedin: "",
    x: "",
  });

  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const router = useRouter();

  // Check authentication and load user data on mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/");
      return;
    }
    loadUserData();
  }, [router]);

  // Check for changes
  useEffect(() => {
    const hasDataChanged = JSON.stringify(formData) !== JSON.stringify(originalData);
    setHasChanges(hasDataChanged);
  }, [formData, originalData]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("/api/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const userData: UserData = await response.json();
      
      // Convert backend data format to form data format
      const convertedData: FormData = {
        firstName: userData.first_name || "",
        lastName: userData.last_name || "",
        bio: userData.bio || "",
        image_url: userData.image_url || "",
        sector: userData.user_sector || [],
        domain: userData.user_domain || [],
        desiredDomain: userData.desired_domain || [],
        skills: userData.skills || [],
        desiredSkills: userData.desired_skills || [],
        github: userData.github_url || "",
        linkedin: userData.linkedin_url || "",
        x: userData.twitter_url || "",
      };

      setFormData(convertedData);
      setOriginalData(convertedData);
      setUserEmail(userData.email || "");
    } catch (error) {
      console.error("Failed to load user data:", error);
      toast.error("Failed to load profile data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEmailChange = async (newEmail: string) => {
    try {
      // For this implementation, we'll use the existing update endpoint
      // In a production app, you'd want a separate endpoint that verifies the password
      await updateUserData({ email: newEmail } as any);
      setUserEmail(newEmail);
      toast.success("Email updated successfully!");
    } catch (error) {
      toast.error("Failed to update email. Please try again.");
      throw error;
    }
  };

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    try {
      // For this implementation, we'll create a password-specific update
      // In a production app, you'd want a separate endpoint that verifies the current password
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("/api/users/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          password: newPassword, 
          current_password: currentPassword 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update password");
      }

      toast.success("Password updated successfully!");
    } catch (error) {
      toast.error("Failed to update password. Please verify your current password.");
      throw error;
    }
  };

  const updateUserData = async (updateData: UpdateUserData) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("/api/users/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to update user data:", error);
      throw error;
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Convert form data back to backend format
      const updateData: UpdateUserData = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        bio: formData.bio.trim(),
        image_url: formData.image_url,
        user_sector: formData.sector,
        user_domain: formData.domain,
        desired_domain: formData.desiredDomain,
        skills: formData.skills,
        desired_skills: formData.desiredSkills,
        linkedin_url: formData.linkedin.trim(),
        github_url: formData.github.trim(),
        twitter_url: formData.x.trim(),
      };

      // Remove empty fields to avoid overwriting with empty values
      Object.keys(updateData).forEach(key => {
        const value = updateData[key as keyof UpdateUserData];
        if (value === "" || (Array.isArray(value) && value.length === 0)) {
          delete updateData[key as keyof UpdateUserData];
        }
      });

      await updateUserData(updateData);
      
      // Update original data to reflect saved state
      setOriginalData({ ...formData });
      setHasChanges(false);
      
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFormData({ ...originalData });
    setHasChanges(false);
  };

  const isFormValid = () => {
    return (
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.sector.length > 0 &&
      formData.domain.length > 0 &&
      formData.skills.length >= 3 &&
      formData.desiredSkills.length >= 3 &&
      validateSocialUrl.linkedin(formData.linkedin) &&
      validateSocialUrl.github(formData.github) &&
      validateSocialUrl.twitter(formData.x)
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <p className="text-gray-600">Loading profile...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <ToastContainer position="bottom-right" />
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Profile Settings
            </h1>
            <p className="text-gray-600">
              Update your profile information and preferences
            </p>
          </div>

          {/* Personal Information */}
          <Card className="p-4 sm:p-6">
            <PersonalInfo
              formData={{
                firstName: formData.firstName,
                lastName: formData.lastName,
                bio: formData.bio,
                image_url: formData.image_url,
              }}
              onUpdate={(field, value) => handleUpdate(field, value as string)}
            />
          </Card>

          <Separator />

          {/* Interests */}
          <Card className="p-4 sm:p-6">
            <Interests
              formData={{
                sector: formData.sector,
                domain: formData.domain,
                desiredDomain: formData.desiredDomain,
              }}
              onUpdate={(field, value) => handleUpdate(field, value as string[])}
            />
          </Card>

          <Separator />

          {/* Skills */}
          <Card className="p-4 sm:p-6">
            <Skills
              formData={{
                skills: formData.skills,
                desiredSkills: formData.desiredSkills,
              }}
              onUpdate={(field, value) => handleUpdate(field, value as string[])}
            />
          </Card>

          <Separator />

          {/* Social Links */}
          <Card className="p-4 sm:p-6">
            <SocialLinks
              formData={{
                linkedin: formData.linkedin,
                github: formData.github,
                x: formData.x,
              }}
              onUpdate={(field, value) => handleUpdate(field, value as string)}
            />
          </Card>

          <Separator />

          {/* Security Settings */}
          <Card className="p-4 sm:p-6">
            <SecuritySettings
              currentEmail={userEmail}
              onEmailChange={handleEmailChange}
              onPasswordChange={handlePasswordChange}
            />
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={!hasChanges || isSaving}
              className="w-full sm:w-auto"
            >
              Reset Changes
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isFormValid() || !hasChanges || isSaving}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          {/* Validation Messages */}
          {!isFormValid() && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">
                Please complete the following:
              </h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                {formData.firstName.trim() === "" && (
                  <li>• First name is required</li>
                )}
                {formData.lastName.trim() === "" && (
                  <li>• Last name is required</li>
                )}
                {formData.sector.length === 0 && (
                  <li>• At least one sector must be selected</li>
                )}
                {formData.domain.length === 0 && (
                  <li>• At least one domain must be selected</li>
                )}
                {formData.skills.length < 3 && (
                  <li>• At least 3 skills must be selected</li>
                )}
                {formData.desiredSkills.length < 3 && (
                  <li>• At least 3 desired skills must be selected</li>
                )}
                {!validateSocialUrl.github(formData.github) && (
                  <li>• Valid GitHub URL is required (e.g., https://github.com/username)</li>
                )}
                {!validateSocialUrl.linkedin(formData.linkedin) && (
                  <li>• Valid LinkedIn URL is required (e.g., https://linkedin.com/in/username)</li>
                )}
                {formData.x.trim() !== "" && !validateSocialUrl.twitter(formData.x) && (
                  <li>• Invalid X/Twitter URL format (e.g., https://x.com/username)</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 