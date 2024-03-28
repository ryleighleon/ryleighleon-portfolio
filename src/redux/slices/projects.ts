import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface OldProject {
    name: string;
    description?: string;
    type: string;
    filename: string;
    path: string;
}

interface ProjectsState {
    projects: OldProject[];
}

const initialState: ProjectsState = {
    projects: [],
};

const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        addProject: (state, action: PayloadAction<OldProject>) => {
            if (!state.projects.some(project => project.name === action.payload.name && project.filename === action.payload.filename)) {
                state.projects.push(action.payload);
            }
        },
        clearProjects: (state) => {
            state.projects = [];
        }
    },
});

export const { addProject, clearProjects } = projectsSlice.actions;

export default projectsSlice.reducer;
