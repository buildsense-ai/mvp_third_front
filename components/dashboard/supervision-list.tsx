import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Calendar, CheckCircle, Clock, FileText, MapPin, Edit } from "lucide-react"

// Mock data for supervision records
const mockSupervisionRecords = [
  {
    id: "1",
    title: "混凝土浇筑旁站",
    date: "2025-05-10",
    time: "09:00-12:30",
    location: "A区3层板",
    conclusion: "合格",
    hasDocument: true,
  },
  {
    id: "2",
    title: "钢筋绑扎旁站",
    date: "2025-05-12",
    time: "14:00-16:30",
    location: "B区2层梁",
    conclusion: "合格",
    hasDocument: true,
  },
  {
    id: "3",
    title: "模板安装旁站",
    date: "2025-05-14",
    time: "08:30-11:00",
    location: "C区1层柱",
    conclusion: "不合格",
    hasDocument: true,
  },
]

export function SupervisionList() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">旁站记录列表</h2>
      </div>

      <div className="space-y-3">
        {mockSupervisionRecords.map((record) => (
          <Card key={record.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <Badge variant={record.conclusion === "合格" ? "outline" : "destructive"}>{record.conclusion}</Badge>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-2">{record.title}</h3>
              <div className="flex items-center text-xs text-muted-foreground gap-1 mb-1">
                <Calendar className="h-3 w-3" />
                <span>{record.date}</span>
              </div>
              <div className="flex items-center text-xs text-muted-foreground gap-1 mb-1">
                <Clock className="h-3 w-3" />
                <span>{record.time}</span>
              </div>
              <div className="flex items-center text-xs text-muted-foreground gap-1 mb-1">
                <MapPin className="h-3 w-3" />
                <span>{record.location}</span>
              </div>
            </CardContent>
            <CardFooter className="px-4 pb-4 pt-0 flex justify-between gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Edit className="h-3 w-3" />
                编辑
              </Button>
              <Button variant="outline" size="sm">
                查看详情
              </Button>
              {record.hasDocument && (
                <Button variant="outline" size="sm" className="gap-1">
                  <FileText className="h-3 w-3" />
                  查看记录文档
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
