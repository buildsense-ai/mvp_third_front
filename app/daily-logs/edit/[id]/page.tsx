"use client"

import { DailyLogEdit } from "@/components/daily-log-edit"
import DashboardLayout from "@/app/dashboard-layout"
import { useParams, useRouter } from "next/navigation"

export default function DailyLogEditPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params

  const handleSave = (data: any) => {
    console.log("保存日志数据:", data)
    // 在实际应用中，这里会调用API保存数据
    // 然后重定向到日志列表页面
    router.push("/daily-logs")
    // 显示成功消息
    window.alert("日志保存成功！")
  }

  return (
    <DashboardLayout>
      <DailyLogEdit id={id as string} onSave={handleSave} />
    </DashboardLayout>
  )
}
