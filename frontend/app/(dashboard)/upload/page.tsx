"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { usePipelineMutation } from "@/lib/queries/use-pipeline"
import { DropZone } from "@/components/upload/drop-zone"
import { ProcessingStages } from "@/components/upload/processing-stages"
import { Button } from "@/components/ui/button"
import { RefreshCcw, ArrowLeft, CheckCircle2 } from "lucide-react"
import { useHistoryStore } from "@/lib/stores/history-store"

export default function UploadPage() {
  const router = useRouter()
  const { mutate, data, isPending, error, reset } = usePipelineMutation()
  const [stage, setStage] = React.useState<string | null>(null)
  const { addItem } = useHistoryStore()
  const [lastFile, setLastFile] = React.useState<{ name: string; size: number } | null>(null)

  // Simulate progress stages
  React.useEffect(() => {
    if (!isPending) return
    
    setStage("parsing")
    
    const timers = [
      setTimeout(() => setStage("analyzing"), 2000), 
      setTimeout(() => setStage("slides"), 6000),
    ]

    return () => timers.forEach(clearTimeout)
  }, [isPending])

  // Handle completion and save to history
  React.useEffect(() => {
    if (data && lastFile) {
      const id = crypto.randomUUID()
      addItem({
        id,
        fileName: lastFile.name,
        fileSize: lastFile.size,
        timestamp: Date.now(),
        slides: data.slides,
        status: 'completed'
      })
      
      // Delay redirect to show success state
      const timer = setTimeout(() => {
        router.push(`/dashboard?id=${id}`)
      }, 1500)
      
      return () => clearTimeout(timer)
    }
  }, [data, lastFile, addItem, router])

  const handleFileSelect = (file: File) => {
    setLastFile({ name: file.name, size: file.size })
    mutate(file)
  }

  const handleReset = () => {
    reset()
    setStage(null)
    setLastFile(null)
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-12 px-4">
      <div className="mb-12">
        <h1 className="text-xl font-bold tracking-tight">New Analysis</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Upload a resume PDF to generate an editorial infographic presentation.
        </p>
      </div>

      <div className="bg-card border border-white/5 rounded-xl overflow-hidden shadow-sm">
        <div className="p-8 md:p-12">
          {!isPending && !data && (
            <DropZone onFileSelect={handleFileSelect} disabled={isPending} />
          )}

          {isPending && (
            <div className="py-12 flex flex-col items-center">
              <ProcessingStages currentStage={stage || "parsing"} />
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-8 animate-pulse">
                Processing your document...
              </p>
            </div>
          )}

          {data && (
            <div className="py-12 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold tracking-tight">Generation Complete</h3>
              <p className="text-xs text-muted-foreground mt-1">Redirecting to your workspace...</p>
            </div>
          )}

          {error && (
            <div className="py-8 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-[10px] font-bold uppercase tracking-wider mb-4">
                Analysis Failed
              </div>
              <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
                {error.message || "We encountered an issue processing this PDF. Please ensure it's a valid resume and try again."}
              </p>
              <Button onClick={handleReset} variant="outline" size="sm" className="border-white/10">
                <RefreshCcw className="w-3.5 h-3.5 mr-2" />
                Try Again
              </Button>
            </div>
          )}
        </div>
        
        {!isPending && !data && (
          <div className="px-8 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground text-xs hover:bg-transparent">
              <Link href="/dashboard">
                <ArrowLeft className="w-3.5 h-3.5 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="text-[10px] text-muted-foreground/50 font-medium">
              Supported formats: PDF
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
