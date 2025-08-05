import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ProjectState {
  project: Project | null;
}

const initialState: ProjectState = {
  project: null,
};

const ProjectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProject(state, action: PayloadAction<Project>) {
      state.project = action.payload;
    },
  },
});

export const { setProject } = ProjectSlice.actions;
export default ProjectSlice.reducer;
