import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Layout, FileText, Share2, Terminal, Monitor, Database } from "lucide-react"

export default async function LandingPage() {
  const { userId } = await auth()

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full border-b border-white/5">
        <div className="text-sm font-bold tracking-tight">infograph-ai</div>
        <div className="flex items-center gap-4">
           {!userId && (
             <SignInButton mode="modal">
               <Button variant="ghost" size="sm" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
                 Sign In
               </Button>
             </SignInButton>
           )}
           <Button asChild size="sm" className="h-8 text-[11px] font-bold uppercase tracking-widest px-4">
             <Link href="/dashboard">
               {userId ? "Go to Dashboard" : "Get Started"}
             </Link>
           </Button>
        </div>
      </header>

      <main className="relative z-10 flex flex-col items-center">
        {/* Hero Section */}
        <section className="pt-24 pb-12 px-6 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-8">
            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            Engineering-Oriented Workspace
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.95] mb-8">
            Resume intelligence <br />
            <span className="text-muted-foreground/40">transformed into slides.</span>
          </h1>
          
          <p className="text-sm md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-10 font-medium">
            A utilitarian workspace designed for transforming high-density professional documents into editorial-grade presentations.
          </p>

          <div className="flex justify-center gap-4">
            {!userId ? (
              <SignUpButton mode="modal">
                <Button size="lg" className="h-12 px-8 font-bold tracking-tight rounded-lg">
                  Initialize Workspace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </SignUpButton>
            ) : (
              <Button asChild size="lg" className="h-12 px-8 font-bold tracking-tight rounded-lg">
                <Link href="/dashboard">
                  Enter Workspace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </section>

        {/* Product Preview Mockup */}
        <section className="px-6 pb-24 w-full max-w-6xl mx-auto">
          <div className="relative group rounded-2xl border border-white/10 bg-card/50 overflow-hidden p-2">
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 opacity-40" />
            <img 
              src="/images/preview.png" 
              alt="Infograph-AI Workspace Preview" 
              className="w-full h-auto rounded-xl grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
            />
            
            {/* Overlay UI Elements */}
            <div className="absolute top-8 left-8 z-20 hidden md:block">
               <div className="bg-background/80 backdrop-blur border border-white/10 p-4 rounded-lg shadow-2xl space-y-3 w-48 animate-in fade-in slide-in-from-left-4 duration-1000">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Analysis Active</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[65%]" />
                    </div>
                    <div className="text-[8px] text-muted-foreground uppercase font-bold">Extracting Data: 65%</div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Technical Workflow Section */}
        <section className="w-full bg-white/[0.01] border-y border-white/5 py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
               <div className="space-y-6">
                  <h2 className="text-3xl font-bold tracking-tighter">Engineered for <br/> document clarity.</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                    We have optimized the extraction pipeline to identify structural markers in professional resumes, mapping experience, skills, and timelines to a standardized infographic schema.
                  </p>
                  
                  <ul className="space-y-4 pt-4">
                    {[
                      { icon: Terminal, title: "Data Normalization", desc: "Standardizing heterogeneous resume formats into clean JSON." },
                      { icon: Monitor, title: "Editorial Layouts", desc: "Automated slide generation using structural design principles." },
                      { icon: Database, title: "Persistence", desc: "Track generations with lightweight local or cloud storage." }
                    ].map((item, i) => (
                      <li key={i} className="flex gap-4">
                        <div className="h-8 w-8 rounded bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          <item.icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="text-[11px] font-bold uppercase tracking-wider">{item.title}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4 pt-8">
                     <div className="h-40 bg-card border border-white/5 rounded-xl p-4 flex flex-col justify-end">
                        <div className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Success Rate</div>
                        <div className="text-2xl font-bold tracking-tighter">98.4%</div>
                     </div>
                     <div className="h-32 bg-card border border-white/5 rounded-xl p-4 flex flex-col justify-end">
                        <div className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Avg. Processing</div>
                        <div className="text-2xl font-bold tracking-tighter">4.2s</div>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="h-32 bg-card border border-white/5 rounded-xl p-4 flex flex-col justify-end">
                        <div className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Data Points</div>
                        <div className="text-2xl font-bold tracking-tighter">120+</div>
                     </div>
                     <div className="h-40 bg-card border border-white/5 rounded-xl p-4 flex flex-col justify-end">
                        <div className="text-[9px] font-bold text-muted-foreground uppercase mb-1">Global Users</div>
                        <div className="text-2xl font-bold tracking-tighter">12k</div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Feature Grid (Condensed) */}
        <section className="py-24 px-6 max-w-6xl mx-auto w-full">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5 rounded-xl overflow-hidden">
            <div className="p-8 bg-card flex flex-col gap-3 group hover:bg-white/[0.02] transition-colors">
              <FileText className="w-4 h-4 text-muted-foreground mb-1 group-hover:text-foreground transition-colors" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Deep Analysis</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">Our engine parses complex resume structures to extract meaningful professional narratives.</p>
            </div>
            <div className="p-8 bg-card flex flex-col gap-3 group hover:bg-white/[0.02] transition-colors">
              <Layout className="w-4 h-4 text-muted-foreground mb-1 group-hover:text-foreground transition-colors" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Smart Formatting</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">Data is automatically mapped to one of five editorial slide types based on content density.</p>
            </div>
            <div className="p-8 bg-card flex flex-col gap-3 group hover:bg-white/[0.02] transition-colors">
              <Share2 className="w-4 h-4 text-muted-foreground mb-1 group-hover:text-foreground transition-colors" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Instant Export</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">Download your generated presentation as a high-fidelity PDF or share a private workspace link.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative py-12 px-6 border-t border-white/5 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="text-xs font-bold tracking-tight">infograph-ai</div>
            <div className="text-[9px] text-muted-foreground/50 uppercase tracking-widest font-bold">Human-designed utility for professional intelligence.</div>
          </div>
          
          <div className="flex gap-8 text-[10px] text-muted-foreground/50 uppercase tracking-widest font-bold">
            <span className="cursor-default hover:text-muted-foreground transition-colors">Workspace v1.0.2</span>
            <span className="cursor-default hover:text-muted-foreground transition-colors">Systems Documentation</span>
            <span className="cursor-default hover:text-muted-foreground transition-colors">Legal</span>
          </div>
        </div>
        
        <div className="mt-12 text-center text-[10px] text-muted-foreground/30 uppercase tracking-[0.3em] font-bold">
          © {new Date().getFullYear()} Infograph-AI • Optimized for performance
        </div>
      </footer>
    </div>
  )
}
