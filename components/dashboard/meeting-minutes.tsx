import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Calendar, Download, Edit, FileText, Users } from "lucide-react"

// Mock data for meeting minutes
const mockMeetingMinutes = [
  {
    id: "1",
    title: "项目例会",
    date: "2025-05-10",
    status: "draft",
    attendees: 12,
  },
  {
    id: "2",
    title: "质量专题会",
    date: "2025-05-12",
    status: "final",
    attendees: 8,
  },
  {
    id: "3",
    title: "安全专题会",
    date: "2025-05-14",
    status: "draft",
    attendees: 15,
  },
]

export function MeetingMinutes() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">会议纪要列表</h2>
      </div>

      <div className="space-y-3">
        {mockMeetingMinutes.map((meeting) => (
          <Card key={meeting.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div></div>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-2">{meeting.title}</h3>
              <div className="flex items-center text-xs text-muted-foreground gap-1 mb-1">
                <Calendar className="h-3 w-3" />
                <span>{meeting.date}</span>
              </div>
              <div className="flex items-center text-xs text-muted-foreground gap-1 mb-1">
                <Users className="h-3 w-3" />
                <span>参会人数: {meeting.attendees}</span>
              </div>
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
