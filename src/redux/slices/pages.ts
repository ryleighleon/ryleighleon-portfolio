import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
