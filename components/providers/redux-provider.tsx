"use client"

import { useEffect } from "react"
import { store } from "@/lib/store/store"
import { Provider } from "react-redux"
import type { ReactNode } from "react"
import { initializeData } from "@/lib/utils/initialize-data"

export function ReduxProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Initialize data in localStorage if it doesn't exist
    if (typeof window !== "undefined") {
      initializeData()
    }
  }, [])

  return <Provider store={store}>{children}</Provider>
}
