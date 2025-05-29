"use client"

import type React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface DashboardPanelProps {
  children: React.ReactNode
  defaultTab?: string
}

export function DashboardPanel({ children, defaultTab = "overview" }: DashboardPanelProps) {
  return (
    <div className="h-full flex flex-col border-l">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">辅助看板</h2>
      </div>
      {children}
    </div>
  )
}

interface DashboardTabsProps {
  defaultValue?: string
  tabs: {
    id: string
    label: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
  children: React.ReactNode
}

export function DashboardTabs({ defaultValue = "overview", tabs, children }: DashboardTabsProps) {
  return (
    <Tabs defaultValue={defaultValue} className="flex-1 flex flex-col">
      <div className="border-b px-2">
        <TabsList className="h-12 w-full justify-start gap-2 bg-transparent p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={cn(
                "flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
              )}
            >
              {tab.icon && <tab.icon className="h-4 w-4" />}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <div className="flex-1 overflow-auto p-4">{children}</div>
    </Tabs>
  )
}

export function DashboardTabContent({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <TabsContent value={value} className="flex-1 h-full mt-0 p-0">
      {children}
    </TabsContent>
  )
}
