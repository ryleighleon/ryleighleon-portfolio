import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Project {
    name: string;
    description: string;
    type: string;
    imageName: string;
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
    },
});

export const { addProject } = projectsSlice.actions;

export default projectsSlice.reducer;
