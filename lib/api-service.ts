import { toast } from "@/hooks/use-toast"

// 更新 API 基础 URL
export const API_BASE_URL = "https://www.buildsense.asia"
export const UPLOAD_BASE_URL = "https://www.buildsense.asia"

export interface SupervisionRecord {
  id?: number
  type?: string
  title?: string
  date?: string
  project_name: string | null
  construction_unit: string | null
  pangzhan_unit: string | null
  supervision_company: string | null
  start_datetime: string | null
  end_datetime: string | null
  work_overview: string | null
  pre_work_check_content: string | null
  supervising_personnel: string | null
  issues_and_opinions: string | null
  rectification_status: string | null
  remarks: string | null
  construction_enterprise: string | null
  supervising_enterprise: string | null
  supervising_organization: string | null
  on_site_supervising_personnel: string | null
  document_urls: string | null
  created_at?: string
  updated_at?: string
  weather?: string
  icon?: any
  location?: string
  status?: string
  attendees?: number
  time?: string
  responsibleUnit?: string
  generatedDocuments?: Array<{
    id: string
    title: string
    date: string
    type: string
  }>
}

export interface UploadResponse {
  status: string
  project_id: number
  doc_url: string
  message: string
}

// 获取旁站记录列表
export async function getSupervisionRecords(skip = 0, limit = 20): Promise<SupervisionRecord[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/docx_utils/pangzhan/?skip=${skip}&limit=${limit}`, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 502) {
        throw new Error("服务器暂时不可用，请稍后再试")
      }
      throw new Error(`获取旁站记录失败: ${response.status}`)
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error("获取旁站记录出错:", error)
    throw error
  }
}

// 获取单个旁站记录
export async function getSupervisionRecord(id: number | string): Promise<SupervisionRecord> {
  try {
    const response = await fetch(`${API_BASE_URL}/pangzhan/${id}`, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("找不到该旁站记录")
      } else if (response.status === 502) {
        throw new Error("服务器暂时不可用，请稍后再试")
      }
      throw new Error(`获取旁站记录失败: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("获取旁站记录出错:", error)
    throw error
  }
}

// 创建旁站记录
export async function createSupervisionRecord(
  record: Omit<SupervisionRecord, "id" | "created_at" | "updated_at">,
): Promise<SupervisionRecord> {
  try {
    const response = await fetch(`${API_BASE_URL}/pangzhan/`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
    })

    if (!response.ok) {
      if (response.status === 502) {
        throw new Error("服务器暂时不可用，请稍后再试")
      }
      throw new Error(`创建旁站记录失败: ${response.status}`)
    }

    const data = await response.json()

    toast({
      title: "创建成功",
      description: "旁站记录已成功创建",
    })

    return data
  } catch (error) {
    console.error("创建旁站记录出错:", error)
    toast({
      title: "创建失败",
      description: error instanceof Error ? error.message : "创建旁站记录时发生错误",
      variant: "destructive",
    })
    throw error
  }
}

// 更新旁站记录
export async function updateSupervisionRecord(
  id: number | string,
  record: Omit<SupervisionRecord, "id" | "created_at" | "updated_at">,
): Promise<SupervisionRecord> {
  try {
    const response = await fetch(`${API_BASE_URL}/docx_utils/pangzhan/${id}`, {
      method: "PUT",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("找不到该旁站记录")
      } else if (response.status === 502) {
        throw new Error("服务器暂时不可用，请稍后再试")
      } else if (response.status === 422) {
        const errorText = await response.text()
        try {
          const errorData = JSON.parse(errorText)
          const errorDetails = errorData.detail || errorText
          throw new Error(`数据验证失败: ${JSON.stringify(errorDetails)}`)
        } catch {
          throw new Error(`数据验证失败: ${errorText}`)
        }
      }
      throw new Error(`更新旁站记录失败: ${response.status}`)
    }

    const data = await response.json()

    toast({
      title: "更新成功",
      description: "旁站记录已成功更新",
    })

    return data
  } catch (error) {
    console.error("更新旁站记录出错:", error)
    throw error // 重新抛出错误，让调用方处理toast显示
  }
}

