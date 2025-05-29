"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, MapPin, Calendar, Clock, Users, ClipboardList } from "lucide-react"

interface SupervisionRecordDetailModalProps {
  isOpen: boolean
  onClose: () => void
  record: any
  onEdit: (recordId: string) => void
  onGenerateDocument: (recordId: string) => void
  onDelete?: (recordId: string) => void
}

export function SupervisionRecordDetailModal({
  isOpen,
  onClose,
  record,
  onEdit,
  onGenerateDocument,
  onDelete,
}: SupervisionRecordDetailModalProps) {
  if (!record) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>旁站记录详情</DialogTitle>
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-blue-500" />
            <DialogTitle>旁站记录详情</DialogTitle>
          </div>
          <DialogDescription>查看和管理旁站记录的详细信息</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 基本信息 */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>日期: {record.date}</span>
            </div>
            {record.time && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>时间: {record.time}</span>
              </div>
            )}
            {record.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>位置: {record.location}</span>
              </div>
            )}
            {record.status && (
              <div className="flex items-center gap-2">
                <span>状态:</span>
                <Badge variant="secondary">{record.status}</Badge>
              </div>
            )}
          </div>

          {/* 标题 */}
          <div>
            <h3 className="text-lg font-medium mb-2">{record.title}</h3>
          </div>

          {/* 原始数据详情 */}
          {record.originalData && (
            <div className="space-y-3">
              {record.originalData.project_name && (
                <div>
                  <h4 className="text-sm font-medium mb-1">项目名称:</h4>
                  <p className="text-sm text-muted-foreground">{record.originalData.project_name}</p>
                </div>
              )}

              {record.originalData.construction_unit && (
                <div>
                  <h4 className="text-sm font-medium mb-1">施工单位:</h4>
                  <p className="text-sm text-muted-foreground">{record.originalData.construction_unit}</p>
                </div>
              )}

              {record.originalData.supervision_company && (
                <div>
                  <h4 className="text-sm font-medium mb-1">监理公司:</h4>
                  <p className="text-sm text-muted-foreground">{record.originalData.supervision_company}</p>
                </div>
              )}

              {record.originalData.work_overview && (
                <div>
                  <h4 className="text-sm font-medium mb-1">工作概述:</h4>
                  <p className="text-sm text-muted-foreground">{record.originalData.work_overview}</p>
                </div>
              )}

              {record.originalData.pre_work_check_content && (
                <div>
                  <h4 className="text-sm font-medium mb-1">施工前检查内容:</h4>
                  <p className="text-sm text-muted-foreground">{record.originalData.pre_work_check_content}</p>
                </div>
              )}

              {record.originalData.supervising_personnel && (
                <div>
                  <h4 className="text-sm font-medium mb-1">监理人员:</h4>
                  <p className="text-sm text-muted-foreground">{record.originalData.supervising_personnel}</p>
                </div>
              )}

              {record.originalData.issues_and_opinions && (
                <div>
                  <h4 className="text-sm font-medium mb-1">发现问题及意见:</h4>
                  <p className="text-sm text-muted-foreground">{record.originalData.issues_and_opinions}</p>
                </div>
              )}

              {record.originalData.remarks && (
                <div>
                  <h4 className="text-sm font-medium mb-1">备注:</h4>
                  <p className="text-sm text-muted-foreground">{record.originalData.remarks}</p>
                </div>
              )}
            </div>
          )}

          {/* 相关文档 */}
          {record.hasDocument && (
            <div>
              <h4 className="text-sm font-medium mb-1">相关文档:</h4>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-3 w-3 text-muted-foreground" />
                <span>已有文档记录</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onEdit(record.id)}>
            编辑
          </Button>
          <Button className="gap-2" onClick={() => onGenerateDocument(record.id)}>
            <FileText className="h-4 w-4" />
            生成旁站记录
          </Button>
          {onDelete && (
            <Button variant="destructive" onClick={() => onDelete(record.id)}>
              删除
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 