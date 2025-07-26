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
  bio: string
  education: {
    id: string
    degree: string
    institution: string
    years: string
  }[]
  experience: {
    id: string
    title: string
    company: string
    period: string
    responsibilities: string[]
  }[]
  skills: string[]
  selectedAboutSection: "bio" | "education" | "experience" | "skills" | null
}

export interface SubMedia {
  mediaFilename: string
  mediaType: "Image" | "Video" | "GIF"
  mediaOrientation?: "Square" | "Vertical" | "Horizontal"
  mediaDescription?: string
  subMediaUid: string
}

export interface ProjectPage {
  uid: string // Internal unique identifier
  path: string // Used as the relative link (must be unique, lowercase, hyphenated)
  shortTitle: string
  topTitle?: string
  bottomTitle?: string
  projectSections: ProjectSection[]
}

export interface ProjectSection {
  uid: string // Internal unique identifier
  path: string // Used in URLs (must be unique within page, lowercase, hyphenated)
  title: string
  subtitle: string
  description: string
  projects: Project[]
}

export interface Project {
  uid: string // Internal unique identifier
  path: string // Used as the project identifier in URLs (must be unique within section, lowercase, hyphenated)
  projectTitle: string
  projectSubtitle: string
  imageFilename: string
  projectParagraphs: {
    paragraphTitle: string
    paragraphText: string
    paragraphUid: string
  }[]
  subMedia: SubMedia[]
  featured?: boolean // New field to mark featured projects
}