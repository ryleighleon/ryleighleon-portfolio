import { configureStore } from "@reduxjs/toolkit"
import pagesReducer from "./slices/pagesSlice"
import aboutReducer from "./slices/aboutSlice"

export const store = configureStore({
  reducer: {
    pages: pagesReducer,
    about: aboutReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
