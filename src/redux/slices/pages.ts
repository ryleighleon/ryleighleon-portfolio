import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PagesState {
    pages: Page[];
}

export interface SubMedia {
    mediaFilename: string;
    mediaType: 'Image' | 'Video' | 'GIF';
    mediaOrientation?: 'Square' | 'Vertical' | 'Horizontal';
    mediaDescription?: string;
    subMediaUid: string;
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
    thumbnailImageFilename: string;
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
        mediaType: 'Image' | 'Video' | 'GIF';
        mediaOrientation?: 'Square' | 'Vertical' | 'Horizontal';
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
                        thumbnailImageFilename: '',
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
                            mediaType: 'Image',
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
        },
        shiftParagraphUp(state, action: PayloadAction<{ pageUid: string; sectionUid: string; projectUid: string; paragraphUid: string }>) {
            const page = state.pages.find(page => page.uid === action.payload.pageUid);
            if (page) {
                const section = page.projectSections.find(section => section.uid === action.payload.sectionUid);
                if (section) {
                    const project = section.projects.find(project => project.uid === action.payload.projectUid);
                    if (project) {
                        const paragraphIndex = project.projectParagraphs.findIndex(paragraph => paragraph.paragraphUid === action.payload.paragraphUid);
                        if (paragraphIndex > 0) {
                            const temp = project.projectParagraphs[paragraphIndex];
                            project.projectParagraphs[paragraphIndex] = project.projectParagraphs[paragraphIndex - 1];
                            project.projectParagraphs[paragraphIndex - 1] = temp;
                        }
                    }
                }
            }
        },
        shiftParagraphDown(state, action: PayloadAction<{ pageUid: string; sectionUid: string; projectUid: string; paragraphUid: string }>) {
            const page = state.pages.find(page => page.uid === action.payload.pageUid);
            if (page) {
                const section = page.projectSections.find(section => section.uid === action.payload.sectionUid);
                if (section) {
                    const project = section.projects.find(project => project.uid === action.payload.projectUid);
                    if (project) {
                        const paragraphIndex = project.projectParagraphs.findIndex(paragraph => paragraph.paragraphUid === action.payload.paragraphUid);
                        if (paragraphIndex < project.projectParagraphs.length - 1) {
                            const temp = project.projectParagraphs[paragraphIndex];
                            project.projectParagraphs[paragraphIndex] = project.projectParagraphs[paragraphIndex + 1];
                            project.projectParagraphs[paragraphIndex + 1] = temp;
                        }
                    }
                }
            }
        },
        shiftProjectUp(state, action: PayloadAction<{ pageUid: string; sectionUid: string; projectUid: string }>) {
            const page = state.pages.find(page => page.uid === action.payload.pageUid);
            if (page) {
                const section = page.projectSections.find(section => section.uid === action.payload.sectionUid);
                if (section) {
                    const projectIndex = section.projects.findIndex(project => project.uid === action.payload.projectUid);
                    if (projectIndex > 0) {
                        const temp = section.projects[projectIndex];
                        section.projects[projectIndex] = section.projects[projectIndex - 1];
                        section.projects[projectIndex - 1] = temp;
                    }
                }
            }
        },
        shiftProjectDown(state, action: PayloadAction<{ pageUid: string; sectionUid: string; projectUid: string }>) {
            const page = state.pages.find(page => page.uid === action.payload.pageUid);
            if (page) {
                const section = page.projectSections.find(section => section.uid === action.payload.sectionUid);
                if (section) {
                    const projectIndex = section.projects.findIndex(project => project.uid === action.payload.projectUid);
                    if (projectIndex < section.projects.length - 1) {
                        const temp = section.projects[projectIndex];
                        section.projects[projectIndex] = section.projects[projectIndex + 1];
                        section.projects[projectIndex + 1] = temp;
                    }
                }
            }
        },
        shiftSubMediaUp(state, action: PayloadAction<{ pageUid: string; sectionUid: string; projectUid: string; subMediaUid: string }>) {
            const page = state.pages.find(page => page.uid === action.payload.pageUid);
            if (page) {
                const section = page.projectSections.find(section => section.uid === action.payload.sectionUid);
                if (section) {
                    const project = section.projects.find(project => project.uid === action.payload.projectUid);
                    if (project) {
                        const subMediaIndex = project.subMedia.findIndex(subMedia => subMedia.subMediaUid === action.payload.subMediaUid);
                        if (subMediaIndex > 0) {
                            const temp = project.subMedia[subMediaIndex];
                            project.subMedia[subMediaIndex] = project.subMedia[subMediaIndex - 1];
                            project.subMedia[subMediaIndex - 1] = temp;
                        }
                    }
                }
            }
        },
        shiftSubMediaDown(state, action: PayloadAction<{ pageUid: string; sectionUid: string; projectUid: string; subMediaUid: string }>) {
            const page = state.pages.find(page => page.uid === action.payload.pageUid);
            if (page) {
                const section = page.projectSections.find(section => section.uid === action.payload.sectionUid);
                if (section) {
                    const project = section.projects.find(project => project.uid === action.payload.projectUid);
                    if (project) {
                        const subMediaIndex = project.subMedia.findIndex(subMedia => subMedia.subMediaUid === action.payload.subMediaUid);
                        if (subMediaIndex < project.subMedia.length - 1) {
                            const temp = project.subMedia[subMediaIndex];
                            project.subMedia[subMediaIndex] = project.subMedia[subMediaIndex + 1];
                            project.subMedia[subMediaIndex + 1] = temp;
                        }
                    }
                }
            }
        },
        shiftSectionUp(state, action: PayloadAction<{ pageUid: string; sectionUid: string }>) {
            const page = state.pages.find(page => page.uid === action.payload.pageUid);
            if (page) {
                const sectionIndex = page.projectSections.findIndex(section => section.uid === action.payload.sectionUid);
                if (sectionIndex > 0) {
                    const temp = page.projectSections[sectionIndex];
                    page.projectSections[sectionIndex] = page.projectSections[sectionIndex - 1];
                    page.projectSections[sectionIndex - 1] = temp;
                }
            }
        },
        shiftSectionDown(state, action: PayloadAction<{ pageUid: string; sectionUid: string }>) {
            const page = state.pages.find(page => page.uid === action.payload.pageUid);
            if (page) {
                const sectionIndex = page.projectSections.findIndex(section => section.uid === action.payload.sectionUid);
                if (sectionIndex < page.projectSections.length - 1) {
                    const temp = page.projectSections[sectionIndex];
                    page.projectSections[sectionIndex] = page.projectSections[sectionIndex + 1];
                    page.projectSections[sectionIndex + 1] = temp;
                }
            }
        },
        shiftPageUp(state, action: PayloadAction<{ pageUid: string }>) {
            const pageIndex = state.pages.findIndex(page => page.uid === action.payload.pageUid);
            if (pageIndex > 0) {
                const temp = state.pages[pageIndex];
                state.pages[pageIndex] = state.pages[pageIndex - 1];
                state.pages[pageIndex - 1] = temp;
            }
        },
        shiftPageDown(state, action: PayloadAction<{ pageUid: string }>) {
            const pageIndex = state.pages.findIndex(page => page.uid === action.payload.pageUid);
            if (pageIndex < state.pages.length - 1) {
                const temp = state.pages[pageIndex];
                state.pages[pageIndex] = state.pages[pageIndex + 1];
                state.pages[pageIndex + 1] = temp;
            }
        },
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
    setPages,
    shiftParagraphUp,
    shiftParagraphDown,
    shiftProjectUp,
    shiftProjectDown,
    shiftSubMediaUp,
    shiftSubMediaDown,
    shiftSectionUp,
    shiftSectionDown,
    shiftPageUp,
    shiftPageDown
} = pagesSlice.actions;

export default pagesSlice.reducer;
