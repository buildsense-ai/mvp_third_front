"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ClipboardList } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface SupervisionRecordEditModalProps {
  isOpen: boolean
  onClose: () => void
  record: any
  onSave: (record: any) => void
}

export function SupervisionRecordEditModal({ 
  isOpen, 
  onClose, 
  record, 
  onSave 
}: SupervisionRecordEditModalProps) {
  const [editedRecord, setEditedRecord] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize or update editedRecord when record changes
  useEffect(() => {
    if (record?.originalData) {
      setEditedRecord({
        ...record.originalData,
        // 确保日期时间格式正确
        start_datetime: record.originalData.start_datetime || new Date().toISOString(),
        end_datetime: record.originalData.end_datetime || new Date().toISOString(),
      })
    }
  }, [record])

  // If no record or editedRecord, don't render the form content
  if (!editedRecord) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>编辑旁站记录</DialogTitle>
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

  const handleChange = (field: string, value: any) => {
    setEditedRecord((prev: any) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      await onSave(editedRecord)
      onClose()
    } catch (error) {
      console.error("保存失败:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 格式化日期时间为本地格式
  const formatDateTimeLocal = (dateTimeString: string) => {
    if (!dateTimeString) return ""
    try {
      const date = new Date(dateTimeString)
      return date.toISOString().slice(0, 16) // YYYY-MM-DDTHH:mm
    } catch {
      return ""
    }
  }

  // 将本地日期时间格式转换为ISO格式
  const convertToISOString = (localDateTime: string) => {
    if (!localDateTime) return new Date().toISOString()
    try {
      return new Date(localDateTime).toISOString()
    } catch {
      return new Date().toISOString()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-blue-500" />
            <DialogTitle>编辑旁站记录</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 基本信息 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="project_name">项目名称</Label>
              <Input
                id="project_name"
                value={editedRecord.project_name || ""}
                onChange={(e) => handleChange("project_name", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="construction_unit">施工单位</Label>
              <Input
                id="construction_unit"
                value={editedRecord.construction_unit || ""}
                onChange={(e) => handleChange("construction_unit", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="pangzhan_unit">旁站单位</Label>
              <Input
                id="pangzhan_unit"
                value={editedRecord.pangzhan_unit || ""}
                onChange={(e) => handleChange("pangzhan_unit", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="supervision_company">监理公司</Label>
              <Input
                id="supervision_company"
                value={editedRecord.supervision_company || ""}
                onChange={(e) => handleChange("supervision_company", e.target.value)}
              />
            </div>
          </div>

          {/* 时间信息 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start_datetime">开始时间</Label>
              <Input
                id="start_datetime"
                type="datetime-local"
                value={formatDateTimeLocal(editedRecord.start_datetime)}
                onChange={(e) => handleChange("start_datetime", convertToISOString(e.target.value))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="end_datetime">结束时间</Label>
              <Input
                id="end_datetime"
                type="datetime-local"
                value={formatDateTimeLocal(editedRecord.end_datetime)}
                onChange={(e) => handleChange("end_datetime", convertToISOString(e.target.value))}
              />
            </div>
          </div>

          {/* 工作内容 */}
          <div className="grid gap-2">
            <Label htmlFor="work_overview">工作概述</Label>
            <Textarea
              id="work_overview"
              value={editedRecord.work_overview || ""}
              onChange={(e) => handleChange("work_overview", e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="pre_work_check_content">施工前检查内容</Label>
            <Textarea
              id="pre_work_check_content"
              value={editedRecord.pre_work_check_content || ""}
              onChange={(e) => handleChange("pre_work_check_content", e.target.value)}
              rows={3}
            />
          </div>

          {/* 人员信息 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="supervising_personnel">监理人员</Label>
              <Input
                id="supervising_personnel"
                value={editedRecord.supervising_personnel || ""}
                onChange={(e) => handleChange("supervising_personnel", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="on_site_supervising_personnel">现场监理人员</Label>
              <Input
                id="on_site_supervising_personnel"
                value={editedRecord.on_site_supervising_personnel || ""}
                onChange={(e) => handleChange("on_site_supervising_personnel", e.target.value)}
              />
            </div>
          </div>

          {/* 企业信息 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="construction_enterprise">施工企业</Label>
              <Input
                id="construction_enterprise"
                value={editedRecord.construction_enterprise || ""}
                onChange={(e) => handleChange("construction_enterprise", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="supervising_enterprise">监理企业</Label>
              <Input
                id="supervising_enterprise"
                value={editedRecord.supervising_enterprise || ""}
                onChange={(e) => handleChange("supervising_enterprise", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="supervising_organization">监理组织</Label>
            <Input
              id="supervising_organization"
              value={editedRecord.supervising_organization || ""}
              onChange={(e) => handleChange("supervising_organization", e.target.value)}
            />
          </div>

          {/* 问题和意见 */}
          <div className="grid gap-2">
            <Label htmlFor="issues_and_opinions">发现问题及意见</Label>
            <Textarea
              id="issues_and_opinions"
              value={editedRecord.issues_and_opinions || ""}
              onChange={(e) => handleChange("issues_and_opinions", e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="rectification_status">整改状态</Label>
            <Input
              id="rectification_status"
              value={editedRecord.rectification_status || ""}
              onChange={(e) => handleChange("rectification_status", e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="remarks">备注</Label>
            <Textarea
              id="remarks"
              value={editedRecord.remarks || ""}
              onChange={(e) => handleChange("remarks", e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="document_urls">文档链接</Label>
            <Textarea
              id="document_urls"
              value={editedRecord.document_urls || ""}
              onChange={(e) => handleChange("document_urls", e.target.value)}
              rows={2}
              placeholder="多个链接用逗号分隔"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            取消
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "保存中..." : "确认保存"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 