"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertCircle,
  Calendar,
  Edit,
  FileText,
  MapPin,
  Clock,
  Users,
  ClipboardList,
  FileCheck,
} from "lucide-react"
import { ProblemRecordDetailModal } from "@/components/problem-record-detail-modal"
import { ProblemRecordEditModal } from "@/components/problem-record-edit-modal"
import { GenerateNotificationModal } from "@/components/generate-notification-modal"
import { SupervisionRecordDetailModal } from "@/components/supervision-record-detail-modal"
import { SupervisionRecordEditModal } from "@/components/supervision-record-edit-modal"
import { DailyLogDetailModal } from "@/components/daily-log-detail-modal"
import { MeetingMinutesDetailModal } from "@/components/meeting-minutes-detail-modal"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  getSupervisionRecords,
  getIssueRecords,
  updateIssueRecord,
  deleteIssueRecord,
  createOrUpdateIssueRecord,
  updateSupervisionRecord,
} from "@/lib/api-service"
import { toast } from "@/components/ui/use-toast"
import { generateSupervisionRecordDocx } from "@/utils/docx-generator"

// 统一的事件接口
interface EventRecord {
  id: string
  type: 'issue' | 'supervision' | 'daily-log' | 'meeting'
  title: string
  date: string
  status?: string
  location?: string
  weather?: string
  time?: string
  attendees?: number
  icon?: any
  responsibleUnit?: string
  hasImage?: boolean
  hasDocument?: boolean
  generatedDocuments?: Array<{
    id: string
    title: string
    date: string
    type: string
  }>
  
  // 原始数据保留用于编辑
  originalData?: any
}

// 监理日志数据
const mockDailyLogs: EventRecord[] = [
  {
    id: "log-1",
    type: "daily-log",
    title: "监理日志 - 2025-05-10",
    date: "2025-05-10",
    weather: "晴",
    icon: Calendar,
    generatedDocuments: [{ id: "doc-1", title: "监理日志-2025-05-10", date: "2025-05-10", type: "pdf" }],
  },
  {
    id: "log-2", 
    type: "daily-log",
    title: "监理日志 - 2025-05-11",
    date: "2025-05-11",
    weather: "多云",
    icon: Calendar,
    generatedDocuments: [],
  },
]

// 会议纪要数据
const mockMeetingMinutes: EventRecord[] = [
  {
    id: "meeting-1",
    type: "meeting",
    title: "项目例会",
    date: "2025-05-10",
    attendees: 12,
    icon: FileCheck,
    generatedDocuments: [{ id: "doc-m1", title: "项目例会纪要-2025-05-10", date: "2025-05-10", type: "pdf" }],
  },
]

