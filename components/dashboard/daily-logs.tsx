import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Calendar, Download, Edit, FileText } from "lucide-react"

// Mock data for daily logs
const mockDailyLogs = [
  {
    id: "1",
    date: "2025-05-10",
    status: "draft",
    weather: "晴",
  },
  {
    id: "2",
    date: "2025-05-11",
    status: "final",
    weather: "多云",
  },
  {
    id: "3",
    date: "2025-05-12",
    status: "draft",
    weather: "小雨",
  },
]

export function DailyLogs() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">监理日志列表</h2>
      </div>

      <div className="space-y-3">
        {mockDailyLogs.map((log) => (
          <Card key={log.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div></div>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-2">监理日志 - {log.date}</h3>
              <div className="flex items-center text-xs text-muted-foreground gap-1 mb-1">
                <Calendar className="h-3 w-3" />
                <span>{log.date}</span>
              </div>
              <div className="text-xs text-muted-foreground mb-1">天气: {log.weather}</div>
            </CardContent>
            <CardFooter className="px-4 pb-4 pt-0 flex justify-between">
              <Button variant="outline" size="sm" className="gap-1">
                <Edit className="h-3 w-3" />
                编辑
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-3 w-3" />
                下载
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
