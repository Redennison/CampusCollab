import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const sectors = [
  "Healthcare",
  "Fintech",
  "Education",
  "E-commerce",
  "Retail",
  "Entertainment",
  "Social Media",
  "Gaming",
  "Transportation / Mobility",
  "Real Estate",
  "Government / Public Sector",
  "Climate / Sustainability",
  "Legal",
  "Communications",
  "B2B / Enterprise",
  "Web3",
];

const domains = [
  "Frontend",
  "Backend",
  "Mobile",
  "DevOps",
  "Infrastructure",
  "AI/ML",
  "UI/UX",
  "Data Science",
  "Security",
  "Blockchain",
  "IoT",
  "AR/VR",
  "Game Dev",
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
    <div className="w-full space-y-4 sm:space-y-6">
      <h2 className="text-lg sm:text-xl font-semibold">
        Interests & Expertise
      </h2>

      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-3 sm:space-y-4">
          <Label className="text-sm sm:text-base">
            Domain/Specialization <span className="text-red-500">*</span>
          </Label>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {domains.map((domain) => (
              <Badge
                key={domain}
                variant={
                  formData.domain.includes(domain) ? "default" : "outline"
                }
                className={`cursor-pointer text-xs sm:text-sm ${
                  !formData.domain.includes(domain) ? "hover:bg-green-100" : ""
                }`}
                onClick={() => toggleSelection(domain, "domain")}
              >
                {domain}
                {formData.domain.includes(domain) && (
                  <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <Label className="text-sm sm:text-base">
            Desired Partner Domain/Specialization{" "}
            <span className="text-red-500">*</span>
          </Label>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {domains.map((domain) => (
              <Badge
                key={domain}
                variant={
                  formData.desiredDomain.includes(domain)
                    ? "default"
                    : "outline"
                }
                className={`cursor-pointer text-xs sm:text-sm ${
                  !formData.desiredDomain.includes(domain)
                    ? "hover:bg-green-100"
                    : ""
                }`}
                onClick={() => toggleSelection(domain, "desiredDomain")}
              >
                {domain}
                {formData.desiredDomain.includes(domain) && (
                  <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <Label className="text-sm sm:text-base">
            Sector <span className="text-red-500">*</span>
          </Label>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {sectors.map((sector) => (
              <Badge
                key={sector}
                variant={
                  formData.sector.includes(sector) ? "default" : "outline"
                }
                className={`cursor-pointer text-xs sm:text-sm ${
                  !formData.sector.includes(sector) ? "hover:bg-green-100" : ""
                }`}
                onClick={() => toggleSelection(sector, "sector")}
              >
                {sector}
                {formData.sector.includes(sector) && (
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
