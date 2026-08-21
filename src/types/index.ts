export interface TerminalHistoryItem {
  id: string;
  command: string;
  timestamp: string;
  output: string | React.ReactNode;
  isError?: boolean;
}

export interface ProjectMetric {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  status: "LIVE PRODUCTION" | "IN DEVELOPMENT" | "ARCHIVED";
  metrics: ProjectMetric[];
  techStack: string[];
  highlights: string[];
  liveUrl?: string;
  repoUrl?: string;
  badge?: string;
}

export interface StackCategory {
  title: string;
  description: string;
  iconName: string;
  items: {
    name: string;
    role: string;
    tier: string;
    cost: "$0.00";
    badge?: string;
  }[];
}

export interface SocialLink {
  name: string;
  handle: string;
  url: string;
  icon: string;
  badge?: string;
}
