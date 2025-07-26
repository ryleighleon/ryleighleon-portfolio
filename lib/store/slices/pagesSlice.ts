import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Page, PagesState } from "@/types"
import fs from "fs"
import path from "path"

// Initial state with loading status
const initialState: PagesState & {
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
  initialized: boolean
} = {
  pages: [],
  status: "idle",
  error: null,
  initialized: false,
}

// Default data to use if no data is found
const defaultPagesData = [
  {
    uid: "home",
    shortTitle: "Home",
    topTitle: "Welcome!",
    projectSections: [],
  },
  {
    uid: "portfolio",
    shortTitle: "Portfolio",
    topTitle: "My Work",
    projectSections: [
      {
        uid: "branding",
        title: "Branding",
        subtitle: "Identity Design",
        description: "A collection of branding and identity design projects.",
        projects: [
          {
            uid: "target",
            thumbnailImageFilename:
                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-22%20at%208.56.17%E2%80%AFPM-qUB2hQS9wxoDYZ2eyqquVsK6wOdpmR.png",
            projectTitle: "Target",
            projectSubtitle: "Art Direction",
            imageName: "Target Mondo Llama",
            projectParagraphs: [
              {
                paragraphTitle: "The Project",
                paragraphText:
                    "Target is launching a new Mondo Llama product of paint and paintbrushes. They want a physical and a digital banner ad for the new product. A professional photographer will photograph the concept. You will direct them based on your sketches, mood board, and layout concepts to communicate your vision to the photographer. Both ads need to include: Target logo, Target Visual Identity Headline and copy Photography of product Item name + price",
                paragraphUid: "target-p1",
              },
            ],
            subMedia: [
              {
                mediaFilename:
                    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-22%20at%208.56.38%E2%80%AFPM-V1loYoe95T1bnYGnG0OOkHU3VgN5De.png",
                mediaType: "Image",
                mediaOrientation: "Vertical",
                mediaDescription: "Print ad for magazine spread",
                subMediaUid: "target-media-1",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    uid: "about",
    shortTitle: "About",
    topTitle: "About Me",
    projectSections: [],
  },
]

export const fetchPages = createAsyncThunk("pages/fetchPages", async (_, { getState }) => {
  const state = getState() as { pages: { initialized: boolean } }

  // If already initialized, don't fetch again
  if (state.pages.initialized) {
    return (getState() as { pages: { pages: Page[] } }).pages.pages
  }

  try {
    // Check if in static build environment
    if (process.env.STATIC_BUILD) {
      const filePath = path.join(process.cwd(), "public", "media", "pages.rld")
      if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, "utf-8")
        const data = JSON.parse(fileData)
        if (data.pages) {
          console.log("pages loaded successfully")
          return data.pages
        }
      }
    } else {
      // Try to fetch from public URL first
      const response = await fetch("/media/pages.rld")
      if (response.ok) {
        const data = await response.json()
        if (data.pages) {
          console.log("pages loaded successfully")
          return data.pages
        }
      }
    }

    // Fallback to localStorage if fetch/file read fails or no pages data
    const storedData = localStorage.getItem("pages.rld")
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        if (parsedData.pages) {
          return parsedData.pages
        } else if (Array.isArray(parsedData)) {
          return parsedData
        }
      } catch (e) {
        console.error("Error parsing localStorage data:", e)
      }
    }

    // If both fail, return default data
    return defaultPagesData
  } catch (error) {
    console.error("Error fetching pages:", error)
    return defaultPagesData
  }
})

export const pagesSlice = createSlice({
  name: "pages",
  initialState,
  reducers: {
    setPages: (state, action: PayloadAction<Page[]>) => {
      state.pages = action.payload
      state.initialized = true
      // Update localStorage
      localStorage.setItem("pages.rld", JSON.stringify(action.payload))
    },
    updatePage: (state, action: PayloadAction<Page>) => {
      const index = state.pages.findIndex((page) => page.uid === action.payload.uid)

      if (index !== -1) {
        state.pages[index] = action.payload
        // Update localStorage
        localStorage.setItem("pages.rld", JSON.stringify(state.pages))
      }
    },
    updateProjectSection: (state, action: PayloadAction<{ pageUid: string; section: any }>) => {
      const { pageUid, section } = action.payload
      const pageIndex = state.pages.findIndex((page) => page.uid === pageUid)

      if (pageIndex !== -1) {
        const sectionIndex = state.pages[pageIndex].projectSections.findIndex((s) => s.uid === section.uid)

        if (sectionIndex !== -1) {
          state.pages[pageIndex].projectSections[sectionIndex] = section
        } else {
          state.pages[pageIndex].projectSections.push(section)
        }

        // Update localStorage
        localStorage.setItem("pages.rld", JSON.stringify(state.pages))
      }
    },
    updateProject: (state, action: PayloadAction<{ pageUid: string; sectionUid: string; project: any }>) => {
      const { pageUid, sectionUid, project } = action.payload
      const pageIndex = state.pages.findIndex((page) => page.uid === pageUid)

      if (pageIndex !== -1) {
        const sectionIndex = state.pages[pageIndex].projectSections.findIndex((s) => s.uid === sectionUid)

        if (sectionIndex !== -1) {
          const projectIndex = state.pages[pageIndex].projectSections[sectionIndex].projects.findIndex(
              (p) => p.uid === project.uid,
          )

          if (projectIndex !== -1) {
            state.pages[pageIndex].projectSections[sectionIndex].projects[projectIndex] = project
          } else {
            state.pages[pageIndex].projectSections[sectionIndex].projects.push(project)
          }

          // Update localStorage
          localStorage.setItem("pages.rld", JSON.stringify(state.pages))
        }
      }
    },
    updateSubMedia: (
        state,
        action: PayloadAction<{
          pageUid: string
          sectionUid: string
          projectUid: string
          subMedia: any
        }>,
    ) => {
      const { pageUid, sectionUid, projectUid, subMedia } = action.payload
      const pageIndex = state.pages.findIndex((page) => page.uid === pageUid)

      if (pageIndex !== -1) {
        const sectionIndex = state.pages[pageIndex].projectSections.findIndex((s) => s.uid === sectionUid)

        if (sectionIndex !== -1) {
          const projectIndex = state.pages[pageIndex].projectSections[sectionIndex].projects.findIndex(
              (p) => p.uid === projectUid,
          )

          if (projectIndex !== -1) {
            const subMediaIndex = state.pages[pageIndex].projectSections[sectionIndex].projects[
                projectIndex
                ].subMedia.findIndex((sm) => sm.subMediaUid === subMedia.subMediaUid)

            if (subMediaIndex !== -1) {
              state.pages[pageIndex].projectSections[sectionIndex].projects[projectIndex].subMedia[subMediaIndex] =
                  subMedia
            } else {
              state.pages[pageIndex].projectSections[sectionIndex].projects[projectIndex].subMedia.push(subMedia)
            }

            // Update localStorage
            localStorage.setItem("pages.rld", JSON.stringify(state.pages))
          }
        }
      }
    },
    addParagraphToProject: (
        state,
        action: PayloadAction<{
          pageUid: string
          sectionUid: string
          projectUid: string
          paragraph: any
        }>,
    ) => {
      const { pageUid, sectionUid, projectUid, paragraph } = action.payload
      const pageIndex = state.pages.findIndex((page) => page.uid === pageUid)

      if (pageIndex !== -1) {
        const sectionIndex = state.pages[pageIndex].projectSections.findIndex((s) => s.uid === sectionUid)

        if (sectionIndex !== -1) {
          const projectIndex = state.pages[pageIndex].projectSections[sectionIndex].projects.findIndex(
              (p) => p.uid === projectUid,
          )

          if (projectIndex !== -1) {
            if (!state.pages[pageIndex].projectSections[sectionIndex].projects[projectIndex].projectParagraphs) {
              state.pages[pageIndex].projectSections[sectionIndex].projects[projectIndex].projectParagraphs = []
            }

            state.pages[pageIndex].projectSections[sectionIndex].projects[projectIndex].projectParagraphs.push(
                paragraph,
            )

            // Update localStorage
            localStorage.setItem("pages.rld", JSON.stringify(state.pages))
          }
        }
      }
    },
    moveItemUp: (
        state,
        action: PayloadAction<{
          type: "page" | "section" | "project"
          pageUid?: string
          sectionUid?: string
          itemUid: string
        }>,
    ) => {
      const { type, pageUid, sectionUid, itemUid } = action.payload

      if (type === "page") {
        const index = state.pages.findIndex((page) => page.uid === itemUid)
        if (index > 0) {
          // Swap with the previous item
          ;[state.pages[index], state.pages[index - 1]] = [state.pages[index - 1], state.pages[index]]
          localStorage.setItem("pages.rld", JSON.stringify(state.pages))
        }
      } else if (type === "section" && pageUid) {
        const pageIndex = state.pages.findIndex((page) => page.uid === pageUid)
        if (pageIndex !== -1) {
          const sectionIndex = state.pages[pageIndex].projectSections.findIndex((section) => section.uid === itemUid)
          if (sectionIndex > 0) {
            // Swap with the previous item
            ;[
              state.pages[pageIndex].projectSections[sectionIndex],
              state.pages[pageIndex].projectSections[sectionIndex - 1],
            ] = [
              state.pages[pageIndex].projectSections[sectionIndex - 1],
              state.pages[pageIndex].projectSections[sectionIndex],
            ]
            localStorage.setItem("pages.rld", JSON.stringify(state.pages))
          }
        }
      } else if (type === "project" && pageUid && sectionUid) {
        const pageIndex = state.pages.findIndex((page) => page.uid === pageUid)
        if (pageIndex !== -1) {
          const sectionIndex = state.pages[pageIndex].projectSections.findIndex((section) => section.uid === sectionUid)
          if (sectionIndex !== -1) {
            const projectIndex = state.pages[pageIndex].projectSections[sectionIndex].projects.findIndex(
                (project) => project.uid === itemUid,
            )
            if (projectIndex > 0) {
              // Swap with the previous item
              ;[
                state.pages[pageIndex].projectSections[sectionIndex].projects[projectIndex],
                state.pages[pageIndex].projectSections[sectionIndex].projects[projectIndex - 1],
              ] = [
                state.pages[pageIndex].projectSections[sectionIndex].projects[projectIndex - 1],
                state.pages[pageIndex].projectSections[sectionIndex].projects[projectIndex],
              ]
              localStorage.setItem("pages.rld", JSON.stringify(state.pages))
            }
          }
        }
      }
    },
    moveItemDown: (
        state,
        action: PayloadAction<{
          type: "page" | "section" | "project"
          pageUid?: string
          sectionUid?: string
          itemUid: string
        }>,
    ) => {
      const { type, pageUid, sectionUid, itemUid } = action.payload

      if (type === "page") {
        const index = state.pages.findIndex((page) => page.uid === itemUid)
        if (index < state.pages.length - 1) {
          // Swap with the next item
          ;[state.pages[index], state.pages[index + 1]] = [state.pages[index + 1], state.pages[index]]
          localStorage.setItem("pages.rld", JSON.stringify(state.pages))
        }
      } else if (type === "section" && pageUid) {
        const pageIndex = state.pages.findIndex((page) => page.uid === pageUid)
        if (pageIndex !== -1) {
          const sectionIndex = state.pages[pageIndex].projectSections.findIndex((section) => section.uid === itemUid)
          if (sectionIndex < state.pages[pageIndex].projectSections.length - 1) {
            // Swap with the next item
            ;[
              state.pages[pageIndex].projectSections[sectionIndex],
              state.pages[pageIndex].projectSections[sectionIndex + 1],
            ] = [
              state.pages[pageIndex].projectSections[sectionIndex + 1],
              state.pages[pageIndex].projectSections[sectionIndex],
            ]
            localStorage.setItem("pages.rld", JSON.stringify(state.pages))
          }
        }
      } else if (type === "project" && pageUid && sectionUid) {
        const pageIndex = state.pages.findIndex((page) => page.uid === pageUid)
        if (pageIndex !== -1) {
          const sectionIndex = state.pages[pageIndex].projectSections.findIndex((section) => section.uid === sectionUid)
          if (sectionIndex !== -1) {
            const projectIndex = state.pages[pageIndex].projectSections[sectionIndex].projects.findIndex(
                (project) => project.uid === itemUid,
            )
            if (projectIndex < state.pages[pageIndex].projectSections[sectionIndex].projects.length - 1) {
              // Swap with the next item
              ;[
                state.pages[pageIndex].projectSections[sectionIndex].projects[projectIndex],
                state.pages[pageIndex].projectSections[sectionIndex].projects[projectIndex + 1],
              ] = [
                state.pages[pageIndex].projectSections[sectionIndex].projects[projectIndex + 1],
                state.pages[pageIndex].projectSections[sectionIndex].projects[projectIndex],
              ]
              localStorage.setItem("pages.rld", JSON.stringify(state.pages))
            }
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(fetchPages.pending, (state) => {
          state.status = "loading"
        })
        .addCase(fetchPages.fulfilled, (state, action) => {
          state.status = "succeeded"
          state.pages = action.payload
          state.initialized = true
        })
        .addCase(fetchPages.rejected, (state, action) => {
          state.status = "failed"
          state.error = action.error.message || "Failed to fetch pages"
        })
  },
})

export const {
  setPages,
  updatePage,
  updateProjectSection,
  updateProject,
  updateSubMedia,
  addParagraphToProject,
  moveItemUp,
  moveItemDown,
} = pagesSlice.actions
export default pagesSlice.reducer