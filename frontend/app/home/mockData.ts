//id: string
//first_name: string
//last_name: string


export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  bio: string;
  image_url: string;
  user_domain: string[];
  user_sector: string[];
  skills: string[];
  linkedin_url: string;
  github_url: string;
  twitter_url: string;
}

export const mockProfiles: Profile[] = [
  {
    id: "p1",
    first_name: "Lena",
    last_name: "Kaur",
    bio: "Frontend developer creating beautiful, accessible user interfaces.",
    image_url: "https://randomuser.me/api/portraits/women/65.jpg",
    user_domain: ["Frontend", "UI/UX"],
    user_sector: ["E-commerce", "Retail"],
    skills: ["React", "TypeScript", "Tailwind", "GraphQL", "CSS"],
    linkedin_url: "https://linkedin.com/in/lenakaur",
    github_url: "https://github.com/lenakaur",
    twitter_url: "https://twitter.com/lena_codes"
  },
  {
    id: "p2",
    first_name: "Marcus",
    last_name: "Zhang",
    bio: "Backend and infrastructure engineer with a passion for scalable systems.",
    image_url: "https://randomuser.me/api/portraits/men/32.jpg",
    user_domain: ["Backend", "Infrastructure", "DevOps"],
    user_sector: ["Fintech", "B2B / Enterprise"],
    skills: ["Go", "Docker", "PostgreSQL", "AWS", "Terraform"],
    linkedin_url: "https://linkedin.com/in/marcuszhang",
    github_url: "https://github.com/marcuszh",
    twitter_url: "https://twitter.com/marcusinfra"
  },
  {
    id: "p3",
    first_name: "Aria",
    last_name: "Singh",
    bio: "Mobile developer building cross-platform apps with Flutter and Kotlin.",
    image_url: "https://randomuser.me/api/portraits/women/12.jpg",
    user_domain: ["Mobile"],
    user_sector: ["Healthcare", "Education"],
    skills: ["Flutter", "Kotlin", "Firebase", "REST", "Node.js"],
    linkedin_url: "https://linkedin.com/in/ariasingh",
    github_url: "https://github.com/ariadev",
    twitter_url: "https://twitter.com/aria_codes"
  },
  {
    id: "p4",
    first_name: "Ethan",
    last_name: "Wright",
    bio: "AI/ML researcher building models for sustainable urban mobility.",
    image_url: "https://randomuser.me/api/portraits/men/45.jpg",
    user_domain: ["AI/ML", "Data Science"],
    user_sector: ["Climate / Sustainability", "Transportation / Mobility"],
    skills: ["Python", "TensorFlow", "Scikit-learn", "OpenAI", "Hugging Face"],
    linkedin_url: "https://linkedin.com/in/ethanwrightai",
    github_url: "https://github.com/ethan-ml",
    twitter_url: "https://twitter.com/ethanwrightml"
  },
  {
    id: "p5",
    first_name: "Zara",
    last_name: "Hughes",
    bio: "Blockchain developer working on secure smart contracts and Web3 tools.",
    image_url: "https://randomuser.me/api/portraits/women/29.jpg",
    user_domain: ["Blockchain", "Security"],
    user_sector: ["Web3", "Legal"],
    skills: ["Solidity", "Blockchain", "WebSocket", "Node.js", "Redis"],
    linkedin_url: "https://linkedin.com/in/zarahughes",
    github_url: "https://github.com/zaradev",
    twitter_url: "https://twitter.com/zaraweb3"
  }
];

