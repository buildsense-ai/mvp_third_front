"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard/events":
        return "事件记录"
      case "/dashboard/documents":
        return "已生成文档"
      default:
        if (pathname.startsWith("/dashboard/events/")) {
          return "事件详情"
        }
        if (pathname.startsWith("/dashboard/documents/")) {
          return "文档详情"
        }
        return "巡检记录助手"
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <MobileNav />
      <div className="p-4 flex items-center gap-2 border-b">
        <Link href="/dashboard/events">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
      </div>
      <main className="flex-1 p-4 overflow-auto">{children}</main>
    </div>
  )
}
