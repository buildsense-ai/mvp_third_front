"use client"

import { DailyLogEdit } from "@/components/daily-log-edit"
import DashboardLayout from "@/app/dashboard-layout"

export default function DailyLogEditPage() {
  const handleSave = (data: any) => {
    console.log("保存日志数据:", data)
    // 在实际应用中，这里会调用API保存数据
    // 然后可能会重定向到日志列表页面
    window.alert("日志保存成功！")
  }

  return (
    <DashboardLayout>
      <DailyLogEdit onSave={handleSave} />
    </DashboardLayout>
  )
}
