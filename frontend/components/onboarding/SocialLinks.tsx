import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Linkedin } from "lucide-react";
import { BsTwitterX } from "react-icons/bs";

interface SocialLinksProps {
  formData: {
    linkedin: string;
    github: string;
    x: string;
  };
  onUpdate: (field: string, value: string) => void;
}

export function SocialLinks({ formData, onUpdate }: SocialLinksProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Social Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="linkedin" className="flex items-center gap-2">
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </Label>
          <Input
            id="linkedin"
            value={formData.linkedin}
            onChange={(e) => onUpdate("linkedin", e.target.value)}
            placeholder="https://linkedin.com/in/yourusername"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="github" className="flex items-center gap-2">
            <Github className="w-4 h-4" />
            GitHub
          </Label>
          <Input
            id="github"
            value={formData.github}
            onChange={(e) => onUpdate("github", e.target.value)}
            placeholder="https://github.com/yourusername"
          />
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
          />
        </div>
      </CardContent>
    </Card>
  );
}
