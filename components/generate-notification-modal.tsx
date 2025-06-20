"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, Loader2 } from "lucide-react"

interface GenerateNotificationModalProps {
  isOpen: boolean
  onClose: () => void
  record: any
  onGenerate: (recordId: string) => void
  isGenerating?: boolean
}

export function GenerateNotificationModal({ isOpen, onClose, record, onGenerate, isGenerating = false }: GenerateNotificationModalProps) {
  if (!record) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>生成监理通知单</DialogTitle>
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            <DialogTitle>生成问题记录文档</DialogTitle>
          </div>
          <DialogDescription>
            确认要基于此问题记录生成Word文档吗？生成的文档将自动下载到您的设备。
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="border rounded-md p-3 bg-muted/30">
            <p className="font-medium mb-2">{record.title}</p>
            <p className="text-sm text-muted-foreground">位置: {record.location}</p>
            <p className="text-sm text-muted-foreground">日期: {record.date}</p>
            {record.responsibleUnit && (
              <p className="text-sm text-muted-foreground">责任单位: {record.responsibleUnit}</p>
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isGenerating}
          >
            取消
          </Button>
          <Button 
            onClick={() => onGenerate(record.id)}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                生成中...
              </>
            ) : (
              "确认生成"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
