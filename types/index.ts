export interface PagesState {
  pages: Page[]
}

export interface SubMedia {
  mediaFilename: string
  mediaType: "Image" | "Video" | "GIF"
  mediaOrientation?: "Square" | "Vertical" | "Horizontal"
  mediaDescription?: string
  subMediaUid: string
}

export interface Page {
  uid: string // Used as the relative link (must be unique, lowercase, hyphenated)
  shortTitle: string
  topTitle?: string
  bottomTitle?: string
  projectSections: ProjectSection[]
}

export interface ProjectSection {
  uid: string
  title: string
  subtitle: string
  description: string
  projects: Project[]
}

export interface Project {
  uid: string // Used as the project identifier in URLs (must be unique, lowercase, hyphenated)
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