// 删除旁站记录
export async function deleteSupervisionRecord(id: number | string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/pangzhan/${id}`, {
      method: "DELETE",
      headers: {
        accept: "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("找不到该旁站记录")
      } else if (response.status === 502) {
        throw new Error("服务器暂时不可用，请稍后再试")
      }
      throw new Error(`删除旁站记录失败: ${response.status}`)
    }

    toast({
      title: "删除成功",
      description: "旁站记录已成功删除",
    })

    return true
  } catch (error) {
    console.error("删除旁站记录出错:", error)
    toast({
      title: "删除失败",
      description: error instanceof Error ? error.message : "删除旁站记录时发生错误",
      variant: "destructive",
    })
    return false
  }
}

// 上传旁站记录文档
export async function uploadSupervisionDocument(
  panzhanId: number | string,
  file: File,
  onProgress?: (progress: number) => void,
): Promise<UploadResponse> {
  try {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${UPLOAD_BASE_URL}/upload_doc_standBy?panzhan_id=${panzhanId}`, {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: formData,
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("找不到该旁站记录")
      } else if (response.status === 502) {
        throw new Error("服务器暂时不可用，请稍后再试")
      }
      throw new Error(`文档上传失败: ${response.status}`)
    }

    const data = await response.json()

    if (data.status === "success") {
      toast({
        title: "上传成功",
        description: "文档已成功上传",
      })
    } else {
      throw new Error(data.message || "上传失败")
    }

    return data
  } catch (error) {
    console.error("上传文档出错:", error)
    toast({
      title: "上传失败",
      description: error instanceof Error ? error.message : "上传文档时发生错误",
      variant: "destructive",
    })
    throw error
  }
}

// 生成旁站记录文档
export async function generateSupervisionDocument(id: number | string): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/pangzhan/${id}/document`, {
      method: "POST",
      headers: {
        accept: "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("找不到该旁站记录")
      } else if (response.status === 502) {
        throw new Error("服务器暂时不可用，请稍后再试")
      }
      throw new Error(`生成文档失败: ${response.status}`)
    }

    const data = await response.json()

    toast({
      title: "生成成功",
      description: "旁站记录文档已成功生成",
    })

    return data.document_url || null
  } catch (error) {
    console.error("生成文档出错:", error)
    toast({
      title: "生成失败",
      description: error instanceof Error ? error.message : "生成文档时发生错误",
      variant: "destructive",
    })
    return null
  }
}

// 删除旁站记录关联文档
export async function deleteSupervisionDocument(panzhanId: number | string, fileUrl: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${UPLOAD_BASE_URL}/delete_doc_by_url?panzhan_id=${panzhanId}&file_url=${encodeURIComponent(fileUrl)}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
        },
        body: "",
      },
    )

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("找不到该文档或旁站记录")
      } else if (response.status === 502) {
        throw new Error("服务器暂时不可用，请稍后再试")
      }
      throw new Error(`删除文档失败: ${response.status}`)
    }

    toast({
      title: "删除成功",
      description: "文档已成功删除",
    })

    return true
  } catch (error) {
    console.error("删除文档出错:", error)
    toast({
      title: "删除失败",
      description: error instanceof Error ? error.message : "删除文档时发生错误",
      variant: "destructive",
    })
    return false
  }
}

// 问题记录相关接口
export interface IssueRecord {
  id?: number
  location: string
  description: string
  images: string[]
  record_time: string
  update_time: string
  status: string
  weather?: string
  icon?: any
  attendees?: number
  time?: string
  responsibleUnit?: string
  generatedDocuments?: Array<{
    id: string
    title: string
    date: string
    type: string
  }>
}

export interface IssueCreateRequest {
  问题发生地点: string
  问题描述: string
  相关图片?: string
  记录时间?: string
  状态?: string
}

// 创建或更新问题记录
export async function createOrUpdateIssueRecord(
  record: IssueCreateRequest
): Promise<IssueRecord> {
  try {
    const response = await fetch(`${API_BASE_URL}/put_issues`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
    })

    if (!response.ok) {
      if (response.status === 502) {
        throw new Error("服务器暂时不可用，请稍后再试")
      }
      throw new Error(`创建/更新问题记录失败: ${response.status}`)
    }

    const data = await response.text() // 后端返回字符串消息
    
    // 操作成功，重新获取记录列表来获取更新后的数据
    const updatedRecords = await getIssueRecords(0, 100)
    
    // 根据位置和描述查找对应的记录
    const matchingRecord = updatedRecords.find(r => 
      r.location === record.问题发生地点 && r.description === record.问题描述
    )

    toast({
      title: "操作成功",
      description: data.includes("创建成功") ? "问题记录已成功创建" : "问题记录已成功更新",
    })

    // 返回匹配的记录，如果找不到则返回一个基本的记录对象
    return matchingRecord || {
      id: Date.now(),
      location: record.问题发生地点,
      description: record.问题描述,
      images: record.相关图片 ? record.相关图片.split(',') : [],
      record_time: record.记录时间 || new Date().toISOString(),
      update_time: new Date().toISOString(),
      status: record.状态 || "待处理"
    }
  } catch (error) {
    console.error("创建/更新问题记录出错:", error)
    toast({
      title: "操作失败",
      description: error instanceof Error ? error.message : "创建/更新问题记录时发生错误",
      variant: "destructive",
    })
    throw error
  }
}

// 获取问题记录列表
export async function getIssueRecords(
  skip = 0, 
  limit = 100, 
  status?: string,
  filter?: { location?: string; description?: string }
): Promise<IssueRecord[]> {
  try {
    let url = `${API_BASE_URL}/issues?skip=${skip}&limit=${limit}`
    if (status && status !== "all") {
      url += `&status=${encodeURIComponent(status)}`
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 502) {
        throw new Error("服务器暂时不可用，请稍后再试")
      }
      throw new Error(`获取问题记录失败: ${response.status}`)
    }

    const data = await response.json()
    let records = Array.isArray(data) ? data : []

    // 应用额外的过滤条件
    if (filter) {
      records = records.filter(record => {
        if (filter.location && record.location !== filter.location) return false
        if (filter.description && record.description !== filter.description) return false
        return true
      })
    }

    return records
  } catch (error) {
    console.error("获取问题记录出错:", error)
    throw error
  }
}

// 获取单个问题记录
export async function getIssueRecord(id: number | string): Promise<IssueRecord> {
  try {
    const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("找不到该问题记录")
      } else if (response.status === 502) {
        throw new Error("服务器暂时不可用，请稍后再试")
      }
      throw new Error(`获取问题记录失败: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("获取问题记录出错:", error)
    throw error
  }
}

