import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Layout, FileText, Share2 } from "lucide-react"

export default async function LandingPage() {
  const { userId } = await auth()

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <main className="relative flex-1 flex flex-col items-center justify-center p-6 z-10">
        <div className="max-w-xl w-full">
          <div className="text-center space-y-6 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground animate-in fade-in slide-in-from-top-4 duration-1000">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              Product Workspace 1.0
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
              Turn your resume into an editorial presentation.
            </h1>
            
            <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
              A utilitarian workspace for transforming PDF documents into professional, data-driven infographic decks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5 rounded-xl overflow-hidden mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            <div className="p-6 bg-card flex flex-col gap-2">
              <FileText className="w-4 h-4 text-muted-foreground mb-2" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Analyze</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">Deep extraction of professional document data.</p>
            </div>
            <div className="p-6 bg-card flex flex-col gap-2">
              <Layout className="w-4 h-4 text-muted-foreground mb-2" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Format</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">Editorial layout generation with structural hierarchy.</p>
            </div>
            <div className="p-6 bg-card flex flex-col gap-2">
              <Share2 className="w-4 h-4 text-muted-foreground mb-2" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Export</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">High-fidelity PDF and slide-deck sharing.</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
            {userId ? (
              <Button asChild size="lg" className="w-full h-12 font-bold tracking-tight rounded-lg">
                <Link href="/dashboard">
                  Open Workspace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <div className="flex flex-col gap-3">
                <SignUpButton mode="modal">
                  <Button size="lg" className="w-full h-12 font-bold tracking-tight rounded-lg">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm" className="w-full h-10 text-muted-foreground hover:text-foreground text-[11px] font-bold uppercase tracking-widest">
                    Sign in to existing account
                  </Button>
                </SignInButton>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="relative py-8 px-6 border-t border-white/5 z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-bold">
          infograph-ai • Product Workspace
        </div>
        <div className="flex gap-6 text-[10px] text-muted-foreground/50 uppercase tracking-widest font-bold">
          <span className="cursor-default">v1.0.2</span>
          <span className="cursor-default">Built for utility</span>
        </div>
      </footer>
    </div>
  )
}
