import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import projectReducer from "./projectSlice";
import taskReducer from "./taskSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    project: projectReducer,
    task: taskReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
