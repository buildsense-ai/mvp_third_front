"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, X, Upload } from "lucide-react"
import { createIssueRecord } from "@/lib/api-service"
import Image from "next/image"
import { toast } from "@/components/ui/use-toast"
import { UPLOAD_BASE_URL } from "@/lib/api-service"

interface IssueRecordCreateModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function IssueRecordCreateModal({ isOpen, onClose, onSuccess }: IssueRecordCreateModalProps) {
  const [formData, setFormData] = useState({
    问题发生地点: "",
    问题描述: "",
    相关图片: [] as string[],
    状态: "待处理",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingImages, setUploadingImages] = useState<string[]>([])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = async (files: FileList) => {
    const newImages: string[] = []
    setUploadingImages(Array.from(files).map(file => file.name))

    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append("file", file)
        
        const response = await fetch(`${UPLOAD_BASE_URL}/upload_image`, {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`上传图片失败: ${response.status}`)
        }

        const data = await response.json()
        if (data.status === "success" && data.image_url) {
          newImages.push(data.image_url)
        }
      }

      // 合并并去重图片URL
      setFormData(prev => ({
        ...prev,
        相关图片: [...new Set([...prev.相关图片, ...newImages])],
      }))
    } catch (error) {
      console.error("上传图片出错:", error)
      toast({
        title: "上传失败",
        description: error instanceof Error ? error.message : "上传图片时发生错误",
        variant: "destructive",
      })
    } finally {
      setUploadingImages([])
    }
  }

  const handleRemoveImage = (imageUrl: string) => {
    if (!imageUrl) return
    
    setFormData(prev => ({
      ...prev,
      相关图片: prev.相关图片.filter(url => url !== imageUrl),
    }))
  }

  const handleSubmit = async () => {
    if (!formData.问题发生地点 || !formData.问题描述) {
      alert("请填写必要信息")
      return
    }

    try {
      setIsSubmitting(true)
      // 将图片数组转换为逗号分隔的字符串
      const submitData = {
        ...formData,
        相关图片: formData.相关图片.join(','),
      }
      await createIssueRecord(submitData)

      // 重置表单
      setFormData({
        问题发生地点: "",
        问题描述: "",
        相关图片: [],
        状态: "待处理",
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error("创建问题记录失败:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <DialogTitle>新建问题记录</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="location">问题发生地点 *</Label>
            <Input
              id="location"
              value={formData.问题发生地点}
              onChange={(e) => handleChange("问题发生地点", e.target.value)}
              placeholder="请输入问题发生地点"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">问题描述 *</Label>
            <Textarea
              id="description"
              value={formData.问题描述}
              onChange={(e) => handleChange("问题描述", e.target.value)}
              placeholder="请详细描述发现的问题"
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label>相关图片</Label>
            <div className="grid grid-cols-2 gap-2">
              {formData.相关图片.map((image) => {
                if (!image || typeof image !== 'string') {
                  console.warn('无效的图片URL:', image)
                  return null
                }

                return (
                  <div key={image} className="relative aspect-square rounded-md overflow-hidden border">
                    <Image
                      src={image}
                      alt="问题图片"
                      fill
                      className="object-cover"
                      unoptimized
                      onError={handleImageError}
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => handleRemoveImage(image)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )
              })}
              <label className="relative aspect-square rounded-md border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-muted/50">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                />
                <div className="text-center">
                  <Upload className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">上传图片</span>
                </div>
              </label>
            </div>
            {uploadingImages.length > 0 && (
              <div className="text-sm text-muted-foreground">
                正在上传: {uploadingImages.join(", ")}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "创建中..." : "确认创建"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
