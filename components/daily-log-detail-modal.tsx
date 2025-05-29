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
import { FileText, MapPin, Calendar, Clock, CloudSun } from "lucide-react"

interface DailyLogDetailModalProps {
  isOpen: boolean
  onClose: () => void
  record: any
  onEdit: (recordId: string) => void
  onGenerateDocument: (recordId: string) => void
}

export function DailyLogDetailModal({
  isOpen,
  onClose,
  record,
  onEdit,
  onGenerateDocument,
}: DailyLogDetailModalProps) {
  if (!record) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>监理日志详情</DialogTitle>
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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-500" />
            <DialogTitle>监理日志详情</DialogTitle>
          </div>
          <DialogDescription>查看和管理监理日志的详细信息</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 基本信息 */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>日期: {record.date}</span>
            </div>
            {record.weather && (
              <div className="flex items-center gap-2">
                <CloudSun className="h-4 w-4 text-muted-foreground" />
                <span>天气: {record.weather}</span>
              </div>
            )}
          </div>

          {/* 标题 */}
          <div>
            <h3 className="text-lg font-medium mb-2">{record.title}</h3>
          </div>

          {/* 基本项目信息 */}
          {record.basicInfo && (
            <div>
              <h4 className="text-sm font-medium mb-2">基本信息:</h4>
              <div className="bg-muted/30 rounded-md p-3 space-y-1 text-sm">
                {record.basicInfo.projectName && (
                  <p><span className="font-medium">项目名称:</span> {record.basicInfo.projectName}</p>
                )}
                {record.basicInfo.temperature && (
                  <p><span className="font-medium">温度:</span> {record.basicInfo.temperature}</p>
                )}
              </div>
            </div>
          )}

          {/* 监理人员 */}
          {record.supervisionPersonnel && record.supervisionPersonnel.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">监理人员:</h4>
              <div className="space-y-1">
                {record.supervisionPersonnel.map((person: any) => (
                  <div key={person.id} className="flex items-center gap-2 text-sm">
                    <Badge variant={person.checked ? "default" : "secondary"}>
                      {person.checked ? "在岗" : "不在岗"}
                    </Badge>
                    <span>{person.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 施工活动 */}
          {record.constructionActivities && record.constructionActivities.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">施工活动:</h4>
              <div className="space-y-3">
                {record.constructionActivities.map((activity: any) => (
                  <div key={activity.id} className="bg-muted/30 rounded-md p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium text-sm">{activity.location}</span>
                    </div>
                    <p className="text-sm mb-1"><span className="font-medium">内容:</span> {activity.content}</p>
                    {activity.details && (
                      <p className="text-sm text-muted-foreground">{activity.details}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 监理活动 */}
          {record.supervisionActivities && record.supervisionActivities.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">监理活动:</h4>
              <div className="space-y-3">
                {record.supervisionActivities.map((activity: any) => (
                  <div key={activity.id} className="bg-muted/30 rounded-md p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{activity.type}</Badge>
                      <span className="text-sm">{activity.relatedActivity}</span>
                    </div>
                    {activity.details && (
                      <p className="text-sm text-muted-foreground">{activity.details}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 问题记录 */}
          {record.problems && (
            <div>
              <h4 className="text-sm font-medium mb-2">发现问题:</h4>
              <div className="space-y-3">
                {record.problems.quality && record.problems.quality.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-red-600 mb-1">质量问题:</h5>
                    {record.problems.quality.map((problem: any) => (
                      <div key={problem.id} className="bg-red-50 border border-red-200 rounded-md p-3">
                        <p className="text-sm mb-1">{problem.description}</p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">处理措施:</span> {problem.measures}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                
                {record.problems.safety && record.problems.safety.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-orange-600 mb-1">安全问题:</h5>
                    {record.problems.safety.map((problem: any) => (
                      <div key={problem.id} className="bg-orange-50 border border-orange-200 rounded-md p-3">
                        <p className="text-sm mb-1">{problem.description}</p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">处理措施:</span> {problem.measures}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 其他事项 */}
          {record.otherMatters && record.otherMatters.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">其他事项:</h4>
              <div className="space-y-2">
                {record.otherMatters.map((matter: any) => (
                  <div key={matter.id} className="bg-muted/30 rounded-md p-3">
                    <p className="text-sm font-medium mb-1">{matter.title}</p>
                    <p className="text-sm text-muted-foreground">{matter.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 生成文档 */}
          {record.generatedDocuments && record.generatedDocuments.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">已生成文档:</h4>
              <div className="space-y-2">
                {record.generatedDocuments.map((doc: any) => (
                  <div key={doc.id} className="flex items-center gap-2 text-sm">
                    <FileText className="h-3 w-3 text-muted-foreground" />
                    <span>{doc.title}</span>
                    <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                  </div>
                ))}
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
            生成监理日志
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 