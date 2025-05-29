import DashboardLayout from "../dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"

export default function KnowledgeBasePage() {
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">规范知识库</h1>
      </div>

      <div className="mb-8">
        <p className="text-muted-foreground">
          规范知识库主要通过对话窗口进行交互。当AI回答引用规范内容时，会提供链接跳转到此处查看原文。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <BookOpen className="h-5 w-5" />
            <div>
              <CardTitle>建筑工程施工质量验收统一标准</CardTitle>
              <CardDescription>GB 50300-2013</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">本标准适用于新建、扩建和改建的各类建筑工程施工质量的验收。</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <BookOpen className="h-5 w-5" />
            <div>
              <CardTitle>混凝土结构工程施工质量验收规范</CardTitle>
              <CardDescription>GB 50204-2015</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              本规范适用于采用现浇混凝土、预制混凝土和预应力混凝土等结构形式的建筑工程施工质量验收。
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <BookOpen className="h-5 w-5" />
            <div>
              <CardTitle>建筑地基基础工程施工质量验收标准</CardTitle>
              <CardDescription>GB 50202-2018</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">本标准适用于工业与民用建筑的地基基础工程施工质量验收。</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
