import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface TaskSlice {
  id: string;
  title: string;
  projectAlias: string;
  sequence: number;
}

interface TaskState {
  task: TaskSlice | null;
}


const initialState: TaskState = {
  task: null,
};

const TaskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTask(state, action: PayloadAction<Task>) {
      state.task = action.payload;
    },
  },
});

export const { setTask } = TaskSlice.actions;
export default TaskSlice.reducer;
