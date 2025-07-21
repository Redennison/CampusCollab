import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Linkedin, AlertCircle } from "lucide-react";
import { BsTwitterX } from "react-icons/bs";
import { useState, useEffect } from "react";
import { validateSocialUrl, getValidationError } from "@/lib/validation";

interface SocialLinksProps {
  formData: {
    linkedin: string;
    github: string;
    x: string;
  };
  onUpdate: (field: string, value: string) => void;
}

export function SocialLinks({ formData, onUpdate }: SocialLinksProps) {
  const [validationErrors, setValidationErrors] = useState({
    linkedin: '',
    github: '',
    x: ''
  });

  // Validate URLs when they change
  useEffect(() => {
    const errors = {
      linkedin: formData.linkedin && !validateSocialUrl.linkedin(formData.linkedin) 
        ? getValidationError('linkedin', formData.linkedin) : '',
      github: formData.github && !validateSocialUrl.github(formData.github) 
        ? getValidationError('github', formData.github) : '',
      x: formData.x && !validateSocialUrl.twitter(formData.x) 
        ? getValidationError('twitter', formData.x) : ''
    };

    setValidationErrors(errors);
  }, [formData.linkedin, formData.github, formData.x]);
  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-xl font-semibold">Social Links</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="linkedin" className="flex items-center gap-2">
            <Linkedin className="w-4 h-4" />
            LinkedIn <span className="text-red-500">*</span>
          </Label>
          <Input
            id="linkedin"
            value={formData.linkedin}
            onChange={(e) => onUpdate("linkedin", e.target.value)}
            placeholder="https://linkedin.com/in/yourusername"
            className={validationErrors.linkedin ? "border-red-500 focus:border-red-500" : ""}
          />
          {validationErrors.linkedin && (
            <div className="flex items-start gap-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{validationErrors.linkedin}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="github" className="flex items-center gap-2">
            <Github className="w-4 h-4" />
            GitHub <span className="text-red-500">*</span>
          </Label>
          <Input
            id="github"
            value={formData.github}
            onChange={(e) => onUpdate("github", e.target.value)}
            placeholder="https://github.com/yourusername"
            className={validationErrors.github ? "border-red-500 focus:border-red-500" : ""}
          />
          {validationErrors.github && (
            <div className="flex items-start gap-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{validationErrors.github}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="x" className="flex items-center gap-2">
            <BsTwitterX className="w-4 h-4" />X
          </Label>
          <Input
            id="x"
            value={formData.x}
            onChange={(e) => onUpdate("x", e.target.value)}
            placeholder="https://x.com/yourusername"
            className={validationErrors.x ? "border-red-500 focus:border-red-500" : ""}
          />
          {validationErrors.x && (
            <div className="flex items-start gap-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{validationErrors.x}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
