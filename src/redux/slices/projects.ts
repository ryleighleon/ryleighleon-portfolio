import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Project {
    name: string;
    description?: string;
    type: string;
    filename: string;
    path: string;
}

interface ProjectsState {
    projects: Project[];
}

const initialState: ProjectsState = {
    projects: [],
};

const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        addProject: (state, action: PayloadAction<Project>) => {
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
