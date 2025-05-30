"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "lucide-react"
import { SupervisionLog, SupervisionLogUpdateRequest } from "@/lib/api-service"

interface DailyLogEditModalProps {
  isOpen: boolean
  onClose: () => void
  record: any
  onSave: (record: SupervisionLogUpdateRequest) => Promise<void>
}

export function DailyLogEditModal({
  isOpen,
  onClose,
  record,
  onSave,
}: DailyLogEditModalProps) {
  const [editedRecord, setEditedRecord] = useState<Partial<SupervisionLog>>({})
  const [isLoading, setIsLoading] = useState(false)

  // Initialize or update editedRecord when record changes
  useEffect(() => {
    if (record) {
      // 如果是来自API的监理日志记录
      if (record.originalData) {
        setEditedRecord(record.originalData)
      } 
      // 如果是模拟数据结构，转换为API格式
      else {
        setEditedRecord({
          id: record.id?.replace("log-", ""), // 移除前缀
          project_id: record.basicInfo?.projectName || "默认项目",
          supervisor_name: record.supervisionPersonnel?.map((p: any) => p.label).join(", ") || "监理员",
          date: record.date || new Date().toISOString().split('T')[0],
          weather: record.weather || record.basicInfo?.weather,
          temperature: record.basicInfo?.temperature,
          construction_activities: record.constructionActivities?.map((a: any) => 
            `${a.location}: ${a.content}${a.details ? ` - ${a.details}` : ''}`
          ).join("\n") || "",
          supervision_activities: record.supervisionActivities?.map((a: any) => 
            `${a.type}: ${a.relatedActivity}${a.details ? ` - ${a.details}` : ''}`
          ).join("\n") || "",
          quality_issues: record.problems?.quality?.map((p: any) => 
            `${p.description} [处理措施: ${p.measures}]`
          ).join("\n") || "",
          safety_issues: record.problems?.safety?.map((p: any) => 
            `${p.description} [处理措施: ${p.measures}]`
          ).join("\n") || "",
          progress_issues: record.problems?.progress?.map((p: any) => 
            `${p.description} [处理措施: ${p.measures}]`
          ).join("\n") || "",
          cost_issues: record.problems?.cost?.map((p: any) => 
            `${p.description} [处理措施: ${p.measures}]`
          ).join("\n") || "",
          other_matters: record.otherMatters?.map((m: any) => 
            `${m.title}: ${m.content}`
          ).join("\n") || "",
          status: "draft",
          morning_management: 0,
          morning_skilled_workers: 0,
          morning_laborers: 0,
          afternoon_management: 0,
          afternoon_skilled_workers: 0,
          afternoon_laborers: 0,
        })
      }
    }
  }, [record])

  if (!editedRecord || !record) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>编辑监理日志</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-muted-foreground">加载中...</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  const handleChange = (field: keyof SupervisionLog, value: any) => {
    setEditedRecord((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      await onSave(editedRecord as SupervisionLogUpdateRequest)
      onClose()
    } catch (error) {
      console.error("保存失败:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-500" />
            <DialogTitle>编辑监理日志</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 基本信息 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="project_id">项目ID/名称</Label>
              <Input
                id="project_id"
                value={editedRecord.project_id || ""}
                onChange={(e) => handleChange("project_id", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="supervisor_name">监理人员</Label>
              <Input
                id="supervisor_name"
                value={editedRecord.supervisor_name || ""}
                onChange={(e) => handleChange("supervisor_name", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">日期</Label>
              <Input
                id="date"
                type="date"
                value={editedRecord.date || ""}
                onChange={(e) => handleChange("date", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="weather">天气</Label>
              <Input
                id="weather"
                value={editedRecord.weather || ""}
                onChange={(e) => handleChange("weather", e.target.value)}
                placeholder="例：晴、多云、雨"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="temperature">温度</Label>
              <Input
                id="temperature"
                value={editedRecord.temperature || ""}
                onChange={(e) => handleChange("temperature", e.target.value)}
                placeholder="例：20-28℃"
              />
            </div>
          </div>

          {/* 状态 */}
          <div className="grid gap-2">
            <Label htmlFor="status">状态</Label>
            <Select 
              value={editedRecord.status || "draft"} 
              onValueChange={(value) => handleChange("status", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">草稿</SelectItem>
                <SelectItem value="submitted">已提交</SelectItem>
                <SelectItem value="approved">已批准</SelectItem>
                <SelectItem value="rejected">已驳回</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 人员统计 */}
          <div className="space-y-3">
            <Label className="text-base font-medium">人员统计</Label>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">上午</Label>
                <div className="space-y-2">
                  <div className="grid gap-2">
                    <Label htmlFor="morning_management" className="text-xs">管理人员</Label>
                    <Input
                      id="morning_management"
                      type="number"
                      min="0"
                      value={editedRecord.morning_management || 0}
                      onChange={(e) => handleChange("morning_management", parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="morning_skilled_workers" className="text-xs">技术工人</Label>
                    <Input
                      id="morning_skilled_workers"
                      type="number"
                      min="0"
                      value={editedRecord.morning_skilled_workers || 0}
                      onChange={(e) => handleChange("morning_skilled_workers", parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="morning_laborers" className="text-xs">普通工人</Label>
                    <Input
                      id="morning_laborers"
                      type="number"
                      min="0"
                      value={editedRecord.morning_laborers || 0}
                      onChange={(e) => handleChange("morning_laborers", parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">下午</Label>
                <div className="space-y-2">
                  <div className="grid gap-2">
                    <Label htmlFor="afternoon_management" className="text-xs">管理人员</Label>
                    <Input
                      id="afternoon_management"
                      type="number"
                      min="0"
                      value={editedRecord.afternoon_management || 0}
                      onChange={(e) => handleChange("afternoon_management", parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="afternoon_skilled_workers" className="text-xs">技术工人</Label>
                    <Input
                      id="afternoon_skilled_workers"
                      type="number"
                      min="0"
                      value={editedRecord.afternoon_skilled_workers || 0}
                      onChange={(e) => handleChange("afternoon_skilled_workers", parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="afternoon_laborers" className="text-xs">普通工人</Label>
                    <Input
                      id="afternoon_laborers"
                      type="number"
                      min="0"
                      value={editedRecord.afternoon_laborers || 0}
                      onChange={(e) => handleChange("afternoon_laborers", parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 活动记录 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="construction_activities">施工活动</Label>
              <Textarea
                id="construction_activities"
                value={editedRecord.construction_activities || ""}
                onChange={(e) => handleChange("construction_activities", e.target.value)}
                rows={4}
                placeholder="描述今日的施工活动..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="supervision_activities">监理活动</Label>
              <Textarea
                id="supervision_activities"
                value={editedRecord.supervision_activities || ""}
                onChange={(e) => handleChange("supervision_activities", e.target.value)}
                rows={4}
                placeholder="描述今日的监理活动..."
              />
            </div>
          </div>

          {/* 问题记录 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="quality_issues">质量问题</Label>
              <Textarea
                id="quality_issues"
                value={editedRecord.quality_issues || ""}
                onChange={(e) => handleChange("quality_issues", e.target.value)}
                rows={3}
                placeholder="记录发现的质量问题..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="safety_issues">安全问题</Label>
              <Textarea
                id="safety_issues"
                value={editedRecord.safety_issues || ""}
                onChange={(e) => handleChange("safety_issues", e.target.value)}
                rows={3}
                placeholder="记录发现的安全问题..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="progress_issues">进度问题</Label>
              <Textarea
                id="progress_issues"
                value={editedRecord.progress_issues || ""}
                onChange={(e) => handleChange("progress_issues", e.target.value)}
                rows={3}
                placeholder="记录进度相关问题..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cost_issues">成本问题</Label>
              <Textarea
                id="cost_issues"
                value={editedRecord.cost_issues || ""}
                onChange={(e) => handleChange("cost_issues", e.target.value)}
                rows={3}
                placeholder="记录成本相关问题..."
              />
            </div>
          </div>

          {/* 其他事项 */}
          <div className="grid gap-2">
            <Label htmlFor="other_matters">其他事项</Label>
            <Textarea
              id="other_matters"
              value={editedRecord.other_matters || ""}
              onChange={(e) => handleChange("other_matters", e.target.value)}
              rows={3}
              placeholder="记录其他重要事项、来往文件、电话记录等..."
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "保存中..." : "保存"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 