export default function EventsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<string>("issue")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [showMergeDialog, setShowMergeDialog] = useState(false)
  const [showInspectionDialog, setShowInspectionDialog] = useState(false)

  // 各种记录状态
  const [issueRecords, setIssueRecords] = useState<EventRecord[]>([])
  const [supervisionRecords, setSupervisionRecords] = useState<EventRecord[]>([])
  const [loadingIssues, setLoadingIssues] = useState(true)
  const [loadingSupervision, setLoadingSupervision] = useState(true)

  // Modal状态
  const [problemDetailModalOpen, setProblemDetailModalOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [problemEditModalOpen, setProblemEditModalOpen] = useState(false)
  const [notificationModalOpen, setNotificationModalOpen] = useState(false)
  
  // 新增模态框状态
  const [supervisionDetailModalOpen, setSupervisionDetailModalOpen] = useState(false)
  const [supervisionEditModalOpen, setSupervisionEditModalOpen] = useState(false)
  const [dailyLogDetailModalOpen, setDailyLogDetailModalOpen] = useState(false)
  const [meetingMinutesDetailModalOpen, setMeetingMinutesDetailModalOpen] = useState(false)

  // 加载问题记录数据
  const loadIssueRecords = async () => {
    try {
      setLoadingIssues(true)
      let statusFilter: string | undefined
      
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

      const processedRecords: EventRecord[] = records.map((record, index) => {
        const uniqueId = `issue-${record.id}-${record.record_time || Date.now()}-${index}`
        
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
          id: uniqueId,
          type: "issue",
          title: record.description,
          date: record.record_time
            ? new Date(record.record_time).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          status: frontendStatus,
          location: record.location,
          icon: AlertCircle,
          hasImage: record.images && record.images.length > 0,
          responsibleUnit: "施工单位",
          originalData: record,
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
      const records = await getSupervisionRecords(0, 50)

      const processedRecords: EventRecord[] = records.map((record) => ({
        id: `supervision-${record.id}`,
        type: "supervision",
        title: record.project_name || "旁站记录",
        date: record.start_datetime
          ? new Date(record.start_datetime).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        time: record.start_datetime && record.end_datetime
          ? `${new Date(record.start_datetime).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })} - ${new Date(record.end_datetime).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`
          : undefined,
        location: record.pangzhan_unit || "未设置位置",
        status: record.rectification_status || "待处理",
        icon: ClipboardList,
        hasDocument: !!record.document_urls,
        originalData: record,
      }))

      setSupervisionRecords(processedRecords)
    } catch (error) {
      console.error("加载旁站记录失败:", error)
    } finally {
      setLoadingSupervision(false)
    }
  }

  // 合并所有事件
  const allEvents = useMemo(() => {
    return [...issueRecords, ...supervisionRecords, ...mockDailyLogs, ...mockMeetingMinutes]
  }, [issueRecords, supervisionRecords])

  // 筛选问题记录
  const filteredIssueRecords = useMemo(() => {
    if (selectedStatus === "all") {
      return issueRecords
    }
    return issueRecords.filter(record => record.status === selectedStatus)
  }, [issueRecords, selectedStatus])

  // useEffect hooks
  useEffect(() => {
    setSelectedEvents([])
  }, [activeTab])

  useEffect(() => {
    if (activeTab !== "issue") {
      setSelectedStatus("all")
    }
  }, [activeTab])

  // 清理非问题记录的选中项
  useEffect(() => {
    setSelectedEvents(prev => prev.filter(id => {
      const event = allEvents.find(e => e.id === id)
      return event?.type === "issue"
    }))
  }, [allEvents])

  useEffect(() => {
    loadIssueRecords()
  }, [selectedStatus])

  useEffect(() => {
    loadSupervisionRecords()
  }, [])

  // 事件处理函数
  const handleCheckboxChange = (eventId: string) => {
    // 确保只有问题记录可以被选中
    const event = allEvents.find(e => e.id === eventId)
    if (event?.type !== "issue") return
    
    setSelectedEvents((prev) => 
      prev.includes(eventId) 
        ? prev.filter((id) => id !== eventId) 
        : [...prev, eventId]
    )
  }

  const handleViewDetails = (event: EventRecord) => {
    setSelectedRecord(event)
    switch (event.type) {
      case "issue":
        setProblemDetailModalOpen(true)
        break
      case "supervision":
        setSupervisionDetailModalOpen(true)
        break
      case "daily-log":
        setDailyLogDetailModalOpen(true)
        break
      case "meeting":
        setMeetingMinutesDetailModalOpen(true)
        break
    }
  }

  const handleEdit = (recordId: string) => {
    const record = allEvents.find((event) => event.id === recordId)
    if (record) {
      setSelectedRecord(record)
      if (record.type === "issue") {
        setProblemEditModalOpen(true)
      } else if (record.type === "supervision") {
        setSupervisionEditModalOpen(true)
      }
    }
  }

  const handleSaveEdit = async (updatedRecord: any) => {
    try {
      if (updatedRecord.type === "issue") {
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

        // 从记录ID中提取原始的数据库ID
        const originalId = updatedRecord.id.split('-')[1]
        
        // 构建符合API要求的数据格式
        const updateData = {
          问题发生地点: updatedRecord.location || updatedRecord.originalData?.location || "",
          问题描述: updatedRecord.title || updatedRecord.description || updatedRecord.originalData?.description || "",
          状态: backendStatus,
          记录时间: updatedRecord.originalData?.record_time || new Date().toISOString(),
          相关图片: updatedRecord.originalData?.images?.join(',') || ""
        }

        console.log("提交的更新数据:", JSON.stringify(updateData, null, 2))
        console.log("更新的问题ID:", originalId)

        // 使用专门的更新接口
        await updateIssueRecord(originalId, updateData)
        
        toast({
          title: "更新成功",
          description: "问题记录已成功更新",
        })
        
        await loadIssueRecords()
        setProblemEditModalOpen(false)
      }
    } catch (error) {
      console.error("更新记录失败:", error)
      // 显示更详细的错误信息
      const errorMessage = error instanceof Error ? error.message : "更新记录时发生未知错误"
      toast({
        title: "更新失败",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  // 旁站记录编辑保存函数
  const handleSupervisionSaveEdit = async (updatedRecord: any) => {
    try {
      // 从记录ID中提取原始的数据库ID
      const originalId = selectedRecord?.id.split('-')[1]
      
      console.log("提交的旁站记录更新数据:", JSON.stringify(updatedRecord, null, 2))
      console.log("更新的旁站记录ID:", originalId)

      // 使用旁站记录更新接口
      await updateSupervisionRecord(originalId, updatedRecord)
      
      toast({
        title: "更新成功",
        description: "旁站记录已成功更新",
      })
      
      await loadSupervisionRecords()
      setSupervisionEditModalOpen(false)
    } catch (error) {
      console.error("更新旁站记录失败:", error)
      // 显示更详细的错误信息
      const errorMessage = error instanceof Error ? error.message : "更新旁站记录时发生未知错误"
      toast({
        title: "更新失败",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const handleGenerateNotification = (recordId: string) => {
    const record = allEvents.find((event) => event.id === recordId)
    if (record) {
      setSelectedRecord(record)
      setNotificationModalOpen(true)
    }
  }

  const handleConfirmNotification = (recordId: string) => {
    console.log("生成通知单:", recordId)
    setNotificationModalOpen(false)
  }

  const handleDeleteProblemRecord = async (recordId: string) => {
    try {
      const originalId = recordId.split('-')[1]
      await deleteIssueRecord(originalId)
      
      toast({
        title: "删除成功",
        description: "问题记录已成功删除",
      })
      
      await loadIssueRecords()
      setProblemDetailModalOpen(false)
    } catch (error) {
      console.error("删除记录失败:", error)
      toast({
        title: "删除失败",
        description: "删除记录时发生错误，请重试",
        variant: "destructive",
      })
    }
  }

  const handleGenerateDocument = async (recordId: string, type: string) => {
    const record = allEvents.find((event) => event.id === recordId)
    if (record) {
      switch (type) {
        case "supervision":
          try {
            console.log("生成旁站记录文档:", recordId)
            const fileName = await generateSupervisionRecordDocx(record.originalData)
            toast({
              title: "生成成功",
              description: `旁站记录文档 "${fileName}" 已生成并下载`,
            })
          } catch (error) {
            console.error("生成旁站记录文档失败:", error)
            toast({
              title: "生成失败",
              description: "生成旁站记录文档时发生错误",
              variant: "destructive",
            })
          }
          break
        case "daily-log":
          console.log("生成监理日志文档:", recordId)
          toast({
            title: "生成成功", 
            description: "监理日志文档正在生成",
          })
          break
        case "meeting":
          console.log("生成会议纪要文档:", recordId)
          toast({
            title: "生成成功",
            description: "会议纪要文档正在生成",
          })
          break
      }
    }
  }

  // UI辅助函数
  const getBorderColor = (type: string) => {
    switch (type) {
      case "issue":
        return "border-red-200"
      case "supervision":
        return "border-blue-200"
      case "daily-log":
        return "border-green-200"
      case "meeting":
        return "border-amber-200"
      default:
        return "border-gray-200"
    }
  }

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
        return "text-gray-500"
    }
  }

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "issue":
        return "bg-red-100 text-red-800"
      case "supervision":
        return "bg-blue-100 text-blue-800"
      case "daily-log":
        return "bg-green-100 text-green-800"
      case "meeting":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="destructive">待处理</Badge>
      case "processing":
        return <Badge variant="secondary">处理中</Badge>
      case "resolved":
        return <Badge variant="default">已闭环</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
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
        return "未知类型"
    }
  }

  const canEditEvent = (event: EventRecord) => {
    return event.status !== "resolved"
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="issue">问题记录 ({issueRecords.length})</TabsTrigger>
            <TabsTrigger value="supervision">旁站记录 ({supervisionRecords.length})</TabsTrigger>
            <TabsTrigger value="daily-log">监理日志 ({mockDailyLogs.length})</TabsTrigger>
            <TabsTrigger value="meeting">会议纪要 ({mockMeetingMinutes.length})</TabsTrigger>
            <TabsTrigger value="documents">已生成文档</TabsTrigger>
          </TabsList>

          {/* 问题记录 Tab */}
          <TabsContent value="issue" className="space-y-4">
            {/* 状态筛选 */}
            <div className="flex gap-4">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="pending">待处理</SelectItem>
                  <SelectItem value="processing">处理中</SelectItem>
                  <SelectItem value="resolved">已闭环</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 批量操作 */}
            {selectedEvents.length > 0 && (
              <div className="flex gap-2 p-4 bg-muted rounded-lg">
                <span className="text-sm text-muted-foreground">已选择 {selectedEvents.length} 个问题记录</span>
                <Button variant="outline" size="sm" onClick={() => setShowMergeDialog(true)}>
                  合并事件
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowInspectionDialog(true)}>
                  生成巡检记录
                </Button>
              </div>
            )}

            {/* 问题记录卡片 */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredIssueRecords.map((event) => (
                <Card key={event.id} className={`relative ${getBorderColor(event.type)}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedEvents.includes(event.id)}
                          onCheckedChange={() => handleCheckboxChange(event.id)}
                        />
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

                    {event.responsibleUnit && (
                      <div className="text-xs text-muted-foreground mt-2">责任单位: {event.responsibleUnit}</div>
                    )}
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {event.status && getStatusBadge(event.status)}
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0 flex justify-end gap-2 flex-wrap">
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
          </TabsContent>

          {/* 旁站记录 Tab */}
          <TabsContent value="supervision" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {supervisionRecords.map((event) => (
                <Card key={event.id} className={`relative ${getBorderColor(event.type)}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
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
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {event.status && getStatusBadge(event.status)}
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0 flex justify-end gap-2 flex-wrap">
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => handleGenerateDocument(event.id, "supervision")}>
                      <FileText className="h-3 w-3" />
                      生成旁站记录
                    </Button>

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
          </TabsContent>

          {/* 监理日志 Tab */}
          <TabsContent value="daily-log" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockDailyLogs.map((event) => (
                <Card key={event.id} className={`relative ${getBorderColor(event.type)}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
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

                    {event.weather && (
                      <div className="text-xs text-muted-foreground mb-1">天气: {event.weather}</div>
                    )}
                  </CardHeader>
                  
                  <CardFooter className="p-4 pt-0 flex justify-end gap-2 flex-wrap">
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => handleGenerateDocument(event.id, "daily-log")}>
                      <FileText className="h-3 w-3" />
                      生成监理日志
                    </Button>

                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(event)}>
                      查看详情
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 会议纪要 Tab */}
          <TabsContent value="meeting" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockMeetingMinutes.map((event) => (
                <Card key={event.id} className={`relative ${getBorderColor(event.type)}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
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

                    {event.attendees && (
                      <div className="flex items-center text-xs text-muted-foreground gap-1 mb-1">
                        <Users className="h-3 w-3" />
                        <span>参会人数: {event.attendees}</span>
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardFooter className="p-4 pt-0 flex justify-end gap-2 flex-wrap">
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => handleGenerateDocument(event.id, "meeting")}>
                      <FileText className="h-3 w-3" />
                      生成会议纪要
                    </Button>

                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(event)}>
                      查看详情
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 已生成文档 Tab */}
          <TabsContent value="documents" className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>已生成文档功能开发中...</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <ProblemRecordDetailModal
          isOpen={problemDetailModalOpen}
          onClose={() => setProblemDetailModalOpen(false)}
          record={selectedRecord}
          onGenerateNotification={handleGenerateNotification}
          onEdit={handleEdit}
          onDelete={handleDeleteProblemRecord}
        />

        <ProblemRecordEditModal
          isOpen={problemEditModalOpen}
          onClose={() => setProblemEditModalOpen(false)}
          record={selectedRecord}
          onSave={handleSaveEdit}
        />

        <GenerateNotificationModal
          isOpen={notificationModalOpen}
          onClose={() => setNotificationModalOpen(false)}
          record={selectedRecord}
          onGenerate={handleConfirmNotification}
        />

        {/* 旁站记录详情模态框 */}
        <SupervisionRecordDetailModal
          isOpen={supervisionDetailModalOpen}
          onClose={() => setSupervisionDetailModalOpen(false)}
          record={selectedRecord}
          onEdit={handleEdit}
          onGenerateDocument={(recordId) => handleGenerateDocument(recordId, "supervision")}
        />

        {/* 旁站记录编辑模态框 */}
        <SupervisionRecordEditModal
          isOpen={supervisionEditModalOpen}
          onClose={() => setSupervisionEditModalOpen(false)}
          record={selectedRecord}
          onSave={handleSupervisionSaveEdit}
        />

        {/* 监理日志详情模态框 */}
        <DailyLogDetailModal
          isOpen={dailyLogDetailModalOpen}
          onClose={() => setDailyLogDetailModalOpen(false)}
          record={selectedRecord}
          onEdit={handleEdit}
          onGenerateDocument={(recordId) => handleGenerateDocument(recordId, "daily-log")}
        />

        {/* 会议纪要详情模态框 */}
        <MeetingMinutesDetailModal
          isOpen={meetingMinutesDetailModalOpen}
          onClose={() => setMeetingMinutesDetailModalOpen(false)}
          record={selectedRecord}
          onEdit={handleEdit}
          onGenerateDocument={(recordId) => handleGenerateDocument(recordId, "meeting")}
        />

        {/* 合并事件对话框 */}
        <Dialog open={showMergeDialog} onOpenChange={setShowMergeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>合并事件</DialogTitle>
              <DialogDescription>将选中的事件合并为一个综合记录</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowMergeDialog(false)}>
                取消
              </Button>
              <Button onClick={() => setShowMergeDialog(false)}>确认合并</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 生成巡检记录对话框 */}
        <Dialog open={showInspectionDialog} onOpenChange={setShowInspectionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>生成巡检记录</DialogTitle>
              <DialogDescription>基于选中的事件生成巡检记录</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowInspectionDialog(false)}>
                取消
              </Button>
              <Button onClick={() => setShowInspectionDialog(false)}>生成记录</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 