"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ClipboardList,
  FileText,
  Home,
  Menu,
  AlertCircle,
  FileCheck,
  Calendar,
  FileQuestion,
  BookOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      label: "概览",
      icon: Home,
    },
    {
      href: "/issues",
      label: "问题记录",
      icon: AlertCircle,
    },
    {
      href: "/documents",
      label: "已生成文档",
      icon: FileText,
    },
    {
      href: "/supervision",
      label: "旁站记录",
      icon: ClipboardList,
    },
    {
      href: "/daily-logs",
      label: "监理日志",
      icon: Calendar,
    },
    {
      href: "/meeting-minutes",
      label: "会议纪要",
      icon: FileCheck,
    },
    {
      href: "/knowledge-base",
      label: "规范知识库",
      icon: BookOpen,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Button variant="outline" size="icon" className="md:hidden" onClick={() => setOpen(true)}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <div className="flex items-center gap-2">
          <FileQuestion className="h-6 w-6" />
          <span className="font-semibold">巡检记录助手</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="sm">
            返回对话
          </Button>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-[240px] flex-col border-r bg-muted/40 md:flex">
          <nav className="grid gap-2 p-4 text-sm">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary",
                  pathname === route.href && "bg-muted font-medium text-primary",
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            ))}
          </nav>
        </aside>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="w-[240px] p-0">
            <div className="flex items-center gap-2 border-b p-4">
              <FileQuestion className="h-6 w-6" />
              <span className="font-semibold">巡检记录助手</span>
            </div>
            <nav className="grid gap-2 p-4 text-sm">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-primary",
                    pathname === route.href && "bg-muted font-medium text-primary",
                  )}
                >
                  <route.icon className="h-4 w-4" />
                  {route.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
