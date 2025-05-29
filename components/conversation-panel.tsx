"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { AlertCircle, ClipboardList } from "lucide-react"

export function ConversationPanel() {
  const [message, setMessage] = useState("")

  return (
    <div className="flex flex-col h-screen">
      <MobileNav />
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">
              您好，我是巡检记录助手。我可以帮助您记录巡检问题、生成文档和管理旁站活动。请问有什么可以帮助您的？
            </p>
          </div>

          <div className="bg-primary/10 p-4 rounded-lg ml-auto">
            <p className="text-sm">我今天在A区发现了一个问题，基坑支护结构变形超出设计允许值</p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">
              我已记录这个问题。请问您能提供更多细节吗？例如具体位置、变形程度等。您也可以上传相关照片。
            </p>
          </div>

          <div className="bg-primary/10 p-4 rounded-lg ml-auto">
            <p className="text-sm">位置是A区北侧基坑，变形约15mm，超出设计允许值5mm</p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">
              谢谢您提供的信息。我已经创建了一个问题记录：
              <br />
              <br />
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="font-medium">问题记录已创建</span>
              </div>
              <strong>问题：</strong> 基坑支护结构变形超出设计允许值
              <br />
              <strong>位置：</strong> A区北侧基坑
              <br />
              <strong>状态：</strong> 待处理
              <br />
              <strong>详情：</strong> 变形约15mm，超出设计允许值5mm
              <br />
              <br />
              您可以在
              <Link href="/dashboard/events?type=issue" className="text-blue-600 underline mx-1">
                问题记录
              </Link>
              中查看此问题的详细信息。或者查看
              <Link href="/dashboard" className="text-blue-600 underline mx-1">
                看板概览
              </Link>
              了解项目整体情况。
            </p>
          </div>

          <div className="bg-primary/10 p-4 rounded-lg ml-auto">
            <p className="text-sm">请记录一下今天的旁站监理情况，混凝土浇筑，时间是上午9点到12点半，地点是A区3层板</p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">
              已为您记录旁站监理情况：
              <br />
              <br />
              <div className="flex items-center gap-2 mb-2">
                <ClipboardList className="h-4 w-4 text-blue-500" />
                <span className="font-medium">旁站记录已创建</span>
              </div>
              <strong>项目：</strong> 混凝土浇筑旁站
              <br />
              <strong>时间：</strong> 09:00-12:30
              <br />
              <strong>地点：</strong> A区3层板
              <br />
              <br />
              您可以在
              <Link href="/dashboard/events?type=supervision" className="text-blue-600 underline mx-1">
                事件记录
              </Link>
              中查看和编辑此旁站记录。
            </p>
          </div>

          <div className="bg-primary/10 p-4 rounded-lg ml-auto">
            <p className="text-sm">我需要生成一份监理工程师通知单</p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">
              好的，我已经为您生成了监理工程师通知单。您可以在
              <Link href="/dashboard/documents" className="text-blue-600 underline mx-1">
                已生成文档
              </Link>
              中查看和下载。
            </p>
          </div>
        </div>
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <input
            type="text"
            placeholder="输入消息..."
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button>发送</Button>
        </div>
      </div>
    </div>
  )
}
