"use client"

import * as React from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="flex h-12 items-center justify-end gap-3 border-b border-white/5 bg-background px-4">
      <Button asChild size="sm" variant="outline" className="h-8 gap-2 text-xs font-medium border-white/10 hover:bg-white/5">
        <Link href="/upload">
          <Plus className="h-3.5 w-3.5" />
          New Analysis
        </Link>
      </Button>
    </header>
  )
}
