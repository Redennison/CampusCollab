import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const sectors = [
  "Healthcare",
  "Fintech",
  "Education",
  "E-commerce",
  "Entertainment",
  "Social Media",
  "Enterprise",
  "Other",
];

const domains = [
  "Infrastructure",
  "Frontend",
  "Backend",
  "Mobile",
  "DevOps",
  "Machine Learning",
  "Data Science",
  "Security",
  "Blockchain",
  "Other",
];

interface InterestsProps {
  formData: {
    sector: string[];
    domain: string[];
    desiredDomain: string[];
  };
  onUpdate: (field: string, value: string[]) => void;
}

export function Interests({ formData, onUpdate }: InterestsProps) {
  const toggleSelection = (
    item: string,
    field: "sector" | "domain" | "desiredDomain"
  ) => {
    const currentItems = formData[field];
    const newItems = currentItems.includes(item)
      ? currentItems.filter((i) => i !== item)
      : [...currentItems, item];
    onUpdate(field, newItems);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Interests & Expertise</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>
            Domain/Specialization <span className="text-red-500">*</span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {domains.map((domain) => (
              <Badge
                key={domain}
                variant={
                  formData.domain.includes(domain) ? "default" : "outline"
                }
                className={`cursor-pointer ${
                  !formData.domain.includes(domain) ? "hover:bg-green-100" : ""
                }`}
                onClick={() => toggleSelection(domain, "domain")}
              >
                {domain}
                {formData.domain.includes(domain) && (
                  <X className="w-3 h-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label>
            Desired Partner Domain/Specialization{" "}
            <span className="text-red-500">*</span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {domains.map((domain) => (
              <Badge
                key={domain}
                variant={
                  formData.desiredDomain.includes(domain)
                    ? "default"
                    : "outline"
                }
                className={`cursor-pointer ${
                  !formData.desiredDomain.includes(domain)
                    ? "hover:bg-green-100"
                    : ""
                }`}
                onClick={() => toggleSelection(domain, "desiredDomain")}
              >
                {domain}
                {formData.desiredDomain.includes(domain) && (
                  <X className="w-3 h-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label>
            Sector <span className="text-red-500">*</span>
          </Label>
          <div className="flex flex-wrap gap-2">
            {sectors.map((sector) => (
              <Badge
                key={sector}
                variant={
                  formData.sector.includes(sector) ? "default" : "outline"
                }
                className={`cursor-pointer ${
                  !formData.sector.includes(sector) ? "hover:bg-green-300" : ""
                }`}
                onClick={() => toggleSelection(sector, "sector")}
              >
                {sector}
                {formData.sector.includes(sector) && (
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
