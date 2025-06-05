import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>
              Your Skills <span className="text-red-500">*</span>
            </Label>
            <span className="text-sm text-gray-500">
              {formData.skills.length}/3 minimum
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge
                key={skill}
                variant={
                  formData.skills.includes(skill) ? "default" : "outline"
                }
                className="cursor-pointer hover:bg-green-100"
                onClick={() => toggleSkill(skill, "skills")}
              >
                {skill}
                {formData.skills.includes(skill) && (
                  <X className="w-3 h-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>
              Skills you're looking for in a partner{" "}
              <span className="text-red-500">*</span>
            </Label>
            <span className="text-sm text-gray-500">
              {formData.desiredSkills.length}/3 minimum
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge
                key={skill}
                variant={
                  formData.desiredSkills.includes(skill) ? "default" : "outline"
                }
                className="cursor-pointer hover:bg-green-100"
                onClick={() => toggleSkill(skill, "desiredSkills")}
              >
                {skill}
                {formData.desiredSkills.includes(skill) && (
                  <X className="w-3 h-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
