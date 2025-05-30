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
import { FileText, MapPin, Calendar, Clock, CloudSun, Users } from "lucide-react"

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

  // 判断是否为API数据格式
  const isApiData = record.originalData && record.originalData.project_id
  const logData = isApiData ? record.originalData : record

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
              <span>日期: {logData.date || record.date}</span>
            </div>
            {(logData.weather || record.weather) && (
              <div className="flex items-center gap-2">
                <CloudSun className="h-4 w-4 text-muted-foreground" />
                <span>天气: {logData.weather || record.weather}</span>
              </div>
            )}
            {logData.temperature && (
              <div className="flex items-center gap-2">
                <span>温度: {logData.temperature}</span>
              </div>
            )}
            {logData.status && (
              <div className="flex items-center gap-2">
                <span>状态:</span>
                <Badge variant={
                  logData.status === 'approved' ? 'default' : 
                  logData.status === 'submitted' ? 'secondary' : 
                  logData.status === 'rejected' ? 'destructive' : 'outline'
                }>
                  {logData.status === 'draft' ? '草稿' :
                   logData.status === 'submitted' ? '已提交' :
                   logData.status === 'approved' ? '已批准' :
                   logData.status === 'rejected' ? '已驳回' : logData.status}
                </Badge>
              </div>
            )}
          </div>

          {/* 标题 */}
          <div>
            <h3 className="text-lg font-medium mb-2">
              {record.title || `监理日志 - ${logData.date || record.date}`}
            </h3>
          </div>

          {/* API数据格式的基本信息 */}
          {isApiData && (
            <div>
              <h4 className="text-sm font-medium mb-2">项目信息:</h4>
              <div className="bg-muted/30 rounded-md p-3 space-y-1 text-sm">
                <p><span className="font-medium">项目ID:</span> {logData.project_id}</p>
                <p><span className="font-medium">监理人员:</span> {logData.supervisor_name}</p>
              </div>
            </div>
          )}

          {/* 模拟数据格式的基本信息 */}
          {!isApiData && record.basicInfo && (
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

          {/* 人员统计 (API数据) */}
          {isApiData && (logData.morning_management || logData.afternoon_management || 
                        logData.morning_skilled_workers || logData.afternoon_skilled_workers ||
                        logData.morning_laborers || logData.afternoon_laborers) && (
            <div>
              <h4 className="text-sm font-medium mb-2">人员统计:</h4>
              <div className="bg-muted/30 rounded-md p-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium mb-2 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      上午
                    </h5>
                    <div className="space-y-1">
                      <p>管理人员: {logData.morning_management || 0}</p>
                      <p>技术工人: {logData.morning_skilled_workers || 0}</p>
                      <p>普通工人: {logData.morning_laborers || 0}</p>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      下午
                    </h5>
                    <div className="space-y-1">
                      <p>管理人员: {logData.afternoon_management || 0}</p>
                      <p>技术工人: {logData.afternoon_skilled_workers || 0}</p>
                      <p>普通工人: {logData.afternoon_laborers || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 监理人员 (模拟数据) */}
          {!isApiData && record.supervisionPersonnel && record.supervisionPersonnel.length > 0 && (
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
          {(logData.construction_activities || (record.constructionActivities && record.constructionActivities.length > 0)) && (
            <div>
              <h4 className="text-sm font-medium mb-2">施工活动:</h4>
              <div className="bg-muted/30 rounded-md p-3">
                {isApiData ? (
                  <p className="text-sm whitespace-pre-wrap">{logData.construction_activities}</p>
                ) : (
                  <div className="space-y-3">
                    {record.constructionActivities.map((activity: any) => (
                      <div key={activity.id}>
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
                )}
              </div>
            </div>
          )}

          {/* 监理活动 */}
          {(logData.supervision_activities || (record.supervisionActivities && record.supervisionActivities.length > 0)) && (
            <div>
              <h4 className="text-sm font-medium mb-2">监理活动:</h4>
              <div className="bg-muted/30 rounded-md p-3">
                {isApiData ? (
                  <p className="text-sm whitespace-pre-wrap">{logData.supervision_activities}</p>
                ) : (
                  <div className="space-y-3">
                    {record.supervisionActivities.map((activity: any) => (
                      <div key={activity.id}>
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
                )}
              </div>
            </div>
          )}

          {/* 问题记录 */}
          {(isApiData && (logData.quality_issues || logData.safety_issues || logData.progress_issues || logData.cost_issues)) ||
           (!isApiData && record.problems && (
             (record.problems.quality && record.problems.quality.length > 0) ||
             (record.problems.safety && record.problems.safety.length > 0) ||
             (record.problems.progress && record.problems.progress.length > 0) ||
             (record.problems.cost && record.problems.cost.length > 0)
           )) ? (
            <div>
              <h4 className="text-sm font-medium mb-2">发现问题:</h4>
              <div className="space-y-3">
                {isApiData ? (
                  <>
                    {logData.quality_issues && (
                      <div>
                        <h5 className="text-sm font-medium text-red-600 mb-1">质量问题:</h5>
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                          <p className="text-sm whitespace-pre-wrap">{logData.quality_issues}</p>
                        </div>
                      </div>
                    )}
                    
                    {logData.safety_issues && (
                      <div>
                        <h5 className="text-sm font-medium text-orange-600 mb-1">安全问题:</h5>
                        <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
                          <p className="text-sm whitespace-pre-wrap">{logData.safety_issues}</p>
                        </div>
                      </div>
                    )}

                    {logData.progress_issues && (
                      <div>
                        <h5 className="text-sm font-medium text-blue-600 mb-1">进度问题:</h5>
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                          <p className="text-sm whitespace-pre-wrap">{logData.progress_issues}</p>
                        </div>
                      </div>
                    )}

                    {logData.cost_issues && (
                      <div>
                        <h5 className="text-sm font-medium text-purple-600 mb-1">成本问题:</h5>
                        <div className="bg-purple-50 border border-purple-200 rounded-md p-3">
                          <p className="text-sm whitespace-pre-wrap">{logData.cost_issues}</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          ) : null}

          {/* 其他事项 */}
          {(logData.other_matters || (record.otherMatters && record.otherMatters.length > 0)) && (
            <div>
              <h4 className="text-sm font-medium mb-2">其他事项:</h4>
              <div className="bg-muted/30 rounded-md p-3">
                {isApiData ? (
                  <p className="text-sm whitespace-pre-wrap">{logData.other_matters}</p>
                ) : (
                  <div className="space-y-2">
                    {record.otherMatters.map((matter: any) => (
                      <div key={matter.id}>
                        <p className="text-sm font-medium mb-1">{matter.title}</p>
                        <p className="text-sm text-muted-foreground">{matter.content}</p>
                      </div>
                    ))}
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
            生成监理日志
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 