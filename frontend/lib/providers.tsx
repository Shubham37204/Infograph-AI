"use client"

import * as React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { Toaster } from "sonner"
import { useHistoryStore } from "@/lib/stores/history-store"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  const markActive = useHistoryStore((state) => state.markActive)
  const pruneExpired = useHistoryStore((state) => state.pruneExpired)

  React.useEffect(() => {
    pruneExpired()

    let lastMarkedAt = 0
    const markRecentActivity = () => {
      const now = Date.now()
      if (now - lastMarkedAt < 60_000) return
      lastMarkedAt = now
      pruneExpired()
      markActive()
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        pruneExpired()
        markRecentActivity()
      }
    }

    window.addEventListener("click", markRecentActivity)
    window.addEventListener("keydown", markRecentActivity)
    window.addEventListener("focus", handleVisibilityChange)
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      window.removeEventListener("click", markRecentActivity)
      window.removeEventListener("keydown", markRecentActivity)
      window.removeEventListener("focus", handleVisibilityChange)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [markActive, pruneExpired])

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        {children}
        <Toaster position="bottom-right" richColors />
      </NextThemesProvider>
    </QueryClientProvider>
  )
}