// 创建问题记录
export async function createIssueRecord(
  record: Omit<IssueCreateRequest, "记录时间"> & { 记录时间?: string },
): Promise<IssueRecord> {
  try {
    const requestData: IssueCreateRequest = {
      ...record,
      记录时间: record.记录时间 || new Date().toISOString(),
      // 确保相关图片是字符串
      相关图片: Array.isArray(record.相关图片) ? record.相关图片.join(',') : record.相关图片,
    }

    const response = await fetch(`${API_BASE_URL}/issues`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })

    if (!response.ok) {
      if (response.status === 502) {
        throw new Error("服务器暂时不可用，请稍后再试")
      }
      throw new Error(`创建问题记录失败: ${response.status}`)
    }

    const data = await response.json()

    toast({
      title: "创建成功",
      description: "问题记录已成功创建",
    })

    return data
  } catch (error) {
    console.error("创建问题记录出错:", error)
    toast({
      title: "创建失败",
      description: error instanceof Error ? error.message : "创建问题记录时发生错误",
      variant: "destructive",
    })
    throw error
  }
}

// 更新问题记录
export async function updateIssueRecord(
  id: number | string,
  record: IssueCreateRequest
): Promise<IssueRecord> {
  try {
    console.log("发送更新请求:", { id, record })
    
    const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
      method: "PUT",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API响应错误:", response.status, errorText)
      
      if (response.status === 404) {
        throw new Error("找不到该问题记录")
      } else if (response.status === 502) {
        throw new Error("服务器暂时不可用，请稍后再试")
      } else if (response.status === 422) {
        try {
          const errorData = JSON.parse(errorText)
          const errorDetails = errorData.detail || errorText
          throw new Error(`数据验证失败: ${JSON.stringify(errorDetails)}`)
        } catch {
          throw new Error(`数据验证失败: ${errorText}`)
        }
      }
      throw new Error(`更新问题记录失败: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    toast({
      title: "更新成功",
      description: "问题记录已成功更新",
    })

    return data
  } catch (error) {
    console.error("更新问题记录出错:", error)
    throw error // 重新抛出错误，让调用方处理toast显示
  }
}

// 删除问题记录
export async function deleteIssueRecord(id: number | string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/issues/${id}`, {
      method: "DELETE",
      headers: {
        accept: "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("找不到该问题记录")
      } else if (response.status === 502) {
        throw new Error("服务器暂时不可用，请稍后再试")
      }
      throw new Error(`删除问题记录失败: ${response.status}`)
    }

    toast({
      title: "删除成功",
      description: "问题记录已成功删除",
    })

    return true
  } catch (error) {
    console.error("删除问题记录出错:", error)
    toast({
      title: "删除失败",
      description: error instanceof Error ? error.message : "删除问题记录时发生错误",
      variant: "destructive",
    })
    return false
  }
}

// 合并问题记录请求接口
export interface MergeIssuesRequest {
  issue_ids: number[]
}

// 合并问题记录响应接口
export interface MergedIssueResponse {
  merged_issue: {
    id: number
    location: string
    description: string
    images: string[]
    record_time: string
    update_time: string
    status: string
    is_merged: boolean
    merged_from_ids: number[]
  }
}

// 合并问题记录
export async function mergeIssueRecords(issueIds: number[]): Promise<MergedIssueResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/merge-issues`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ issue_ids: issueIds }),
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("未找到指定的问题记录")
      } else if (response.status === 502) {
        throw new Error("服务器暂时不可用，请稍后再试")
      } else if (response.status === 422) {
        const errorText = await response.text()
        try {
          const errorData = JSON.parse(errorText)
          const errorDetails = errorData.detail || errorText
          throw new Error(`数据验证失败: ${JSON.stringify(errorDetails)}`)
        } catch {
          throw new Error(`数据验证失败: ${errorText}`)
        }
      }
      throw new Error(`合并问题记录失败: ${response.status}`)
    }

    const data = await response.json()

    toast({
      title: "合并成功",
      description: `已成功合并 ${issueIds.length} 个问题记录`,
    })

    return data
  } catch (error) {
    console.error("合并问题记录出错:", error)
    const errorMessage = error instanceof Error ? error.message : "合并问题记录时发生未知错误"
    toast({
      title: "合并失败",
      description: errorMessage,
      variant: "destructive",
    })
    throw error
  }
}

// 生成问题记录文档响应接口
export interface GenerateIssueDocResponse {
  issue_id: number
  id: number
  location: string
  doc_url: string
}

// 生成问题记录文档
export async function generateIssueDocument(issueId: number): Promise<GenerateIssueDocResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/generate_issue_doc/${issueId}`, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("未找到指定的问题记录")
      } else if (response.status === 502) {
        throw new Error("服务器暂时不可用，请稍后再试")
      } else if (response.status === 500) {
        const errorText = await response.text()
        try {
          const errorData = JSON.parse(errorText)
          throw new Error(errorData.detail || "服务器内部错误")
        } catch {
          throw new Error("服务器内部错误")
        }
      }
      throw new Error(`生成问题记录文档失败: ${response.status}`)
    }

    const data = await response.json()

    toast({
      title: "生成成功",
      description: `问题记录文档已生成，文档ID: ${data.id}`,
    })

    // 触发文档下载
    if (data.doc_url) {
      const link = document.createElement('a')
      link.href = data.doc_url
      link.download = `问题记录_${data.issue_id}_${new Date().toISOString().slice(0, 10)}.docx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    return data
  } catch (error) {
    console.error("生成问题记录文档出错:", error)
    const errorMessage = error instanceof Error ? error.message : "生成问题记录文档时发生未知错误"
    toast({
      title: "生成失败",
      description: errorMessage,
      variant: "destructive",
    })
    throw error
  }
}

const processImages = (images: string | string[] | undefined): Array<{url: string, id: string}> => {
  if (!images) return []

  // 兼容 ["url1,url2"] 这种情况
  if (Array.isArray(images) && images.length === 1 && typeof images[0] === "string" && images[0].includes(",")) {
    images = images[0].split(",").map(s => s.trim()).filter(Boolean)
  }

  // 如果是字符串，按逗号分割
  if (typeof images === 'string') {
    images = images.split(',').map(s => s.trim()).filter(Boolean)
  }

  // 只做简单处理，不做 decodeURIComponent
  if (Array.isArray(images)) {
    return images.map((url, index) => {
      // 去除首尾引号
      const cleanUrl = url.replace(/^["']|["']$/g, '')
      // 生成唯一 id
      return {
        url: cleanUrl,
        id: `img-${index}-${btoa(cleanUrl).slice(0, 12)}`
      }
    })
  }

  return []
}

// 监理日志相关接口类型定义
export interface SupervisionLog {
  id?: string
  project_id: string
  supervisor_name: string
  date: string
  weather?: string
  temperature?: string
  morning_management?: number
  morning_skilled_workers?: number
  morning_laborers?: number
  afternoon_management?: number
  afternoon_skilled_workers?: number
  afternoon_laborers?: number
  construction_activities?: string
  supervision_activities?: string
  quality_issues?: string
  safety_issues?: string
  progress_issues?: string
  cost_issues?: string
  other_matters?: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
  created_at?: string
  updated_at?: string
}

export interface SupervisionLogCreateRequest {
  project_id: string
  supervisor_name: string
  date: string
  weather?: string
  temperature?: string
  morning_management?: number
  morning_skilled_workers?: number
  morning_laborers?: number
  afternoon_management?: number
  afternoon_skilled_workers?: number
  afternoon_laborers?: number
  construction_activities?: string
  supervision_activities?: string
  quality_issues?: string
  safety_issues?: string
  progress_issues?: string
  cost_issues?: string
  other_matters?: string
  status?: 'draft' | 'submitted' | 'approved' | 'rejected'
}

export interface SupervisionLogUpdateRequest extends Partial<SupervisionLogCreateRequest> {}

export interface SupervisionLogListResponse {
  total: number
  logs: SupervisionLog[]
}

export interface SupervisionLogStatusUpdate {
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
}

// 创建监理日志
export async function createSupervisionLog(logData: SupervisionLogCreateRequest): Promise<SupervisionLog> {
  try {
    const response = await fetch(`${API_BASE_URL}/sup/logs/`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logData),
    })

    if (!response.ok) {
      if (response.status === 502) {
        throw new Error("服务器暂时不可用，请稍后再试")
      } else if (response.status === 400) {
        const errorText = await response.text()
        try {
          const errorData = JSON.parse(errorText)
          throw new Error(errorData.detail || "数据验证失败")
        } catch {
          throw new Error("数据验证失败")
        }
      }
      throw new Error(`创建监理日志失败: ${response.status}`)
    }

    const data = await response.json()

    toast({
      title: "创建成功",
      description: "监理日志已成功创建",
    })

    return data
  } catch (error) {
    console.error("创建监理日志出错:", error)
    toast({
      title: "创建失败", 
      description: error instanceof Error ? error.message : "创建监理日志时发生错误",
      variant: "destructive",
    })
    throw error
  }
}

// 获取监理日志列表
export async function getSupervisionLogs(
  skip = 0,
  limit = 100,
  filters?: {
    project_id?: string
    supervisor_name?: string
    status?: string
    date_from?: string
    date_to?: string
  }
): Promise<SupervisionLogListResponse> {
  try {
    let url = `${API_BASE_URL}/sup/logs/?skip=${skip}&limit=${limit}`
    
    if (filters) {
      if (filters.project_id) url += `&project_id=${encodeURIComponent(filters.project_id)}`
      if (filters.supervisor_name) url += `&supervisor_name=${encodeURIComponent(filters.supervisor_name)}`
      if (filters.status) url += `&status=${encodeURIComponent(filters.status)}`
      if (filters.date_from) url += `&date_from=${filters.date_from}`
      if (filters.date_to) url += `&date_to=${filters.date_to}`
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 502) {
        throw new Error("服务器暂时不可用，请稍后再试")
      }
      throw new Error(`获取监理日志列表失败: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("获取监理日志列表出错:", error)
    throw error
  }
}

