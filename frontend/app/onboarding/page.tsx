"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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

  const handleSubmit = async () => {
   
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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to MatchaGoose
            </h1>
            <p className="text-gray-600">
              Let&apos;s get to know you better. This will help us match you
              with the right people.
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center">
              {steps.map((step, index) => (
                <div key={step.id} className="flex-1 relative">
                  <div
                    className={`h-2 ${
                      index <= currentStep ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                    <span
                      className={`text-sm ${
                        index === currentStep
                          ? "text-green-500 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card className="p-6">
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

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                Back
              </Button>
              {currentStep === steps.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid()}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Complete
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="bg-green-500 hover:bg-green-600"
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
