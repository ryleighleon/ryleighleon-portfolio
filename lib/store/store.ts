import { configureStore } from "@reduxjs/toolkit"
import pagesReducer, { fetchPages } from "./slices/pagesSlice"
import aboutReducer, { fetchAboutData } from "./slices/aboutSlice"

export const store = configureStore({
  reducer: {
    pages: pagesReducer,
    about: aboutReducer,
  },
})

// Initialize data
store.dispatch(fetchPages())
store.dispatch(fetchAboutData())

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
