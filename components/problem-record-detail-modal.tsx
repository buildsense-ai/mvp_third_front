"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Calendar, MapPin, User, FileText, LinkIcon } from "lucide-react"
import Image from "next/image"
import { toast } from "@/components/ui/use-toast"
import { deleteIssueRecord } from "@/lib/api-service"

interface ProblemRecordDetailModalProps {
  isOpen: boolean
  onClose: () => void
  record: any
  onGenerateNotification: (recordId: string) => void
  onEdit: (recordId: string) => void
  onDelete: (recordId: string) => void
}

export function ProblemRecordDetailModal({
  isOpen,
  onClose,
  record,
  onGenerateNotification,
  onEdit,
  onDelete,
}: ProblemRecordDetailModalProps) {
  if (!record) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>问题记录详情</DialogTitle>
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

  // 处理图片 URL
  const processImages = (images: string | string[] | undefined): Array<{url: string, id: string}> => {
    if (!images) return []

    // 处理字符串类型的图片
    if (typeof images === 'string') {
      // 如果是空字符串或只包含空白字符
      if (!images.trim()) return []
      
      // 尝试解析为数组格式
      if (images.includes(',')) {
        images = images.split(',').map(s => s.trim()).filter(Boolean)
      } else {
        images = [images.trim()]
      }
    }

    // 兼容 ["url1,url2"] 这种情况
    if (Array.isArray(images) && images.length === 1 && typeof images[0] === "string" && images[0].includes(",")) {
      images = images[0].split(",").map(s => s.trim()).filter(Boolean)
    }

    // 只做简单处理，不做 decodeURIComponent
    if (Array.isArray(images)) {
      return images
        .map((url, index) => {
          if (!url || typeof url !== 'string') return null
          
          // 去除首尾引号和空白字符
          const cleanUrl = url.replace(/^\["']?|["']?$/g, '').trim()
          
          // 检查是否是有效的URL
          if (!cleanUrl || cleanUrl.length < 10 || !cleanUrl.startsWith('http')) {
            return null
          }
          
          // 生成唯一 id - 避免使用btoa以防止字符编码错误
          const urlHash = cleanUrl.length.toString() + '-' + cleanUrl.slice(-8).replace(/[^a-zA-Z0-9]/g, '') + '-' + index
          return {
            url: cleanUrl,
            id: `img-${urlHash}`
          }
        })
        .filter(Boolean) as Array<{url: string, id: string}>
    }

    return []
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="destructive">待处理</Badge>
      case "resolved":
        return <Badge variant="outline">已闭环</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  // 获取处理后的图片数组
  const imageItems = processImages(record?.originalData?.images || record?.images)
  
  // 添加调试信息
  console.log('原始图片数据:', record?.originalData?.images || record?.images)
  console.log('完整record数据:', record)
  console.log('处理后的图片数组:', imageItems)

  // 处理图片加载错误
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // 使用内联 SVG 作为占位图片
    const placeholderSvg = `data:image/svg+xml,${encodeURIComponent(`
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#6b7280" text-anchor="middle" dy=".3em">图片加载失败</text>
      </svg>
    `)}`
    e.currentTarget.src = placeholderSvg
  }

  const handleDelete = async (recordId: string) => {
    try {
      await deleteIssueRecord(recordId)
      toast({ title: "删除成功", description: "问题记录已删除" })
      onClose()
    } catch (e: any) {
      toast({ title: "删除失败", description: e.message, variant: "destructive" })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <DialogTitle>问题记录详情</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">状态:</span>
              {getStatusBadge(record.status)}
            </div>
            <div className="text-sm text-muted-foreground">ID: {record.id}</div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">问题描述:</h3>
            <p className="text-sm border rounded-md p-3 bg-muted/30">{record.title}</p>
          </div>

          {record.standards && record.standards.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-1">相关规范/图纸:</h3>
              <div className="space-y-2">
                {record.standards.map((standard: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <LinkIcon className="h-3 w-3 text-blue-500" />
                    <a href="#" className="text-blue-600 hover:underline">
                      {standard.code} {standard.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium mb-1">施工部位:</h3>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span>{record.location}</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">责任单位/人:</h3>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-3 w-3 text-muted-foreground" />
              <span>{record.responsibleUnit}</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">记录时间:</h3>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span>{record.date}</span>
            </div>
          </div>

          {imageItems.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-1">相关图片:</h3>
              <div className="grid grid-cols-2 gap-2">
                {imageItems.map((item) => {
                  const { url, id } = item
                  return (
                    <div key={id} className="relative aspect-square rounded-md overflow-hidden border">
                      <img
                        src={url}
                        alt="问题图片"
                        className="object-cover w-full h-full"
                        onError={handleImageError}
                    />
                  </div>
                  )
                })}
              </div>
            </div>
          )}

          {record.documents && record.documents.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-1">相关文档:</h3>
              <div className="space-y-2">
                {record.documents.map((doc: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <FileText className="h-3 w-3 text-muted-foreground" />
                    <a href="#" className="text-blue-600 hover:underline">
                      {doc.title}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {record.status !== "resolved" && (
            <Button variant="outline" onClick={() => onEdit(record.id)}>
              编辑
            </Button>
          )}
          <Button className="gap-2" onClick={() => onGenerateNotification(record.id)}>
            <FileText className="h-4 w-4" />
            生成问题文档
          </Button>
          <Button variant="destructive" onClick={() => onDelete(record.id)}>
            删除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
