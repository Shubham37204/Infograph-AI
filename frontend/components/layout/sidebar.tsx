"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import { LayoutDashboard, Upload, History, ChevronLeft, ChevronRight } from "lucide-react"
import { useUIStore } from "@/lib/stores/ui-store"
import { cn } from "@/lib/cn"
import { Button } from "@/components/ui/button"

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "New Analysis", href: "/upload", icon: Upload },
  { title: "History", href: "/history", icon: History },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col border-r border-white/5 bg-background transition-all duration-200",
        sidebarCollapsed ? "w-14" : "w-56"
      )}
    >
      <div className="flex h-12 items-center border-b border-white/5 px-4">
        {!sidebarCollapsed && (
          <span className="font-bold text-sm tracking-tight overflow-hidden text-nowrap">
            infograph-ai
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-2 overflow-hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname === "/" && item.href === "/dashboard")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-1.5 text-xs font-medium transition-colors overflow-hidden",
                isActive
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
              title={sidebarCollapsed ? item.title : undefined}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && <span>{item.title}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/5 p-2 flex items-center justify-between gap-2">
        {!sidebarCollapsed && (
          <div className="px-2">
            <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "h-6 w-6" } }} />
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-8 w-8 p-0", sidebarCollapsed && "mx-auto")}
          onClick={toggleSidebar}
        >
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  )
}
