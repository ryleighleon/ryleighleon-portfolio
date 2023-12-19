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
            state.projects.push(action.payload);
        },
        clearProjects: (state) => {
            state.projects = [];
        }
    },
});

export const { addProject, clearProjects } = projectsSlice.actions;

export default projectsSlice.reducer;
