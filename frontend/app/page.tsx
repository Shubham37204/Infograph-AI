import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, FileText, Layout, Presentation, Share2, Upload } from "lucide-react"

export default async function LandingPage() {
  const { userId } = await auth()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-base font-bold tracking-tight">
            infograph-ai
          </Link>
          <div className="flex items-center gap-3">
            {!userId && (
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="text-xs font-semibold text-muted-foreground">
                  Sign in
                </Button>
              </SignInButton>
            )}
            {userId ? (
              <Button asChild size="sm" className="h-9 px-4 font-semibold">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <SignUpButton mode="modal">
                <Button size="sm" className="h-9 px-4 font-semibold">
                  Get Started
                </Button>
              </SignUpButton>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#71717a16_1px,transparent_1px),linear-gradient(to_bottom,#71717a16_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col px-6 pt-20">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Resume decks for hiring conversations
              </div>
              <h1 className="text-5xl font-bold leading-[0.96] tracking-tight md:text-7xl">
                Turn a resume into a polished presentation.
              </h1>
              <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                Upload a PDF resume and get a structured slide deck with skills, experience highlights, career timeline, recommendations, and ATS fit.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                {userId ? (
                  <Button asChild size="lg" className="h-12 gap-2 px-7 font-semibold shadow-sm">
                    <Link href="/dashboard">
                      Open Workspace
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <SignUpButton mode="modal">
                    <Button size="lg" className="h-12 gap-2 px-7 font-semibold shadow-sm">
                      Create Your First Deck
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </SignUpButton>
                )}
                <Button asChild variant="outline" size="lg" className="h-12 gap-2 border-border bg-background/70 px-7 font-semibold">
                  <Link href={userId ? "/upload" : "/sign-in"}>
                    <Upload className="h-4 w-4" />
                    Upload Resume
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mt-16 flex-1">
              <div className="mx-auto max-w-6xl rounded-t-xl border border-b-0 border-border bg-card shadow-2xl">
                <div className="flex h-11 items-center justify-between border-b border-border px-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Live Deck Preview
                  </div>
                </div>
                <div className="grid min-h-[360px] gap-px bg-border md:grid-cols-[220px_1fr]">
                  <aside className="hidden bg-muted/30 p-4 md:block">
                    <div className="mb-6 text-xs font-bold">infograph-ai</div>
                    {["Snapshot", "Skills", "Experience", "Timeline", "ATS Score"].map((item, index) => (
                      <div
                        key={item}
                        className={`mb-2 flex items-center gap-3 rounded-md px-3 py-2 text-xs ${
                          index === 4 ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {item}
                      </div>
                    ))}
                  </aside>
                  <div className="bg-background p-5 md:p-8">
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">ATS Score - 8 of 8</p>
                        <h2 className="mt-3 text-2xl font-bold tracking-tight">ATS Compatibility Score</h2>
                      </div>
                      <div className="rounded-full border border-border px-3 py-1 text-xs font-semibold">85 / 100</div>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-6 md:p-8">
                      <p className="text-lg text-muted-foreground">Strong technical skills and project experience</p>
                      <div className="mt-8 grid gap-5 md:grid-cols-3">
                        {[
                          ["Matched", "Next.js, TypeScript, Python, AI/ML"],
                          ["Missing", "More quantified metrics in experience bullets"],
                          ["Fix", "Add stronger project outcomes and deployment details"],
                        ].map(([label, value]) => (
                          <div key={label}>
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
                            <p className="mt-2 text-sm leading-6">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-16 px-6 py-24 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Designed for clarity</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              A resume workspace that feels finished before export.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
              The interface focuses on the work: upload, review, present, and export. No noisy panels, no broken preview images, no placeholder-heavy layout.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              [FileText, "Deep Resume Read", "Extracts skills, education, project evidence, experience, and timeline details from the resume."],
              [Presentation, "Presentation First", "Turns dense resume content into recruiter-friendly slides with consistent visual rhythm."],
              [BarChart3, "ATS Fit Summary", "Surfaces matched keywords, missing signals, and the next best improvement."],
              [Share2, "Clean Export", "Exports the generated deck as a PDF without changing the on-screen structure."],
            ].map(([Icon, title, desc]) => (
              <div key={title as string} className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <h3 className="mt-5 text-sm font-bold uppercase tracking-[0.12em]">{title as string}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{desc as string}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-muted/20">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-20 md:grid-cols-3">
            {[
              [Upload, "Upload", "Start with a single PDF resume."],
              [Layout, "Review", "Move through a complete deck in the workspace."],
              [Share2, "Export", "Download a presentation-ready PDF."],
            ].map(([Icon, title, desc]) => (
              <div key={title as string} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-background">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">{title as string}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{desc as string}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div>
            <div className="font-bold text-foreground">infograph-ai</div>
            <div className="mt-1 text-xs">Resume intelligence, ready to present.</div>
          </div>
          <div className="text-xs">© {new Date().getFullYear()} Infograph-AI</div>
        </div>
      </footer>
    </div>
  )
}
