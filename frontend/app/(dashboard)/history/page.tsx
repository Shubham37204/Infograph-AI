"use client"

import * as React from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { FileText, MoreVertical, ExternalLink, Trash2, Clock } from "lucide-react"
import { useHistoryStore } from "@/lib/stores/history-store"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function HistoryPage() {
  const { items, removeItem } = useHistoryStore()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold tracking-tight">History</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage and view your previously generated resume presentations.
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-white/10 p-12 text-center">
          <div className="mx-auto w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <Clock className="w-5 h-5 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium">No history yet</h3>
          <p className="text-xs text-muted-foreground mt-1 mb-6">
            Upload your first resume to see it here.
          </p>
          <Button asChild size="sm" variant="outline" className="border-white/10">
            <Link href="/upload">New Analysis</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border border-white/5 bg-card overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Document</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Generated</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium leading-none">{item.fileName}</span>
                        <span className="text-[10px] text-muted-foreground mt-1">{(item.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        item.status === 'completed' ? 'bg-emerald-500' : 
                        item.status === 'processing' ? 'bg-amber-500 animate-pulse' : 'bg-destructive'
                      }`} />
                      <span className="text-[11px] capitalize">{item.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Link href={`/dashboard?id=${item.id}`}>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <MoreVertical className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-white/10">
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
