import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Page {
    shortTitle: string;
    longTitle: string;
    subTitle: string;
    description: string;
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
            state.pages.push(action.payload);
        },
    },
});

export const { addPage } = pagesSlice.actions;

export default pagesSlice.reducer;
