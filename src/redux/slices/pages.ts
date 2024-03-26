import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PagesState {
    pages: Page[];
}

export interface Page {
    uid: string;
    shortTitle: string;
    topTitle?: string;
    bottomTitle?: string;
    relativeLink: string;
    projectSections: ProjectSection[];
}

export interface ProjectSection {
    uid: string;
    title: string;
    subtitle: string;
    description: string;
    projects: Project[];
}

export interface Project {
    uid: string;
    mainImageFilename: string;
    projectTitle: string;
    projectSubtitle: string;
    imageName: string;
    projectParagraphs: {
        paragraphTitle: string;
        paragraphText: string;
        paragraphUid: string;
    }[];
    subMedia: {
        mediaFilename: string;
        type: string;
        mediaDescription?: string;
        subMediaUid: string;
    }[];
}

const initialState: PagesState = {
    pages: [
        {
            shortTitle: 'Portfolio',
            uid: '1',
            relativeLink: '/',
            projectSections: [],
        },
    ],
};

const pagesSlice = createSlice({
    name: 'pages',
    initialState,
    reducers: {
        addPage(state, action: PayloadAction<Page>) {
            state.pages.push(action.payload);
        },
        addPageOnlyTitle(state, action: PayloadAction<string>) {
            state.pages.push({
                shortTitle: action.payload,
                relativeLink: action.payload.toLowerCase().replace(/\s/g, '-'),
                uid: Math.random().toString(36).substring(7),
                projectSections: [],
            });
        },
        updatePage(state, action: PayloadAction<Page>) {
            const index = state.pages.findIndex(page => page.uid === action.payload.uid);
            if (index !== -1) {
                state.pages[index] = action.payload;
            }
        },
        deletePage(state, action: PayloadAction<string>) {
            state.pages = state.pages.filter(page => page.uid !== action.payload);
        },
        addSectionOnlyTitle(state, action: PayloadAction<{ pageUid: string; title: string }>) {
            const page = state.pages.find(page => page.uid === action.payload.pageUid);
            if (page) {
                page.projectSections.push({
                    title: action.payload.title,
                    subtitle: '',
                    description: '',
                    projects: [],
                    uid: Math.random().toString(36).substring(7),
                });
            }
        },
        addProjectOnlyTitle(state, action: PayloadAction<{ pageUid: string; sectionTitle: string; projectTitle: string }>) {
            const page = state.pages.find(page => page.uid === action.payload.pageUid);
            if (page) {
                const section = page.projectSections.find(section => section.title === action.payload.sectionTitle);
                if (section) {
                    section.projects.push({
                        mainImageFilename: '',
                        projectTitle: action.payload.projectTitle,
                        projectSubtitle: '',
                        imageName: '',
                        projectParagraphs: [],
                        subMedia: [],
                        uid: Math.random().toString(36).substring(7),
                    });
                }
            }

        },
        addProjectParagraphOnlyTitle(state, action: PayloadAction<{ pageUid: string; sectionTitle: string; projectTitle: string; paragraphTitle: string }>) {
            const page = state.pages.find(page => page.uid === action.payload.pageUid);
            if (page) {
                const section = page.projectSections.find(section => section.title === action.payload.sectionTitle);
                if (section) {
                    const project = section.projects.find(project => project.projectTitle === action.payload.projectTitle);
                    if (project) {
                        project.projectParagraphs.push({
                            paragraphTitle: action.payload.paragraphTitle,
                            paragraphText: '',
                            paragraphUid: Math.random().toString(36).substring(7),
                        });
                    }
                }
            }
        },
        addProjectSubmediaOnlyFilename(state, action: PayloadAction<{ pageUid: string; sectionTitle: string; projectTitle: string; subMediaFilename: string }>) {
            const page = state.pages.find(page => page.uid === action.payload.pageUid);
            if (page) {
                const section = page.projectSections.find(section => section.title === action.payload.sectionTitle);
                if (section) {
                    const project = section.projects.find(project => project.projectTitle === action.payload.projectTitle);
                    if (project) {
                        project.subMedia.push({
                            mediaFilename: action.payload.subMediaFilename,
                            type: 'Image',
                            subMediaUid: Math.random().toString(36).substring(7),
                        });
                    }
                }
            }
        },
        deleteSection(state, action: PayloadAction<{ pageUid: string; sectionUid: string }>) {
            const page = state.pages.find(page => page.uid === action.payload.pageUid);
            if (page) {
                page.projectSections = page.projectSections.filter(section => section.uid !== action.payload.sectionUid);
            }
        },
        deleteProject(state, action: PayloadAction<{ pageUid: string; sectionUid: string; projectUid: string }>) {
            const page = state.pages.find(page => page.uid === action.payload.pageUid);
            if (page) {
                const section = page.projectSections.find(section => section.uid === action.payload.sectionUid);
                if (section) {
                    section.projects = section.projects.filter(project => project.uid !== action.payload.projectUid);
                }
            }
        },
        deleteProjectParagraph(state, action: PayloadAction<{ pageUid: string; sectionUid: string; projectUid: string; paragraphUid: string }>) {
            const page = state.pages.find(page => page.uid === action.payload.pageUid);
            if (page) {
                const section = page.projectSections.find(section => section.uid === action.payload.sectionUid);
                if (section) {
                    const project = section.projects.find(project => project.uid === action.payload.projectUid);
                    if (project) {
                        project.projectParagraphs = project.projectParagraphs.filter(paragraph => paragraph.paragraphUid !== action.payload.paragraphUid);
                    }
                }
            }
        },
        deleteProjectSubmedia(state, action: PayloadAction<{ pageUid: string; sectionUid: string; projectUid: string; subMediaUid: string }>) {
            const page = state.pages.find(page => page.uid === action.payload.pageUid);
            if (page) {
                const section = page.projectSections.find(section => section.uid === action.payload.sectionUid);
                if (section) {
                    const project = section.projects.find(project => project.uid === action.payload.projectUid);
                    if (project) {
                        project.subMedia = project.subMedia.filter(subMedia => subMedia.subMediaUid !== action.payload.subMediaUid);
                    }
                }
            }
        },
        setPages(state, action: PayloadAction<Page[]>) {
            state.pages = action.payload;
        }
    },
});

export const { addPage,
    updatePage,
    deletePage,
    addPageOnlyTitle,
    addSectionOnlyTitle,
    addProjectOnlyTitle,
    addProjectParagraphOnlyTitle,
    addProjectSubmediaOnlyFilename,
    deleteSection,
    deleteProject,
    deleteProjectParagraph,
    deleteProjectSubmedia,
    setPages
} = pagesSlice.actions;

export default pagesSlice.reducer;
