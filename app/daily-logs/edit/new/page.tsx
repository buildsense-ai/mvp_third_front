"use client"

import { DailyLogEdit } from "@/components/daily-log-edit"
import DashboardLayout from "@/app/dashboard-layout"
import { useRouter } from "next/navigation"

export default function NewDailyLogPage() {
  const router = useRouter()

  const handleSave = (data: any) => {
    console.log("保存新日志数据:", data)
    // 在实际应用中，这里会调用API保存数据
    // 然后重定向到日志列表页面
    router.push("/daily-logs")
    // 显示成功消息
    window.alert("新日志创建成功！")
  }

  // 创建新日志的初始数据
  const initialData = {
    basicInfo: {
      projectName: "某某建设工程",
      date: new Date().toISOString().split("T")[0],
      weather: "",
      temperature: "",
    },
    supervisionPersonnel: [
      { id: "chief", label: "总工（总监）", checked: false },
      { id: "specialist", label: "专工（专业监理）", checked: false },
    ],
    constructionActivities: [],
    supervisionActivities: [],
    problems: {
      quality: [],
      safety: [],
      progress: [],
      cost: [],
    },
    otherMatters: [],
  }

  return (
    <DashboardLayout>
      <DailyLogEdit initialData={initialData} onSave={handleSave} />
    </DashboardLayout>
  )
}
