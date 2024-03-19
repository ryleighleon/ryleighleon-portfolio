import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WorkPage {
    projectSections: ProjectSection[];
}

interface Works {
    workPages: WorkPage[];
}

export interface RegularProject {
    title: string;
    type: string;
    filename: string;
}

interface ProjectSection {
    title: string;
    subtitle: string;
    description?: string;
    projects: RegularProject[];
}

interface PortfolioParagraph {
    title: string;
    text: string;
}

interface PortfolioSection {
    title: string;
    subtitle: string;
    imageName: string;
    portfolioParagraphs: PortfolioParagraph[];
    portfolioProjects: string[];
}

interface PortfolioPage {
    portfolioSections: PortfolioSection[];
}






export interface Page {
    shortTitle: string;
    longTitle?: string;
    subTitle?: string;
    description?: string;
    relativeLink: string;
    children: Page[];
}

interface PagesState {
    pages: Page[];
}

const initialState: PagesState = {
    pages: [],
};

const pagesSlice = createSlice({
    name: 'pages',
    initialState,
    reducers: {
        addPage: (state, action: PayloadAction<Page>) => {
            let parentPage;
            for (const tempPage of state.pages) {
                if (action.payload.relativeLink.startsWith(tempPage.relativeLink + '/')) {
                    parentPage = tempPage;
                }
            }
            if (parentPage) {
                parentPage.children.push(action.payload)
            } else {
                state.pages.push(action.payload);
            }
        },
        clearPages: (state) => {
            state.pages = [];
        }
    }
});

export const { addPage, clearPages } = pagesSlice.actions;

export default pagesSlice.reducer;
