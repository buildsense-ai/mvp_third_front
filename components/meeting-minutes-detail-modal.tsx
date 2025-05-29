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
import { FileText, MapPin, Calendar, Users, FileCheck } from "lucide-react"

interface MeetingMinutesDetailModalProps {
  isOpen: boolean
  onClose: () => void
  record: any
  onEdit: (recordId: string) => void
  onGenerateDocument: (recordId: string) => void
}

export function MeetingMinutesDetailModal({
  isOpen,
  onClose,
  record,
  onEdit,
  onGenerateDocument,
}: MeetingMinutesDetailModalProps) {
  if (!record) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>会议纪要详情</DialogTitle>
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
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-amber-500" />
            <DialogTitle>会议纪要详情</DialogTitle>
          </div>
          <DialogDescription>查看和管理会议纪要的详细信息</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 基本信息 */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>日期: {record.date}</span>
            </div>
            {record.attendees && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>参会人数: {record.attendees}人</span>
              </div>
            )}
          </div>

          {/* 标题 */}
          <div>
            <h3 className="text-lg font-medium mb-2">{record.title}</h3>
          </div>

          {/* 会议基本信息 */}
          {record.basicInfo && (
            <div>
              <h4 className="text-sm font-medium mb-2">会议信息:</h4>
              <div className="bg-muted/30 rounded-md p-3 space-y-2 text-sm">
                {record.basicInfo.meetingName && (
                  <p><span className="font-medium">会议名称:</span> {record.basicInfo.meetingName}</p>
                )}
                {record.basicInfo.dateTime && (
                  <p><span className="font-medium">时间:</span> {record.basicInfo.dateTime}</p>
                )}
                {record.basicInfo.location && (
                  <p><span className="font-medium">地点:</span> {record.basicInfo.location}</p>
                )}
                {record.basicInfo.host && (
                  <p><span className="font-medium">主持人:</span> {record.basicInfo.host}</p>
                )}
                {record.basicInfo.recorder && (
                  <p><span className="font-medium">记录人:</span> {record.basicInfo.recorder}</p>
                )}
                {record.basicInfo.attendees && (
                  <div>
                    <p className="font-medium mb-1">参会人员:</p>
                    <p className="text-muted-foreground">{record.basicInfo.attendees}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 施工单位反映问题 */}
          {record.constructionIssues && (
            <div>
              <h4 className="text-sm font-medium mb-2">施工单位反映问题:</h4>
              <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
                <p className="text-sm">{record.constructionIssues}</p>
              </div>
            </div>
          )}

          {/* 监理单位分析意见 */}
          {record.supervisionAnalysis && (
            <div>
              <h4 className="text-sm font-medium mb-2">监理单位分析意见:</h4>
              <div className="space-y-3">
                {record.supervisionAnalysis.safety && (
                  <div>
                    <h5 className="text-sm font-medium text-blue-600 mb-1">安全文明施工:</h5>
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                      <p className="text-sm">{record.supervisionAnalysis.safety}</p>
                    </div>
                  </div>
                )}
                
                {record.supervisionAnalysis.qualityAndProgress && (
                  <div>
                    <h5 className="text-sm font-medium text-green-600 mb-1">质量进度:</h5>
                    <div className="bg-green-50 border border-green-200 rounded-md p-3">
                      <p className="text-sm">{record.supervisionAnalysis.qualityAndProgress}</p>
                    </div>
                  </div>
                )}
                
                {record.supervisionAnalysis.documentation && (
                  <div>
                    <h5 className="text-sm font-medium text-purple-600 mb-1">资料报验:</h5>
                    <div className="bg-purple-50 border border-purple-200 rounded-md p-3">
                      <p className="text-sm">{record.supervisionAnalysis.documentation}</p>
                    </div>
                  </div>
                )}
                
                {record.supervisionAnalysis.nextWeekRequirements && (
                  <div>
                    <h5 className="text-sm font-medium text-red-600 mb-1">下周要求:</h5>
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-sm">{record.supervisionAnalysis.nextWeekRequirements}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 造价单位 */}
          {record.costUnit && (
            <div>
              <h4 className="text-sm font-medium mb-2">造价单位:</h4>
              <div className="bg-muted/30 rounded-md p-3">
                <p className="text-sm">{record.costUnit}</p>
              </div>
            </div>
          )}

          {/* 设计单位 */}
          {record.designUnit && (
            <div>
              <h4 className="text-sm font-medium mb-2">设计单位:</h4>
              <div className="bg-muted/30 rounded-md p-3">
                <p className="text-sm">{record.designUnit}</p>
              </div>
            </div>
          )}

          {/* 勘察单位 */}
          {record.surveyUnit && record.surveyUnit !== "无" && (
            <div>
              <h4 className="text-sm font-medium mb-2">勘察单位:</h4>
              <div className="bg-muted/30 rounded-md p-3">
                <p className="text-sm">{record.surveyUnit}</p>
              </div>
            </div>
          )}

          {/* 建设单位 */}
          {record.buildingUnit && (
            <div>
              <h4 className="text-sm font-medium mb-2">建设单位:</h4>
              <div className="space-y-2">
                {record.buildingUnit.safety && (
                  <div>
                    <h5 className="text-sm font-medium text-blue-600 mb-1">安全方面:</h5>
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                      <p className="text-sm">{record.buildingUnit.safety}</p>
                    </div>
                  </div>
                )}
                
                {record.buildingUnit.qualityAndProgress && (
                  <div>
                    <h5 className="text-sm font-medium text-green-600 mb-1">质量进度:</h5>
                    <div className="bg-green-50 border border-green-200 rounded-md p-3">
                      <p className="text-sm">{record.buildingUnit.qualityAndProgress}</p>
                    </div>
                  </div>
                )}
                
                {record.buildingUnit.documentation && (
                  <div>
                    <h5 className="text-sm font-medium text-purple-600 mb-1">资料报验:</h5>
                    <div className="bg-purple-50 border border-purple-200 rounded-md p-3">
                      <p className="text-sm">{record.buildingUnit.documentation}</p>
                    </div>
                  </div>
                )}
                
                {record.buildingUnit.nextWeekRequirements && (
                  <div>
                    <h5 className="text-sm font-medium text-red-600 mb-1">下周要求:</h5>
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                      <p className="text-sm">{record.buildingUnit.nextWeekRequirements}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 后续跟进事项 */}
          {record.followUpItems && (
            <div>
              <h4 className="text-sm font-medium mb-2">后续跟进事项:</h4>
              <div className="space-y-2">
                {record.followUpItems.designChanges && (
                  <div>
                    <h5 className="text-sm font-medium mb-1">设计变更:</h5>
                    <div className="bg-muted/30 rounded-md p-3">
                      <p className="text-sm">{record.followUpItems.designChanges}</p>
                    </div>
                  </div>
                )}
                
                {record.followUpItems.workContactApproval && (
                  <div>
                    <h5 className="text-sm font-medium mb-1">工作联系单审批:</h5>
                    <div className="bg-muted/30 rounded-md p-3">
                      <p className="text-sm">{record.followUpItems.workContactApproval}</p>
                    </div>
                  </div>
                )}
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
            生成会议纪要
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 