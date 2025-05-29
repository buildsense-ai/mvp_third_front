"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  MapPin,
  MergeIcon,
  Clock,
  Users,
  Edit,
  AlertCircle,
  ClipboardList,
  FileCheck,
  FileText,
  ClipboardCheck,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ProblemRecordDetailModal } from "@/components/problem-record-detail-modal"
import { ProblemRecordEditModal } from "@/components/problem-record-edit-modal"
import { GenerateNotificationModal } from "@/components/generate-notification-modal"
import { DailyLogEditModal } from "@/components/daily-log-edit-modal"
import { DailyLogDetailModal } from "@/components/daily-log-detail-modal"
import { SupervisionRecordEditModal } from "@/components/supervision-record-edit-modal"
import { SupervisionRecordDetailModal } from "@/components/supervision-record-detail-modal"
import { MeetingMinuteEditModal } from "@/components/meeting-minute-edit-modal"
import { MeetingMinuteDetailModal } from "@/components/meeting-minute-detail-modal"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  getSupervisionRecords,
  type SupervisionRecord,
  getIssueRecords,
  updateIssueRecord,
  type IssueRecord,
  deleteIssueRecord,
} from "@/lib/api-service"
import { IssueRecordCreateModal } from "@/components/issue-record-create-modal"
import { IssueRecord, SupervisionRecord } from "@/lib/api-service"
import { toast } from "@/components/ui/use-toast"

// 基础事件类型
interface BaseEvent {
  id: string
  type: string
  title: string
  date: string
  weather?: string
  icon?: any
  location?: string
  status?: string
  attendees?: number
  time?: string
  responsibleUnit?: string
  generatedDocuments?: Array<{
    id: string
    title: string
    date: string
    type: string
  }>
}

// 扩展的事件类型
type ExtendedEvent = BaseEvent & Partial<IssueRecord & SupervisionRecord>