// 获取单个监理日志
export async function getSupervisionLog(logId: string): Promise<SupervisionLog> {
  try {
    const response = await fetch(`${API_BASE_URL}/sup/logs/${logId}`, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("找不到该监理日志")
      } else if (response.status === 502) {
        throw new Error("服务器暂时不可用，请稍后再试")
      }
      throw new Error(`获取监理日志失败: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("获取监理日志出错:", error)
    throw error
  }
}

// 更新监理日志
export async function updateSupervisionLog(
  logId: string,
  logData: SupervisionLogUpdateRequest
): Promise<SupervisionLog> {
  try {
    const response = await fetch(`${API_BASE_URL}/sup/logs/${logId}`, {
      method: "PUT",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logData),
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("找不到该监理日志")
      } else if (response.status === 502) {
        throw new Error("服务器暂时不可用，请稍后再试")
      } else if (response.status === 400) {
        const errorText = await response.text()
        try {
          const errorData = JSON.parse(errorText)
          throw new Error(errorData.detail || "数据验证失败")
        } catch {
          throw new Error("数据验证失败")
        }
      }
      throw new Error(`更新监理日志失败: ${response.status}`)
    }

    const data = await response.json()

    toast({
      title: "更新成功",
      description: "监理日志已成功更新",
    })

    return data
  } catch (error) {
    console.error("更新监理日志出错:", error)
    throw error
  }
}

// 更新监理日志状态
export async function updateSupervisionLogStatus(
  logId: string,
  statusData: SupervisionLogStatusUpdate
): Promise<SupervisionLog> {
  try {
    const response = await fetch(`${API_BASE_URL}/sup/logs/${logId}/status`, {
      method: "PATCH",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(statusData),
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("找不到该监理日志")
      } else if (response.status === 400) {
        const errorText = await response.text()
        try {
          const errorData = JSON.parse(errorText)
          throw new Error(errorData.detail || "状态值无效")
        } catch {
          throw new Error("状态值无效")
        }
      } else if (response.status === 502) {
        throw new Error("服务器暂时不可用，请稍后再试")
      }
      throw new Error(`更新监理日志状态失败: ${response.status}`)
    }

    const data = await response.json()

    toast({
      title: "状态更新成功",
      description: `监理日志状态已更新为: ${statusData.status}`,
    })

    return data
  } catch (error) {
    console.error("更新监理日志状态出错:", error)
    throw error
  }
}

// 删除监理日志
export async function deleteSupervisionLog(logId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/sup/logs/${logId}`, {
      method: "DELETE",
      headers: {
        accept: "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("找不到该监理日志")
      } else if (response.status === 502) {
        throw new Error("服务器暂时不可用，请稍后再试")
      }
      throw new Error(`删除监理日志失败: ${response.status}`)
    }

    toast({
      title: "删除成功",
      description: "监理日志已成功删除",
    })

    return true
  } catch (error) {
    console.error("删除监理日志出错:", error)
    toast({
      title: "删除失败",
      description: error instanceof Error ? error.message : "删除监理日志时发生错误",
      variant: "destructive",
    })
    return false
  }
}

// 按项目获取监理日志
export async function getSupervisionLogsByProject(
  projectId: string,
  skip = 0,
  limit = 100
): Promise<SupervisionLogListResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/sup/logs/by_project/${projectId}?skip=${skip}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      }
    )

    if (!response.ok) {
      if (response.status === 502) {
        throw new Error("服务器暂时不可用，请稍后再试")
      }
      throw new Error(`获取项目监理日志失败: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("获取项目监理日志出错:", error)
    throw error
  }
}

// 按监理人员获取监理日志
export async function getSupervisionLogsBySupervisor(
  supervisorName: string,
  skip = 0,
  limit = 100
): Promise<SupervisionLogListResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/sup/logs/by_supervisor/${supervisorName}?skip=${skip}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      }
    )

    if (!response.ok) {
      if (response.status === 502) {
        throw new Error("服务器暂时不可用，请稍后再试")
      }
      throw new Error(`获取监理人员日志失败: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("获取监理人员日志出错:", error)
    throw error
  }
}

// 获取监理日志统计信息
export async function getSupervisionStats(filters?: {
  project_id?: string
  date_from?: string
  date_to?: string
}): Promise<any> {
  try {
    let url = `${API_BASE_URL}/sup/stats/summary`
    const params = new URLSearchParams()
    
    if (filters) {
      if (filters.project_id) params.append('project_id', filters.project_id)
      if (filters.date_from) params.append('date_from', filters.date_from)
      if (filters.date_to) params.append('date_to', filters.date_to)
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 502) {
        throw new Error("服务器暂时不可用，请稍后再试")
      }
      throw new Error(`获取监理日志统计信息失败: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("获取监理日志统计信息出错:", error)
    throw error
  }
}
