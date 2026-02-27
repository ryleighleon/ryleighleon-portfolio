import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { ProjectPage, PagesState } from "@/types"
import pagesRLD from "@/data/pages.json"
import { v4 as uuidv4 } from "uuid"

const defaultPagesData = [
  {
    uid: uuidv4(),
    path: "home",
    shortTitle: "Home",
    topTitle: "Welcome!",
    projectSections: [],
  },
  {
    uid: uuidv4(),
    path: "portfolio",
    shortTitle: "Portfolio",
    topTitle: "My Work",
    projectSections: [
      {
        uid: uuidv4(),
        path: "branding",
        title: "Branding",
        subtitle: "Identity Design",
        description: "A collection of branding and identity design projects.",
        projects: [
          {
            uid: uuidv4(),
            path: "target",
            thumbnailImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/thumbnail-target.png",
            mainImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/main-target.png",
            projectTitle: "Target",
            projectSubtitle: "Art Direction",
            projectParagraphs: [
              {
                paragraphTitle: "The Project",
                paragraphText:
                    "Target is launching a new Mondo Llama product of paint and paintbrushes. They want a physical and a digital banner ad for the new product. A professional photographer will photograph the concept. You will direct them based on your sketches, mood board, and layout concepts to communicate your vision to the photographer. Both ads need to include: Target logo, Target Visual Identity Headline and copy Photography of product Item name + price",
                paragraphUid: uuidv4(),
              },
            ],
            subMedia: [
              {
                mediaFilename:
                    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-22%20at%208.56.38%E2%80%AFPM-V1loYoe95T1bnYGnG0OOkHU3VgN5De.png",
                thumbnailImage:
                    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/thumbnail-ad.png",
                mainImage:
                    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/main-ad.png",
                mediaType: "Image",
                mediaOrientation: "Vertical",
                mediaDescription: "Print ad for magazine spread",
                subMediaUid: uuidv4(),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    uid: uuidv4(),
    path: "about",
    shortTitle: "About",
    topTitle: "About Me",
    projectSections: [],
  },
]

const initialState: PagesState = {
  pages: (pagesRLD.pages as ProjectPage[]) || defaultPagesData,
  status: "succeeded",
  error: null,
  initialized: true,
  selectedPageId: null,
  selectedSectionId: null,
  selectedProjectId: null,
  selectedSubMediaId: null,
}

export const pagesSlice = createSlice({
  name: "pages",
  initialState,
  reducers: {
    setPages: (state, action: PayloadAction<ProjectPage[]>) => {
      state.pages = action.payload
      state.initialized = true
      localStorage.setItem("pages.json.pages", JSON.stringify(state.pages))
    },
    updatePage: (state, action: PayloadAction<ProjectPage>) => {
      const index = state.pages.findIndex((page) => page.uid === action.payload.uid)
      if (index !== -1) {
        state.pages[index] = action.payload
        localStorage.setItem("pages.json.pages", JSON.stringify(state.pages))
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
        localStorage.setItem("pages.json.pages", JSON.stringify(state.pages))
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
          localStorage.setItem("pages.json.pages", JSON.stringify(state.pages))
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
            localStorage.setItem("pages.json.pages", JSON.stringify(state.pages))
          }
        }
      }
    },
    deleteSubMedia: (
        state,
        action: PayloadAction<{
          pageUid: string
          sectionUid: string
          projectUid: string
          subMediaUid: string
        }>,
    ) => {
      const { pageUid, sectionUid, projectUid, subMediaUid } = action.payload
      const pageIndex = state.pages.findIndex((page) => page.uid === pageUid)
      if (pageIndex !== -1) {
        const sectionIndex = state.pages[pageIndex].projectSections.findIndex((s) => s.uid === sectionUid)
        if (sectionIndex !== -1) {
          const projectIndex = state.pages[pageIndex].projectSections[sectionIndex].projects.findIndex(
              (p) => p.uid === projectUid,
          )
          if (projectIndex !== -1) {
            state.pages[pageIndex].projectSections[sectionIndex].projects[projectIndex].subMedia =
                state.pages[pageIndex].projectSections[sectionIndex].projects[projectIndex].subMedia.filter(
                    (sm) => sm.subMediaUid !== subMediaUid,
                )
            if (state.selectedSubMediaId === subMediaUid) {
              state.selectedSubMediaId = null
            }
            localStorage.setItem("pages.json.pages", JSON.stringify(state.pages))
          }
        }
      }
    },
    moveSubMediaUp: (
        state,
        action: PayloadAction<{
          pageUid: string
          sectionUid: string
          projectUid: string
          subMediaUid: string
        }>,
    ) => {
      const { pageUid, sectionUid, projectUid, subMediaUid } = action.payload
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
                ].subMedia.findIndex((sm) => sm.subMediaUid === subMediaUid)
            if (subMediaIndex > 0) {
              const subMedia = state.pages[pageIndex].projectSections[sectionIndex].projects[projectIndex].subMedia
              ;[subMedia[subMediaIndex], subMedia[subMediaIndex - 1]] = [
                subMedia[subMediaIndex - 1],
                subMedia[subMediaIndex],
              ]
              localStorage.setItem("pages.json.pages", JSON.stringify(state.pages))
            }
          }
        }
      }
    },
    moveSubMediaDown: (
        state,
        action: PayloadAction<{
          pageUid: string
          sectionUid: string
          projectUid: string
          subMediaUid: string
        }>,
    ) => {
      const { pageUid, sectionUid, projectUid, subMediaUid } = action.payload
      const pageIndex = state.pages.findIndex((page) => page.uid === pageUid)
      if (pageIndex !== -1) {
        const sectionIndex = state.pages[pageIndex].projectSections.findIndex((s) => s.uid === sectionUid)
        if (sectionIndex !== -1) {
          const projectIndex = state.pages[pageIndex].projectSections[sectionIndex].projects.findIndex(
              (p) => p.uid === projectUid,
          )
          if (projectIndex !== -1) {
            const subMedia = state.pages[pageIndex].projectSections[sectionIndex].projects[projectIndex].subMedia
            const subMediaIndex = subMedia.findIndex((sm) => sm.subMediaUid === subMediaUid)
            if (subMediaIndex < subMedia.length - 1) {
              ;[subMedia[subMediaIndex], subMedia[subMediaIndex + 1]] = [
                subMedia[subMediaIndex + 1],
                subMedia[subMediaIndex],
              ]
              localStorage.setItem("pages.json.pages", JSON.stringify(state.pages))
            }
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
            localStorage.setItem("pages.json.pages", JSON.stringify(state.pages))
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
          [state.pages[index], state.pages[index - 1]] = [state.pages[index - 1], state.pages[index]]
          localStorage.setItem("pages.json.pages", JSON.stringify(state.pages))
        }
      } else if (type === "section" && pageUid) {
        const pageIndex = state.pages.findIndex((page) => page.uid === pageUid)
        if (pageIndex !== -1) {
          const sectionIndex = state.pages[pageIndex].projectSections.findIndex((section) => section.uid === itemUid)
          if (sectionIndex > 0) {
            [
              state.pages[pageIndex].projectSections[sectionIndex],
              state.pages[pageIndex].projectSections[sectionIndex - 1],
            ] = [
              state.pages[pageIndex].projectSections[sectionIndex - 1],
              state.pages[pageIndex].projectSections[sectionIndex],
            ]
            localStorage.setItem("pages.json.pages", JSON.stringify(state.pages))
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
              [
                state.pages[pageIndex].projectSections[sectionIndex].projects[projectIndex],
                state.pages[pageIndex].projectSections[sectionIndex].projects[projectIndex - 1],
              ] = [
                state.pages[pageIndex].projectSections[sectionIndex].projects[projectIndex - 1],
                state.pages[pageIndex].projectSections[sectionIndex].projects[projectIndex],
              ]
              localStorage.setItem("pages.json.pages", JSON.stringify(state.pages))
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
          [state.pages[index], state.pages[index + 1]] = [state.pages[index + 1], state.pages[index]]
          localStorage.setItem("pages.json.pages", JSON.stringify(state.pages))
        }
      } else if (type === "section" && pageUid) {
        const pageIndex = state.pages.findIndex((page) => page.uid === pageUid)
        if (pageIndex !== -1) {
          const sectionIndex = state.pages[pageIndex].projectSections.findIndex((section) => section.uid === itemUid)
          if (sectionIndex < state.pages[pageIndex].projectSections.length - 1) {
            [
              state.pages[pageIndex].projectSections[sectionIndex],
              state.pages[pageIndex].projectSections[sectionIndex + 1],
            ] = [
              state.pages[pageIndex].projectSections[sectionIndex + 1],
              state.pages[pageIndex].projectSections[sectionIndex],
            ]
            localStorage.setItem("pages.json.pages", JSON.stringify(state.pages))
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
              [
                state.pages[pageIndex].projectSections[sectionIndex].projects[projectIndex],
                state.pages[pageIndex].projectSections[sectionIndex].projects[projectIndex + 1],
              ] = [
                state.pages[pageIndex].projectSections[sectionIndex].projects[projectIndex + 1],
                state.pages[pageIndex].projectSections[sectionIndex].projects[projectIndex],
              ]
              localStorage.setItem("pages.json.pages", JSON.stringify(state.pages))
            }
          }
        }
      }
    },
    deletePage: (state, action: PayloadAction<{ pageUid: string }>) => {
      const { pageUid } = action.payload
      state.pages = state.pages.filter((page) => page.uid !== pageUid)
      if (state.selectedPageId === pageUid) {
        state.selectedPageId = null
        state.selectedSectionId = null
        state.selectedProjectId = null
        state.selectedSubMediaId = null
      }
      localStorage.setItem("pages.json.pages", JSON.stringify(state.pages))
    },
    deleteProjectSection: (state, action: PayloadAction<{ pageUid: string; sectionUid: string }>) => {
      const { pageUid, sectionUid } = action.payload
      const pageIndex = state.pages.findIndex((page) => page.uid === pageUid)
      if (pageIndex !== -1) {
        state.pages[pageIndex].projectSections = state.pages[pageIndex].projectSections.filter(
            (section) => section.uid !== sectionUid
        )
        if (state.selectedSectionId === sectionUid) {
          state.selectedSectionId = null
          state.selectedProjectId = null
          state.selectedSubMediaId = null
        }
        localStorage.setItem("pages.json.pages", JSON.stringify(state.pages))
      }
    },
    deleteProject: (state, action: PayloadAction<{ pageUid: string; sectionUid: string; projectUid: string }>) => {
      const { pageUid, sectionUid, projectUid } = action.payload
      const pageIndex = state.pages.findIndex((page) => page.uid === pageUid)
      if (pageIndex !== -1) {
        const sectionIndex = state.pages[pageIndex].projectSections.findIndex((section) => section.uid === sectionUid)
        if (sectionIndex !== -1) {
          state.pages[pageIndex].projectSections[sectionIndex].projects = state.pages[pageIndex]
              .projectSections[sectionIndex].projects.filter((project) => project.uid !== projectUid)
          if (state.selectedProjectId === projectUid) {
            state.selectedProjectId = null
            state.selectedSubMediaId = null
          }
          localStorage.setItem("pages.json.pages", JSON.stringify(state.pages))
        }
      }
    },
    setSelectedPageId: (state, action: PayloadAction<string | null>) => {
      state.selectedPageId = action.payload
      if (!action.payload) {
        state.selectedSectionId = null
        state.selectedProjectId = null
        state.selectedSubMediaId = null
      }
    },
    setSelectedSectionId: (state, action: PayloadAction<string | null>) => {
      state.selectedSectionId = action.payload
      if (!action.payload) {
        state.selectedProjectId = null
        state.selectedSubMediaId = null
      }
    },
    setSelectedProjectId: (state, action: PayloadAction<string | null>) => {
      state.selectedProjectId = action.payload
      if (!action.payload) {
        state.selectedSubMediaId = null
      }
    },
    setSelectedSubMediaId: (state, action: PayloadAction<string | null>) => {
      state.selectedSubMediaId = action.payload
    },
    moveParagraphUp: (
      state,
      action: PayloadAction<{
        pageUid: string;
        sectionUid: string;
        projectUid: string;
        paragraphUid: string;
      }>,
    ) => {
      const { pageUid, sectionUid, projectUid, paragraphUid } = action.payload;
      const pageIndex = state.pages.findIndex((p) => p.uid === pageUid);
      if (pageIndex === -1) return;

      const sectionIndex = state.pages[pageIndex].projectSections.findIndex(
        (s) => s.uid === sectionUid,
      );
      if (sectionIndex === -1) return;

      const projectIndex = state.pages[pageIndex].projectSections[
        sectionIndex
      ].projects.findIndex((proj) => proj.uid === projectUid);
      if (projectIndex === -1) return;

      const paragraphs =
        state.pages[pageIndex].projectSections[sectionIndex].projects[projectIndex]
          .projectParagraphs;

      if (!paragraphs || paragraphs.length < 2) return;

      const paraIndex = paragraphs.findIndex((p) => p.paragraphUid === paragraphUid);
      if (paraIndex <= 0) return;

      // Swap with the one above
      [paragraphs[paraIndex], paragraphs[paraIndex - 1]] = [
        paragraphs[paraIndex - 1],
        paragraphs[paraIndex],
      ];

      localStorage.setItem("pages.json.pages", JSON.stringify(state.pages));
    },

    moveParagraphDown: (
      state,
      action: PayloadAction<{
        pageUid: string;
        sectionUid: string;
        projectUid: string;
        paragraphUid: string;
      }>,
    ) => {
      const { pageUid, sectionUid, projectUid, paragraphUid } = action.payload;
      const pageIndex = state.pages.findIndex((p) => p.uid === pageUid);
      if (pageIndex === -1) return;

      const sectionIndex = state.pages[pageIndex].projectSections.findIndex(
        (s) => s.uid === sectionUid,
      );
      if (sectionIndex === -1) return;

      const projectIndex = state.pages[pageIndex].projectSections[
        sectionIndex
      ].projects.findIndex((proj) => proj.uid === projectUid);
      if (projectIndex === -1) return;

      const paragraphs =
        state.pages[pageIndex].projectSections[sectionIndex].projects[projectIndex]
          .projectParagraphs;

      if (!paragraphs || paragraphs.length < 2) return;

      const paraIndex = paragraphs.findIndex((p) => p.paragraphUid === paragraphUid);
      if (paraIndex < 0 || paraIndex >= paragraphs.length - 1) return;

      // Swap with the one below
      [paragraphs[paraIndex], paragraphs[paraIndex + 1]] = [
        paragraphs[paraIndex + 1],
        paragraphs[paraIndex],
      ];

      localStorage.setItem("pages.json.pages", JSON.stringify(state.pages));
    },
    deleteParagraph: (
      state,
      action: PayloadAction<{
        pageUid: string;
        sectionUid: string;
        projectUid: string;
        paragraphUid: string;
      }>,
    ) => {
      const { pageUid, sectionUid, projectUid, paragraphUid } = action.payload;

      const pageIndex = state.pages.findIndex((p) => p.uid === pageUid);
      if (pageIndex === -1) return;

      const sectionIndex = state.pages[pageIndex].projectSections.findIndex(
        (s) => s.uid === sectionUid,
      );
      if (sectionIndex === -1) return;

      const projectIndex = state.pages[pageIndex].projectSections[sectionIndex].projects.findIndex(
        (proj) => proj.uid === projectUid,
      );
      if (projectIndex === -1) return;

      const paragraphs =
        state.pages[pageIndex].projectSections[sectionIndex].projects[projectIndex]
          .projectParagraphs;

      if (!paragraphs) return;

      state.pages[pageIndex].projectSections[sectionIndex].projects[
        projectIndex
      ].projectParagraphs = paragraphs.filter(
        (p) => p.paragraphUid !== paragraphUid,
      );

      localStorage.setItem("pages.json.pages", JSON.stringify(state.pages));
    },
  },
})

export const {
  setPages,
  updatePage,
  updateProjectSection,
  updateProject,
  updateSubMedia,
  deleteSubMedia,
  moveSubMediaUp,
  moveSubMediaDown,
  addParagraphToProject,
  moveItemUp,
  moveItemDown,
  deletePage,
  deleteProjectSection,
  deleteProject,
  setSelectedPageId,
  setSelectedSectionId,
  setSelectedProjectId,
  setSelectedSubMediaId,
  moveParagraphUp,
  moveParagraphDown,
  deleteParagraph
} = pagesSlice.actions
export default pagesSlice.reducer