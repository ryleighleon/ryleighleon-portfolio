export interface PagesState {
  pages: ProjectPage[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
  initialized: boolean
  selectedPageId: string | null
  selectedSectionId: string | null
  selectedProjectId: string | null
  selectedSubMediaId: string | null
}

export interface AboutState {
  bio: string;
  education: {
    id: string;
    degree: string;
    institution: string;
    years: string;
    accomplishments?: string[];
  }[];
  experience: {
    id: string;
    title: string;
    company: string;
    period: string;
    responsibilities: string[];
  }[];
  skills: string[];
  awardsAndExhibitions: {
    id: string;
    title: string;
    subtitle?: string;
    date: string;
    descriptions: string[];
  }[];
  selectedAboutSection: "bio" | "education" | "experience" | "skills" | "awardsAndExhibitions" | null;
}

export interface SubMedia {
  mediaFilename: string
  thumbnailImage?: string
  mediaType: "Image" | "Video" | "GIF"
  mediaOrientation?: "Square" | "Vertical" | "Horizontal"
  mediaDescription?: string
  subMediaUid: string
}

export interface ProjectPage {
  uid: string
  path: string
  shortTitle: string
  topTitle?: string
  bottomTitle?: string
  projectSections: ProjectSection[]
}

export interface ProjectSection {
  uid: string
  path: string
  title: string
  subtitle: string
  description: string
  projects: Project[]
}

export interface Project {
  uid: string
  path: string
  projectTitle: string
  projectSubtitle: string
  thumbnailImage?: string
  mainImage: string
  projectParagraphs: {
    paragraphTitle: string
    paragraphText: string
    paragraphUid: string
  }[]
  subMedia: SubMedia[]
  featured?: boolean
}