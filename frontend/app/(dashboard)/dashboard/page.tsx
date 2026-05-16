"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Plus, FileText, LayoutGrid, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useHistoryStore } from "@/lib/stores/history-store"
import { SlideDeck } from "@/components/slides/slide-deck"

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const { items } = useHistoryStore()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    // Use a small timeout to move the update out of the synchronous effect body
    // This avoids the 'cascading render' warning in Next.js/React.
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  // If ID is provided, show that specific item
  const activeItem = id ? items.find(i => i.id === id) : items[0]
  const displayName = activeItem?.fileName.replace(/\.pdf$/i, "")

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {displayName || "Dashboard"}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {activeItem ? `Generated ${new Date(activeItem.timestamp).toLocaleDateString()}` : "Upload a resume and generate a recruiter-ready visual deck."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild className="h-10 gap-2 px-4 text-sm font-semibold shadow-sm">
            <Link href="/upload">
              <Plus className="h-4 w-4" />
              New Analysis
            </Link>
          </Button>
        </div>
      </div>

      {!activeItem ? (
        <div className="grid gap-6">
          <div className="rounded-lg border border-white/5 bg-card/50 p-8 text-center">
            <div className="mx-auto w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <LayoutGrid className="w-5 h-5 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-medium">Workspace is empty</h3>
            <p className="text-xs text-muted-foreground mt-1 mb-6">
              Start by uploading a resume to generate an infographic presentation.
            </p>
            <Button asChild size="sm" variant="outline" className="border-white/10">
              <Link href="/upload">Get Started</Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-lg border border-white/5 bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-bold tracking-tight">Recent Activity</h3>
              </div>
              <p className="text-xs text-muted-foreground">No recent generations found.</p>
            </div>
            <div className="rounded-lg border border-white/5 bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-bold tracking-tight">Usage Stats</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1.5">
                    <span>Free Tier Usage</span>
                    <span>0 / 5</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-white/20 w-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <SlideDeck 
            slides={activeItem.slides} 
            candidateName={displayName} 
          />
        </div>
      )}
    </div>
  )
}
