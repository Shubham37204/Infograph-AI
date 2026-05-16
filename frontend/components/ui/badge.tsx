import * as React from "react"
import { cn } from "@/lib/cn"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | string
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants: Record<string, string> = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground",
    // Special slide variants
    summary: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
    skills: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
    experience: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    timeline: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    strengths: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    recommendations: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    ats_score: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
    snapshot: "bg-indigo-200/50 text-indigo-800 border-indigo-300 dark:bg-indigo-900/40 dark:text-indigo-200",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    />
  )
}

export { Badge }
