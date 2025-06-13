import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const skills = [
  // Frontend
  "React",
  "Vue",
  "Angular",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "HTML",
  "CSS",
  "Tailwind",
  // Backend
  "Node.js",
  "Python",
  "Ruby",
  "Java",
  "Go",
  "PHP",
  "Django",
  "Flask",
  "Express",
  "Spring",
  // Mobile
  "React Native",
  "Flutter",
  "Swift",
  "Kotlin",
  // DevOps
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "GCP",
  "Terraform",
  // ML/AI
  "TensorFlow",
  "PyTorch",
  "Scikit-learn",
  "OpenAI",
  "Hugging Face",
  // Database
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "MySQL",
  // Other
  "GraphQL",
  "REST",
  "WebSocket",
  "Blockchain",
  "Solidity",
];

interface SkillsProps {
  formData: {
    skills: string[];
    desiredSkills: string[];
  };
  onUpdate: (field: string, value: string[]) => void;
}

export function Skills({ formData, onUpdate }: SkillsProps) {
  const toggleSkill = (skill: string, field: "skills" | "desiredSkills") => {
    const currentSkills = formData[field];
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter((s) => s !== skill)
      : [...currentSkills, skill];
    onUpdate(field, newSkills);
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-xl font-semibold">Skills</h2>

      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm sm:text-base">
              Your Skills <span className="text-red-500">*</span>
            </Label>
            <span className="text-xs sm:text-sm text-gray-500">
              {formData.skills.length}/3 minimum
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {skills.map((skill) => (
              <Badge
                key={skill}
                variant={
                  formData.skills.includes(skill) ? "default" : "outline"
                }
                className={`cursor-pointer text-xs sm:text-sm ${
                  !formData.skills.includes(skill) ? "hover:bg-green-100" : ""
                }`}
                onClick={() => toggleSkill(skill, "skills")}
              >
                {skill}
                {formData.skills.includes(skill) && (
                  <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm sm:text-base">
              Skills you&apos;re looking for in a partner{" "}
              <span className="text-red-500">*</span>
            </Label>
            <span className="text-xs sm:text-sm text-gray-500">
              {formData.desiredSkills.length}/3 minimum
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {skills.map((skill) => (
              <Badge
                key={skill}
                variant={
                  formData.desiredSkills.includes(skill) ? "default" : "outline"
                }
                className={`cursor-pointer text-xs sm:text-sm ${
                  !formData.desiredSkills.includes(skill)
                    ? "hover:bg-green-100"
                    : ""
                }`}
                onClick={() => toggleSkill(skill, "desiredSkills")}
              >
                {skill}
                {formData.desiredSkills.includes(skill) && (
                  <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
