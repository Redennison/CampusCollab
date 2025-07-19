"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PersonalInfo } from "@/components/onboarding/PersonalInfo";
import { Interests } from "@/components/onboarding/Interests";
import { Skills } from "@/components/onboarding/Skills";
import { SocialLinks } from "@/components/onboarding/SocialLinks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";

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
  has_onboarded?: boolean;
}

const steps = [
  { id: "personal", title: "Personal Info" },
  { id: "interests", title: "Interests" },
  { id: "skills", title: "Skills" },
  { id: "social", title: "Social Links" },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
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

  const router = useRouter();

  // Check for authentication token on component mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/");
      return;
    }
  }, [router]);

  const handleUpdate = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Function to send data to Next.js API route (which then calls FastAPI)
  const updateUserData = async (stepData: UpdateUserData) => {
    try {
      setIsLoading(true);

      // Get the JWT token from localStorage
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
        body: JSON.stringify(stepData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Update successful:", result);
      return result;
    } catch (error) {
      console.error("Failed to update user data:", error);
      // You might want to show an error message to the user here
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    try {
      // Prepare data based on current step
      let stepData: UpdateUserData = {};

      switch (currentStep) {
        case 0: // Personal Info
          stepData = {
            first_name: formData.firstName,
            last_name: formData.lastName,
            bio: formData.bio,
            image_url: formData.image_url,
          };
          break;
        case 1: // Interests
          stepData = {
            user_sector: formData.sector,
            user_domain: formData.domain,
            desired_domain: formData.desiredDomain,
          };
          break;
        case 2: // Skills
          stepData = {
            skills: formData.skills,
            desired_skills: formData.desiredSkills,
          };
          console.log("Skills data being sent:", stepData);
          break;
        case 3: // Social Links
          stepData = {
            linkedin_url: formData.linkedin,
            github_url: formData.github,
            twitter_url: formData.x,
          };
          console.log("Social Links data being sent:", stepData);
          break;
      }

      console.log(`Step ${currentStep} data:`, stepData);

      // Only make API call if there's data to send
      if (Object.keys(stepData).length > 0) {
        await updateUserData(stepData);
      }

      // Move to next step
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      }
    } catch (error) {
      // Handle error - you might want to show a toast or error message
      console.error("Error updating user data:", error);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Send skills data one final time to ensure they're saved
      const skillsData = {
        skills: formData.skills,
        desired_skills: formData.desiredSkills,
      };

      // Only send skills if they have data
      if (formData.skills.length > 0 || formData.desiredSkills.length > 0) {
        await updateUserData(skillsData);
      }

      // Send social links data one final time to ensure they're saved
      const socialLinksData = {
        linkedin_url: formData.linkedin,
        github_url: formData.github,
        twitter_url: formData.x,
      };

      // Only send social links if they have data
      if (formData.linkedin || formData.github || formData.x) {
        await updateUserData(socialLinksData);
      }

      // Mark onboarding as complete
      await updateUserData({ has_onboarded: true });

      // Redirect to home page after successful onboarding
      console.log("Onboarding completed! Redirecting to home...");
      router.push("/home");
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return (
          formData.firstName.trim() !== "" && formData.lastName.trim() !== ""
        );
      case 1:
        return formData.sector.length > 0 && formData.domain.length > 0;
      case 2:
        return (
          formData.skills.length >= 3 && formData.desiredSkills.length >= 3
        );
      case 3:
        return formData.github.trim() !== "" && formData.linkedin.trim() !== "";
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-4 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Welcome to MatchaGoose
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Let&apos;s get to know you better. This will help us match you
              with the right people.
            </p>
          </div>

          <div className="mb-8 sm:mb-12">
            <div className="flex justify-between items-center relative">
              {/* Background track */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gray-200" />

              {/* Animated progress bar */}
              <div
                className="absolute top-0 left-0 h-2 bg-green-500 transition-all duration-500 ease-in-out"
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
              />

              {/* Step indicators */}
              {steps.map((step, index) => (
                <div key={step.id} className="flex-1 relative">
                  <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 transform -translate-x-1/2">
                    <span
                      className={`text-sm font-medium transition-colors duration-300 ${
                        currentStep === index
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      <span className="hidden pb-5 md:inline">
                        {step.title}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card className="p-4 sm:p-6">
            {currentStep === 0 && (
              <PersonalInfo
                formData={{
                  firstName: formData.firstName,
                  lastName: formData.lastName,
                  bio: formData.bio,
                  image_url: formData.image_url,
                }}
                onUpdate={(field, value) =>
                  handleUpdate(field, value as string)
                }
              />
            )}
            {currentStep === 1 && (
              <Interests
                formData={{
                  sector: formData.sector,
                  domain: formData.domain,
                  desiredDomain: formData.desiredDomain,
                }}
                onUpdate={(field, value) =>
                  handleUpdate(field, value as string[])
                }
              />
            )}
            {currentStep === 2 && (
              <Skills
                formData={{
                  skills: formData.skills,
                  desiredSkills: formData.desiredSkills,
                }}
                onUpdate={(field, value) =>
                  handleUpdate(field, value as string[])
                }
              />
            )}
            {currentStep === 3 && (
              <SocialLinks
                formData={{
                  linkedin: formData.linkedin,
                  github: formData.github,
                  x: formData.x,
                }}
                onUpdate={(field, value) =>
                  handleUpdate(field, value as string)
                }
              />
            )}

            <div className="flex justify-between mt-6 sm:mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0 || isLoading}
                className="text-sm sm:text-base"
              >
                Back
              </Button>
              {currentStep === steps.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isLoading}
                  className="bg-green-500 hover:bg-green-600 text-sm sm:text-base"
                >
                  {isLoading ? "Completing..." : "Complete"}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid() || isLoading}
                  className="bg-green-500 hover:bg-green-600 text-sm sm:text-base"
                >
                  {isLoading ? "Saving..." : "Next"}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
