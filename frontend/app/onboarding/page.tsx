"use client";

import { useState } from "react";
import { PersonalInfo } from "@/components/onboarding/PersonalInfo";
import { Interests } from "@/components/onboarding/Interests";
import { Skills } from "@/components/onboarding/Skills";
import { SocialLinks } from "@/components/onboarding/SocialLinks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

const steps = [
  { id: "personal", title: "Personal Info" },
  { id: "interests", title: "Interests" },
  { id: "skills", title: "Skills" },
  { id: "social", title: "Social Links" },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
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

  const handleUpdate = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {};

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
    <div className="min-h-screen bg-white">
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
                disabled={currentStep === 0}
                className="text-sm sm:text-base"
              >
                Back
              </Button>
              {currentStep === steps.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid()}
                  className="bg-green-500 hover:bg-green-600 text-sm sm:text-base"
                >
                  Complete
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="bg-green-500 hover:bg-green-600 text-sm sm:text-base"
                >
                  Next
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