// 监理日志数据
const mockDailyLogs: ExtendedEvent[] = [
  {
    id: "log-1",
    type: "daily-log",
    title: "监理日志 - 2025-05-10",
    date: "2025-05-10",
    weather: "晴",
    icon: Calendar,
    basicInfo: {
      projectName: "某某建设工程",
      date: "2025-05-10",
      weather: "晴",
      temperature: "20-28℃",
    },
    supervisionPersonnel: [
      { id: "chief", label: "总工（总监）", checked: true },
      { id: "specialist", label: "专工（专业监理）", checked: true },
    ],
    constructionActivities: [
      {
        id: "ca1",
        location: "A区3层",
        content: "浇筑混凝土",
        details: "今日对A区3层进行了混凝土浇筑，共计约120立方米。",
      },
    ],
    supervisionActivities: [
      {
        id: "sa1",
        type: "旁站",
        relatedActivity: "浇筑混凝土（A区3层）",
        details: "对A区3层混凝土浇筑进行了旁站监理，检查了模板支撑、钢筋绑扎情况，确保浇筑质量符合施工要求。",
      },
    ],
    problems: {
      quality: [
        {
          id: "q1",
          description: "发现A区3层混凝土浇筑过程中有少量蜂窝麻面",
          measures: "已要求施工单位及时处理并加强模板支设和振捣工作",
        },
      ],
      safety: [],
      progress: [],
      cost: [],
    },
    otherMatters: [
      {
        id: "om1",
        type: "correspondence",
        title: "重要来往文件、电话记录",
        content: "今日收到建设单位关于工程变更的通知函1份。",
      },
    ],
    generatedDocuments: [{ id: "doc-1", title: "监理日志-2025-05-10", date: "2025-05-10", type: "pdf" }],
  },
  {
    id: "log-2",
    type: "daily-log",
    title: "监理日志 - 2025-05-11",
    date: "2025-05-11",
    weather: "多云",
    icon: Calendar,
    basicInfo: {
      projectName: "某某建设工程",
      date: "2025-05-11",
      weather: "多云",
      temperature: "18-25℃",
    },
    supervisionPersonnel: [
      { id: "chief", label: "总工（总监）", checked: true },
      { id: "specialist", label: "专工（专业监理）", checked: true },
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
    generatedDocuments: [],
  },
]

// 会议纪要数据
const mockMeetingMinutes = [
  {
    id: "meeting-1",
    type: "meeting",
    title: "项目例会",
    date: "2025-05-10",
    attendees: 12,
    icon: FileCheck,
    basicInfo: {
      meetingName: "某某工程第1次监理例会",
      dateTime: "2025年5月10日 14:00-16:00",
      location: "项目部会议室",
      host: "张三（总监）",
      recorder: "李四（监理员）",
      attendees: "建设单位：王五、赵六；施工单位：钱七、孙八；监理单位：张三、李四",
    },
    constructionIssues: "施工单位反映基坑支护结构变形超出设计允许值，需要设计单位提供处理方案。",
    supervisionAnalysis: {
      safety: "本周安全文明施工情况良好，未发现重大安全隐患。",
      qualityAndProgress: "本周完成A区基坑开挖，质量符合要求，进度略有滞后。",
      documentation: "施工日志记录不够详细，需要加强。",
      nextWeekRequirements: "加强基坑支护监测，确保施工安全。",
    },
    costUnit: "本周已完成A区基坑开挖工程量的计量，正在审核。",
    designUnit: "已收到基坑支护变形问题，正在研究处理方案。",
    surveyUnit: "无",
    buildingUnit: {
      safety: "要求施工单位加强现场安全管理，特别是高处作业安全防护。",
      qualityAndProgress: "要求加快施工进度，确保下周完成B区基坑开挖。",
      documentation: "要求完善施工资料，及时归档。",
      nextWeekRequirements: "重点关注基坑支护问题，确保施工安全。",
    },
    followUpItems: {
      designChanges: "基坑支护设计变更待定。",
      workContactApproval: "已审批工作联系单3份，待审批2份。",
    },
    generatedDocuments: [{ id: "doc-m1", title: "项目例会纪要-2025-05-10", date: "2025-05-10", type: "pdf" }],
  },
  {
    id: "meeting-2",
    type: "meeting",
    title: "质量专题会",
    date: "2025-05-12",
    attendees: 8,
    icon: FileCheck,
    basicInfo: {
      meetingName: "混凝土质量专题会",
      dateTime: "2025年5月12日 10:00-11:30",
      location: "项目部会议室",
      host: "张三（总监）",
      recorder: "李四（监理员）",
      attendees: "建设单位：王五；施工单位：钱七、孙八、周九；监理单位：张三、李四",
    },
    constructionIssues: "施工单位反映混凝土供应商送料不及时，影响施工进度。",
    supervisionAnalysis: {
      safety: "无特殊安全问题。",
      qualityAndProgress: "混凝土浇筑过程中出现蜂窝麻面现象，需要加强振捣工作。",
      documentation: "无",
      nextWeekRequirements: "加强混凝土浇筑过程控制，确保质量。",
    },
    costUnit: "无",
    designUnit: "无",
    surveyUnit: "无",
    buildingUnit: {
      safety: "无",
      qualityAndProgress: "要求施工单位加强混凝土浇筑工艺控制，确保质量。",
      documentation: "无",
      nextWeekRequirements: "协调解决混凝土供应问题，确保施工进度。",
    },
    followUpItems: {
      designChanges: "无",
      workContactApproval: "已审批工作联系单1份。",
    },
    generatedDocuments: [],
  },
]

export default function EventsPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [showMergeDialog, setShowMergeDialog] = useState(false)
  const [showInspectionDialog, setShowInspectionDialog] = useState(false)

  // 问题记录状态
  const [issueRecords, setIssueRecords] = useState<IssueRecord[]>([])
  const [loadingIssues, setLoadingIssues] = useState(true)

  // 旁站记录状态
  const [supervisionRecords, setSupervisionRecords] = useState<SupervisionRecord[]>([])
  const [loadingSupervision, setLoadingSupervision] = useState(true)

  // State for problem record detail modal
  const [problemDetailModalOpen, setProblemDetailModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)

  // State for problem record edit modal
  const [problemEditModalOpen, setProblemEditModalOpen] = useState(false)

  // State for notification generation modal
  const [notificationModalOpen, setNotificationModalOpen] = useState(false)

  // State for daily log detail modal
  const [dailyLogDetailModalOpen, setDailyLogDetailModalOpen] = useState(false)

  // State for daily log edit modal
  const [dailyLogEditModalOpen, setDailyLogEditModalOpen] = useState(false)

  // State for supervision record detail modal
  const [supervisionDetailModalOpen, setSupervisionDetailModalOpen] = useState(false)

  // State for supervision record edit modal
  const [supervisionEditModalOpen, setSupervisionEditModalOpen] = useState(false)

  // State for meeting minute detail modal
  const [meetingDetailModalOpen, setMeetingDetailModalOpen] = useState(false)

  // State for meeting minute edit modal
  const [meetingEditModalOpen, setMeetingEditModalOpen] = useState(false)

  // State for issue record create modal
  const [issueCreateModalOpen, setIssueCreateModalOpen] = useState(false)

  // 加载问题记录数据
  const loadIssueRecords = async () => {
    try {
      setLoadingIssues(true)
      let statusFilter: string | undefined
      
      // 根据前端状态映射到后端状态
      if (selectedStatus !== "all") {
        switch (selectedStatus) {
          case "pending":
            statusFilter = "待处理"
            break
          case "processing":
            statusFilter = "处理中"
            break
          case "resolved":
            statusFilter = "已闭环"
            break
        }
      }
      
      const records = await getIssueRecords(0, 50, statusFilter)

      // 转换数据格式以匹配前端显示，确保每个记录都有唯一的 ID
      const processedRecords = records.map((record, index) => {
        // 使用记录 ID 和时间戳组合生成唯一标识符
        const uniqueId = `${record.id}-${record.record_time || Date.now()}-${index}`
        
        // 映射后端状态到前端状态
        let frontendStatus = "pending"
        switch (record.status) {
          case "待处理":
            frontendStatus = "pending"
            break
          case "处理中":
            frontendStatus = "processing"
            break
          case "已闭环":
            frontendStatus = "resolved"
            break
          default:
            frontendStatus = "pending"
        }
        
        return {
          ...record,
          id: uniqueId, // 使用生成的唯一 ID
          type: "issue",
          icon: AlertCircle,
          title: record.description,
          date: record.record_time
            ? new Date(record.record_time).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          status: frontendStatus,
          hasImage: record.images && record.images.length > 0,
          responsibleUnit: "施工单位", // 后端暂无此字段，使用默认值
          standards: [], // 后端暂无此字段
          documents: [], // 后端暂无此字段
        }
      })

      setIssueRecords(processedRecords)
    } catch (error) {
      console.error("加载问题记录失败:", error)
    } finally {
      setLoadingIssues(false)
    }
  }

  // 加载旁站记录数据
  const loadSupervisionRecords = async () => {
    try {
      setLoadingSupervision(true)
      const records = await getSupervisionRecords(0, 50) // 加载前50条记录

      // 为旁站记录添加 type 字段和其他必要字段
      const processedRecords = records.map((record) => ({
        ...record,
        type: "supervision",
        icon: ClipboardList,
        title: record.project_name || "旁站记录",
        date: record.start_datetime
          ? new Date(record.start_datetime).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        time:
          record.start_datetime && record.end_datetime
            ? `${new Date(record.start_datetime).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })} - ${new Date(record.end_datetime).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`
            : undefined,
        location: record.pangzhan_unit || "未设置位置",
        conclusion: record.rectification_status || "待处理",
        hasDocument: !!record.document_urls,
      }))

      setSupervisionRecords(processedRecords)
    } catch (error) {
      console.error("加载旁站记录失败:", error)
    } finally {
      setLoadingSupervision(false)
    }
  }

  // 在组件内部合并所有事件时，确保 ID 唯一性
  const mockEvents = useMemo(() => {
    const events = [...issueRecords, ...mockDailyLogs, ...supervisionRecords, ...mockMeetingMinutes]
    // 使用 Map 来确保 ID 唯一性，并添加类型前缀
    const uniqueEvents = new Map()
    events.forEach(event => {
      const typePrefix = event.type || 'unknown'
      const baseId = event.id?.toString() || ''
      const uniqueId = `${typePrefix}-${baseId}`
      
      if (!uniqueEvents.has(uniqueId)) {
        uniqueEvents.set(uniqueId, {
          ...event,
          id: uniqueId // 使用带类型前缀的唯一 ID
        })
      } else {
        // 如果 ID 重复，添加时间戳和随机数后缀
        const timestamp = Date.now()
        const random = Math.floor(Math.random() * 1000)
        const fallbackId = `${uniqueId}-${timestamp}-${random}`
        uniqueEvents.set(fallbackId, {
          ...event,
          id: fallbackId
        })
      }
    })
    return Array.from(uniqueEvents.values())
  }, [issueRecords, supervisionRecords])

  // Reset selected events when type changes
  useEffect(() => {
    setSelectedEvents([])
  }, [selectedType])

  // Reset status filter when type changes to non-issue type
  useEffect(() => {
    if (selectedType !== "all" && selectedType !== "issue") {
      setSelectedStatus("all")
    }
  }, [selectedType])

  // 加载问题记录
  useEffect(() => {
    loadIssueRecords()
  }, [selectedStatus]) // 当状态筛选改变时重新加载

  // 加载旁站记录
  useEffect(() => {
    loadSupervisionRecords()
  }, [])

  // Filter events based on selected type and status
  const filteredEvents = mockEvents.filter((event) => {
    const typeMatch = selectedType === "all" || event.type === selectedType

    // Only apply status filter for issue type events
    if (event.type === "issue") {
      const statusMatch = selectedStatus === "all" || event.status === selectedStatus
      return typeMatch && statusMatch
    }

    return typeMatch
  })

  const handleCheckboxChange = (eventId: string) => {
    setSelectedEvents((prev) => (prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]))
  }

  const handleMergeEvents = () => {
    console.log("Merging events:", selectedEvents)
    setShowMergeDialog(false)
    setSelectedEvents([])
  }

  const handleGenerateInspectionRecord = () => {
    console.log("Generating inspection record for events:", selectedEvents)
    setShowInspectionDialog(false)
    // In a real app, this would generate the inspection record and redirect
    router.push("/dashboard/documents")
  }

  // Check if the current view allows selection (only for issues)
  const allowsSelection = selectedType === "all" || selectedType === "issue"

  // Get only issue events that are selected
  const selectedIssueEvents = selectedEvents.filter((id) =>
    mockEvents.find((event) => event.id === id && event.type === "issue"),
  )

  // Get border color based on event type
  const getBorderColor = (type: string) => {
    switch (type) {
      case "issue":
        return "border-l-red-500"
      case "supervision":
        return "border-l-blue-500"
      case "daily-log":
        return "border-l-green-500"
      case "meeting":
        return "border-l-amber-500"
      default:
        return "border-l-primary"
    }
  }

  // Get icon color based on event type
  const getIconColor = (type: string) => {
    switch (type) {
      case "issue":
        return "text-red-500"
      case "supervision":
        return "text-blue-500"
      case "daily-log":
        return "text-green-500"
      case "meeting":
        return "text-amber-500"
      default:
        return "text-primary"
    }
  }

  // Get badge color based on event type
  const getBadgeColor = (type: string) => {
    switch (type) {
      case "issue":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "supervision":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "daily-log":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "meeting":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200"
      default:
        return "bg-primary/10 text-primary hover:bg-primary/20"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="destructive">待处理</Badge>
      case "processing":
        return <Badge variant="secondary">处理中</Badge>
      case "resolved":
        return <Badge variant="outline">已闭环</Badge>
      case "completed":
        return <Badge variant="outline">已完成</Badge>
      case "draft":
        return <Badge variant="secondary">草稿</Badge>
      case "final":
        return <Badge variant="outline">最终版</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "issue":
        return "问题记录"
      case "supervision":
        return "旁站记录"
      case "daily-log":
        return "监理日志"
      case "meeting":
        return "会议纪要"
      default:
        return type
    }
  }

  // Check if an event can be edited
  const canEditEvent = (event: any) => {
    if (event.type === "issue") {
      return event.status !== "resolved" // 只有已闭环的问题不能编辑
    } else {
      return true // 所有其他类型的记录都可以编辑
    }
  }

  // Handle view details
  const handleViewDetails = (event: any) => {
    setSelectedRecord(event)

    // 根据事件类型打开不同的详情弹窗
    if (event.type === "daily-log") {
      setDailyLogDetailModalOpen(true)
    } else if (event.type === "supervision") {
      setSupervisionDetailModalOpen(true)
    } else if (event.type === "meeting") {
      setMeetingDetailModalOpen(true)
    } else {
      setProblemDetailModalOpen(true)
    }
  }

  // Handle edit
  const handleEdit = (recordId: string) => {
    const record = mockEvents.find((event) => event.id === recordId)
    if (record) {
      setSelectedRecord(record)

      // 根据记录类型打开不同的编辑弹窗
      if (record.type === "daily-log") {
        setDailyLogDetailModalOpen(false)
        setDailyLogEditModalOpen(true)
      } else if (record.type === "supervision") {
        setSupervisionDetailModalOpen(false)
        setSupervisionEditModalOpen(true)
      } else if (record.type === "meeting") {
        setMeetingDetailModalOpen(false)
        setMeetingEditModalOpen(true)
      } else {
        setProblemDetailModalOpen(false)
        setProblemEditModalOpen(true)
      }
    }
  }

  // Handle save edited record
  const handleSaveEdit = async (updatedRecord: any) => {
    console.log("Saving updated record:", updatedRecord)

    try {
      if (updatedRecord.type === "issue") {
        // 映射前端状态到后端状态
        let backendStatus = "待处理"
        switch (updatedRecord.status) {
          case "pending":
            backendStatus = "待处理"
            break
          case "processing":
            backendStatus = "处理中"
            break
          case "resolved":
            backendStatus = "已闭环"
            break
        }
        
        // 从复合 ID 中提取原始数字 ID
        let originalId: string | number = updatedRecord.id
        
        // 如果是复合 ID，提取原始 ID
        if (typeof updatedRecord.id === 'string' && updatedRecord.id.includes('-')) {
          const parts = updatedRecord.id.split('-')
          if (parts.length >= 2 && parts[0] === 'issue') {
            originalId = parts[1] // 提取第二部分作为原始 ID
          }
        }
        
        // 确保是数字
        const numericId = parseInt(originalId.toString(), 10)
        if (isNaN(numericId)) {
          throw new Error('无效的记录 ID')
        }
        
        // 处理时间格式 - 确保符合后端datetime期望
        let recordTime: string
        if (updatedRecord.record_time) {
          recordTime = updatedRecord.record_time
        } else if (updatedRecord.date) {
          // 将日期转换为完整的datetime格式
          recordTime = new Date(updatedRecord.date + 'T00:00:00.000Z').toISOString()
        } else {
          recordTime = new Date().toISOString()
        }
        
        // 转换数据格式 - 确保完全符合后端IssueCreateZh模型
        const updateData = {
          问题发生地点: updatedRecord.location || "",
          问题描述: updatedRecord.title || "",
          相关图片: updatedRecord.images ? updatedRecord.images.join(", ") : "",
          状态: backendStatus,
          记录时间: recordTime, // 使用正确的时间格式
        }

        console.log("提取的数字ID:", numericId)
        console.log("发送到后端的数据:", updateData)
        console.log("当前记录的原始数据:", updatedRecord)

        await updateIssueRecord(numericId, updateData)

        toast({
          title: "更新成功",
          description: "问题记录已成功更新",
        })

        // 重新加载问题记录
        await loadIssueRecords()
      }

      // 根据记录类型关闭相应的编辑弹窗
      if (updatedRecord.type === "daily-log") {
        setDailyLogEditModalOpen(false)
      } else if (updatedRecord.type === "supervision") {
        setSupervisionEditModalOpen(false)
      } else if (updatedRecord.type === "meeting") {
        setMeetingEditModalOpen(false)
      } else {
        setProblemEditModalOpen(false)
      }
    } catch (error: any) {
      console.error("保存记录失败:", error)
      toast({
        title: "更新失败",
        description: error.message || "更新问题记录时发生错误",
        variant: "destructive",
      })
    }
  }

  // Handle generate notification
  const handleGenerateNotification = (recordId: string) => {
    const record = mockEvents.find((event) => event.id === recordId)
    if (record) {
      setSelectedRecord(record)
      setProblemDetailModalOpen(false)
      setNotificationModalOpen(true)
    }
  }

  // Handle confirm notification generation
  const handleConfirmNotification = (recordId: string) => {
    console.log("Generating notification for record:", recordId)
    setNotificationModalOpen(false)
    // In a real app, this would generate the notification and redirect
    router.push("/dashboard/documents")
  }

  // Handle generate daily log
  const handleGenerateDailyLog = (recordId: string) => {
    const record = mockEvents.find((event) => event.id === recordId)
    if (record) {
      console.log("Generating daily log for record:", record)
      // 在实际应用中，这里会调用API生成日志并提供下载
      window.alert("监理日志已生成，正在下载...")
      // 模拟添加到已生成文档列表
      if (record.type === "daily-log") {
        const newDocument = {
          id: `doc-${Date.now()}`,
          title: `监理日志-${record.date}`,
          date: new Date().toISOString().split("T")[0],
          type: "pdf",
        }
        record.generatedDocuments = [...(record.generatedDocuments || []), newDocument]
      }
    }
  }

  // Handle generate supervision record
  const handleGenerateSupervisionRecord = (recordId: string) => {
    const record = mockEvents.find((event) => event.id === recordId)
    if (record) {
      console.log("Generating supervision record for record:", record)
      // 在实际应用中，这里会调用API生成旁站记录并提供下载
      window.alert("旁站记录已生成，正在下载...")
      // 模拟添加到已生成文档列表
      if (record.type === "supervision") {
        const newDocument = {
          id: `doc-s${Date.now()}`,
          title: `${record.title}记录-${record.date}`,
          date: new Date().toISOString().split("T")[0],
          type: "pdf",
        }
        record.generatedDocuments = [...(record.generatedDocuments || []), newDocument]
      }
    }
  }

  // Handle generate meeting minute
  const handleGenerateMeetingMinute = (recordId: string) => {
    console.log("生成会议纪要:", recordId)
    // Find the record
    const record = [...mockMeetingMinutes].find((r: any) => r.id === recordId)
    if (!record) return

    setSelectedRecord(record)
    setMeetingDetailModalOpen(false)
    setTimeout(() => {
      toast({
        title: "生成成功",
        description: "会议纪要已生成并下载到本地。",
        duration: 3000,
      })
    }, 1000)
  }

  const handleDeleteProblemRecord = async (recordId: string) => {
    try {
      // 从复合 ID 中提取原始数字 ID
      // recordId 格式通常是 "issue-1-1735509742-0" 或者直接是数字字符串
      let originalId: string | number = recordId
      
      // 如果是复合 ID，提取原始 ID
      if (typeof recordId === 'string' && recordId.includes('-')) {
        const parts = recordId.split('-')
        if (parts.length >= 2 && parts[0] === 'issue') {
          originalId = parts[1] // 提取第二部分作为原始 ID
        }
      }
      
      // 确保是数字
      const numericId = parseInt(originalId.toString(), 10)
      if (isNaN(numericId)) {
        throw new Error('无效的记录 ID')
      }
      
      await deleteIssueRecord(numericId)
      toast({
        title: "删除成功",
        description: "问题记录已成功删除",
      })
      // 关闭弹窗
      setProblemDetailModalOpen(false)
      // 重新加载问题记录
      await loadIssueRecords()
    } catch (error: any) {
      toast({
        title: "删除失败",
        description: error.message || "删除问题记录时发生错误",
        variant: "destructive",
      })
    }
  }

  // Close all modals when navigating away
  useEffect(() => {
    return () => {
      setProblemDetailModalOpen(false)
      setProblemEditModalOpen(false)
      setNotificationModalOpen(false)
      setDailyLogDetailModalOpen(false)
      setDailyLogEditModalOpen(false)
      setSupervisionDetailModalOpen(false)
      setSupervisionEditModalOpen(false)
      setMeetingDetailModalOpen(false)
      setMeetingEditModalOpen(false)
      setShowMergeDialog(false)
      setShowInspectionDialog(false)
    }
  }, [])

  return (
    <div>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">事件记录</h2>
          <Button onClick={() => setIssueCreateModalOpen(true)}>新建问题记录</Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="事件类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              <SelectItem value="issue">问题记录</SelectItem>
              <SelectItem value="supervision">旁站记录</SelectItem>
              <SelectItem value="daily-log">监理日志</SelectItem>
              <SelectItem value="meeting">会议纪要</SelectItem>
            </SelectContent>
          </Select>

          {/* Only show status filter for issues */}
          {(selectedType === "all" || selectedType === "issue") && (
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending">待处理</SelectItem>
                <SelectItem value="processing">处理中</SelectItem>
                <SelectItem value="resolved">已闭环</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* Multi-select action buttons */}
          {selectedIssueEvents.length > 0 && (
            <div className="flex gap-2 ml-auto">
              {/* Generate Inspection Record button */}
              <Dialog open={showInspectionDialog} onOpenChange={setShowInspectionDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <ClipboardCheck className="h-4 w-4" />
                    生成巡检记录 ({selectedIssueEvents.length})
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>生成巡检记录</DialogTitle>
                    <DialogDescription>
                      您正在基于 {selectedIssueEvents.length} 个问题记录生成巡检记录。生成的巡检记录将包含以下问题。
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="inspection-title">巡检记录标题</Label>
                      <Input
                        id="inspection-title"
                        placeholder="请输入巡检记录标题"
                        className="col-span-3"
                        defaultValue={`巡检记录-${new Date().toISOString().split("T")[0]}`}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>包含的问题</Label>
                      <div className="max-h-[200px] overflow-y-auto border rounded-md p-2">
                        {selectedIssueEvents.map((id, index) => {
                          const event = mockEvents.find((i) => i.id === id)
                          if (!event) return null
                          // 使用事件类型、ID 和索引组合作为 key
                          const uniqueKey = `selected-${event.type}-${id}-${index}`
                          return (
                            <div key={uniqueKey} className="py-2 border-b last:border-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{event.title}</span>
                                {event.status && (
                                  <Badge variant={event.status === "pending" ? "destructive" : event.status === "processing" ? "secondary" : "outline"}>
                                    {event.status === "pending" ? "待处理" : event.status === "processing" ? "处理中" : "已闭环"}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowInspectionDialog(false)}>
                      取消
                    </Button>
                    <Button onClick={handleGenerateInspectionRecord}>确认生成</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Merge button */}
              <Dialog open={showMergeDialog} onOpenChange={setShowMergeDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <MergeIcon className="h-4 w-4" />
                    合并 ({selectedIssueEvents.length})
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>合并问题记录</DialogTitle>
                    <DialogDescription>
                      您正在合并 {selectedIssueEvents.length} 个问题记录。请为合并后的问题提供一个新的描述。
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="merged-description">合并后的问题描述</Label>
                      <Input id="merged-description" placeholder="请输入合并后的问题描述" className="col-span-3" />
                    </div>
                    <div className="grid gap-2">
                      <Label>选中的问题</Label>
                      <div className="max-h-[200px] overflow-y-auto border rounded-md p-2">
                        {selectedIssueEvents.map((id, index) => {
                          const event = mockEvents.find((i) => i.id === id)
                          if (!event) return null
                          // 使用事件类型、ID 和索引组合作为 key
                          const uniqueKey = `merge-${event.type}-${id}-${index}`
                          return (
                            <div key={uniqueKey} className="py-2 border-b last:border-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{event.title}</span>
                                {event.status && (
                                  <Badge variant={event.status === "pending" ? "destructive" : event.status === "processing" ? "secondary" : "outline"}>
                                    {event.status === "pending" ? "待处理" : event.status === "processing" ? "处理中" : "已闭环"}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowMergeDialog(false)}>
                      取消
                    </Button>
                    <Button onClick={handleMergeEvents}>确认合并</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredEvents.map((event) => (
          <Card key={`event-${event.type}-${event.id}`} className={`overflow-hidden border-l-4 ${getBorderColor(event.type)}`}>
            {/* Only show checkbox for issue type events */}
            {event.type === "issue" && allowsSelection && (
              <div className="p-1">
                <Checkbox
                  id={`select-${event.id}`}
                  checked={selectedEvents.includes(event.id)}
                  onCheckedChange={() => handleCheckboxChange(event.id)}
                  className="ml-2 mt-2"
                />
              </div>
            )}
            <CardContent className={`p-4 ${event.type === "issue" && allowsSelection ? "pt-0" : ""}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex gap-2 items-center">
                  {/* Only show status badge for issue type */}
                  {event.type === "issue" && getStatusBadge(event.status)}

                  {/* Show type badge for all event types */}
                  <Badge variant="secondary" className={getBadgeColor(event.type)}>
                    {getEventTypeLabel(event.type)}
                  </Badge>
                </div>
                {event.icon && <event.icon className={`h-4 w-4 ${getIconColor(event.type)}`} />}
              </div>
              <h3 className="font-medium line-clamp-2 mb-2">{event.title}</h3>

              <div className="flex items-center text-xs text-muted-foreground gap-1 mb-1">
                <Calendar className="h-3 w-3" />
                <span>{event.date}</span>
              </div>

              {event.location && (
                <div className="flex items-center text-xs text-muted-foreground gap-1 mb-1">
                  <MapPin className="h-3 w-3" />
                  <span>{event.location}</span>
                </div>
              )}

              {event.time && (
                <div className="flex items-center text-xs text-muted-foreground gap-1 mb-1">
                  <Clock className="h-3 w-3" />
                  <span>{event.time}</span>
                </div>
              )}

              {event.attendees && (
                <div className="flex items-center text-xs text-muted-foreground gap-1 mb-1">
                  <Users className="h-3 w-3" />
                  <span>参会人数: {event.attendees}</span>
                </div>
              )}

              {event.weather && <div className="text-xs text-muted-foreground mb-1">天气: {event.weather}</div>}

              {event.responsibleUnit && (
                <div className="text-xs text-muted-foreground mt-2">责任单位: {event.responsibleUnit}</div>
              )}
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-end gap-2 flex-wrap">
              {/* Show Generate Notification button for issue type events */}
              {event.type === "issue" && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleGenerateNotification(event.id)}
                      >
                        <FileText className="h-3 w-3" />
                        生成通知单
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>基于此问题生成监理工程师通知单</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {/* Show generate daily log button for daily-log type events */}
              {event.type === "daily-log" && (
                <Button variant="outline" size="sm" className="gap-1" onClick={() => handleGenerateDailyLog(event.id)}>
                  <FileText className="h-3 w-3" />
                  生成监理日志
                </Button>
              )}

              {/* Show generate supervision record button for supervision type events */}
              {event.type === "supervision" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => handleGenerateSupervisionRecord(event.id)}
                >
                  <FileText className="h-3 w-3" />
                  生成旁站记录
                </Button>
              )}

              {/* Show generate meeting minute button for meeting type events */}
              {event.type === "meeting" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => handleGenerateMeetingMinute(event.id)}
                >
                  <FileText className="h-3 w-3" />
                  生成会议纪要
                </Button>
              )}

              {/* Show edit button for all events except resolved ones */}
              {canEditEvent(event) && (
                <Button variant="outline" size="sm" className="gap-1" onClick={() => handleEdit(event.id)}>
                  <Edit className="h-3 w-3" />
                  编辑
                </Button>
              )}

              <Button variant="outline" size="sm" onClick={() => handleViewDetails(event)}>
                查看详情
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Problem Record Detail Modal */}
      <ProblemRecordDetailModal
        isOpen={problemDetailModalOpen}
        onClose={() => setProblemDetailModalOpen(false)}
        record={selectedRecord}
        onGenerateNotification={handleGenerateNotification}
        onEdit={handleEdit}
        onDelete={handleDeleteProblemRecord}
      />

      {/* Problem Record Edit Modal */}
      <ProblemRecordEditModal
        isOpen={problemEditModalOpen}
        onClose={() => setProblemEditModalOpen(false)}
        record={selectedRecord}
        onSave={handleSaveEdit}
      />

      {/* Generate Notification Modal */}
      <GenerateNotificationModal
        isOpen={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
        record={selectedRecord}
        onGenerate={handleConfirmNotification}
      />

      {/* Daily Log Detail Modal */}
      <DailyLogDetailModal
        isOpen={dailyLogDetailModalOpen}
        onClose={() => setDailyLogDetailModalOpen(false)}
        record={selectedRecord}
        onEdit={handleEdit}
        onGenerateDailyLog={handleGenerateDailyLog}
      />

      {/* Daily Log Edit Modal */}
      <DailyLogEditModal
        isOpen={dailyLogEditModalOpen}
        onClose={() => setDailyLogEditModalOpen(false)}
        record={selectedRecord}
        onSave={handleSaveEdit}
      />

      {/* Supervision Record Detail Modal */}
      <SupervisionRecordDetailModal
        isOpen={supervisionDetailModalOpen}
        onClose={() => setSupervisionDetailModalOpen(false)}
        record={selectedRecord}
        onEdit={handleEdit}
        onGenerateRecord={handleGenerateSupervisionRecord}
      />

      {/* Supervision Record Edit Modal */}
      <SupervisionRecordEditModal
        isOpen={supervisionEditModalOpen}
        onClose={() => setSupervisionEditModalOpen(false)}
        record={selectedRecord}
        onSave={handleSaveEdit}
      />

      {/* Meeting Minute Detail Modal */}
      <MeetingMinuteDetailModal
        isOpen={meetingDetailModalOpen}
        onClose={() => setMeetingDetailModalOpen(false)}
        record={selectedRecord}
        onEdit={handleEdit}
        onGenerateMinute={handleGenerateMeetingMinute}
      />

      {/* Meeting Minute Edit Modal */}
      <MeetingMinuteEditModal
        isOpen={meetingEditModalOpen}
        onClose={() => setMeetingEditModalOpen(false)}
        record={selectedRecord}
        onSave={handleSaveEdit}
      />

      {/* Issue Record Create Modal */}
      <IssueRecordCreateModal
        isOpen={issueCreateModalOpen}
        onClose={() => setIssueCreateModalOpen(false)}
        onSuccess={loadIssueRecords}
      />
    </div>
  )
}
