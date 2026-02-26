export type PublicationStatus =
  | "published"
  | "in-press"
  | "under-review"
  | "in-prep";

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  date: string;
  year: number;
  doi?: string;
  journal: string;
  status: PublicationStatus;
  tags: string[];
  pdfUrl?: string;
  abstract?: string;
  isFirstAuthor?: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  role?: string;
  collaborators?: string;
  featured: boolean;
  links: { label: string; url: string }[];
  imageCaption?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface Education {
  degree: string;
  institution: string;
}

export interface Profile {
  name: string;
  shortName: string;
  role: string;
  affiliation: string;
  affiliationUrl: string;
  bio: string[];
  interests: string[];
  education: Education[];
  social: SocialLink[];
  email: string;
}

export interface Resource {
  title: string;
  context: string;
  description: string;
  links: { label: string; url: string }[];
}

export interface ResearchNode {
  id: string;
  label: string;
  category: "pre-phd" | "phd";
  size: number;
  description: string;
  publicationCount: number;
  connections: string[];
}

export interface NewsItem {
  id: string;
  date: string;
  text: string;
  link?: { label: string; url: string };
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  readingTime: number;
}

export interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  era: "pre-phd" | "phd";
  relatedIds?: string[];
}
