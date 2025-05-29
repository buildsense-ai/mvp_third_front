import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType, BorderStyle } from "docx"
import { saveAs } from "file-saver"

interface SupervisionRecordData {
  project_name?: string
  construction_unit?: string
  pangzhan_unit?: string
  supervision_company?: string
  start_datetime?: string
  end_datetime?: string
  work_overview?: string
  pre_work_check_content?: string
  supervising_personnel?: string
  issues_and_opinions?: string
  rectification_status?: string
  remarks?: string
  construction_enterprise?: string
  supervising_enterprise?: string
  supervising_organization?: string
  on_site_supervising_personnel?: string
}

export async function generateSupervisionRecordDocx(data: SupervisionRecordData) {
  // 格式化日期时间
  const formatDateTime = (dateTimeString?: string) => {
    if (!dateTimeString) return ""
    try {
      const date = new Date(dateTimeString)
      return date.toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      })
    } catch {
      return ""
    }
  }

  // 创建表格单元格
  const createCell = (text: string, width?: number) => {
    return new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: text || "",
              size: 24, // 12pt
              font: "SimSun"
            })
          ],
          alignment: AlignmentType.CENTER
        })
      ],
      width: width ? { size: width, type: WidthType.PERCENTAGE } : undefined,
      margins: {
        top: 100,
        bottom: 100,
        left: 100,
        right: 100
      }
    })
  }

  // 创建标签单元格（左侧标签）
  const createLabelCell = (text: string) => {
    return new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: text,
              size: 24,
              font: "SimSun",
              bold: true
            })
          ],
          alignment: AlignmentType.CENTER
        })
      ],
      width: { size: 25, type: WidthType.PERCENTAGE },
      margins: {
        top: 100,
        bottom: 100,
        left: 100,
        right: 100
      }
    })
  }

  // 创建内容单元格（右侧内容）
  const createContentCell = (text: string, colSpan?: number) => {
    return new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: text || "",
              size: 24,
              font: "SimSun"
            })
          ],
          alignment: AlignmentType.LEFT
        })
      ],
      width: { size: 75, type: WidthType.PERCENTAGE },
      columnSpan: colSpan,
      margins: {
        top: 100,
        bottom: 100,
        left: 200,
        right: 100
      }
    })
  }

  // 创建多行内容单元格
  const createMultilineContentCell = (text: string, minHeight?: number) => {
    return new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: text || "",
              size: 24,
              font: "SimSun"
            })
          ],
          alignment: AlignmentType.LEFT
        })
      ],
      width: { size: 75, type: WidthType.PERCENTAGE },
      margins: {
        top: 200,
        bottom: 200,
        left: 200,
        right: 100
      }
    })
  }

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: 1440, // 1 inch
            bottom: 1440,
            left: 1440,
            right: 1440
          }
        }
      },
      children: [
        // 标题
        new Paragraph({
          children: [
            new TextRun({
              text: "旁 站 记 录",
              size: 32, // 16pt
              font: "SimHei",
              bold: true
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: {
            after: 400
          }
        }),

        // 主要信息表格
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1 },
            bottom: { style: BorderStyle.SINGLE, size: 1 },
            left: { style: BorderStyle.SINGLE, size: 1 },
            right: { style: BorderStyle.SINGLE, size: 1 },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
            insideVertical: { style: BorderStyle.SINGLE, size: 1 }
          },
          rows: [
            // 项目名称
            new TableRow({
              children: [
                createLabelCell("项目名称"),
                createContentCell(data.project_name || "", 3)
              ]
            }),

            // 施工单位和旁站单位
            new TableRow({
              children: [
                createLabelCell("施工单位"),
                createContentCell(data.construction_unit || ""),
                createLabelCell("旁站单位"),
                createContentCell(data.pangzhan_unit || "")
              ]
            }),

            // 监理公司
            new TableRow({
              children: [
                createLabelCell("监理公司"),
                createContentCell(data.supervision_company || "", 3)
              ]
            }),

            // 时间信息
            new TableRow({
              children: [
                createLabelCell("旁站时间"),
                createContentCell(
                  `${formatDateTime(data.start_datetime)} 至 ${formatDateTime(data.end_datetime)}`,
                  3
                )
              ]
            }),

            // 工作概述
            new TableRow({
              children: [
                createLabelCell("工作概述"),
                createMultilineContentCell(data.work_overview || "", 3)
              ]
            }),

            // 施工前检查内容
            new TableRow({
              children: [
                createLabelCell("施工前检查内容"),
                createMultilineContentCell(data.pre_work_check_content || "", 3)
              ]
            }),

            // 监理人员
            new TableRow({
              children: [
                createLabelCell("监理人员"),
                createContentCell(data.supervising_personnel || ""),
                createLabelCell("现场监理人员"),
                createContentCell(data.on_site_supervising_personnel || "")
              ]
            }),

            // 发现问题及意见
            new TableRow({
              children: [
                createLabelCell("发现问题及意见"),
                createMultilineContentCell(data.issues_and_opinions || "", 3)
              ]
            }),

            // 整改状态
            new TableRow({
              children: [
                createLabelCell("整改状态"),
                createContentCell(data.rectification_status || "", 3)
              ]
            }),

            // 企业信息
            new TableRow({
              children: [
                createLabelCell("施工企业"),
                createContentCell(data.construction_enterprise || ""),
                createLabelCell("监理企业"),
                createContentCell(data.supervising_enterprise || "")
              ]
            }),

            // 监理组织
            new TableRow({
              children: [
                createLabelCell("监理组织"),
                createContentCell(data.supervising_organization || "", 3)
              ]
            }),

            // 备注
            new TableRow({
              children: [
                createLabelCell("备注"),
                createMultilineContentCell(data.remarks || "", 3)
              ]
            })
          ]
        }),

        // 签名区域
        new Paragraph({
          children: [
            new TextRun({
              text: "\n\n",
              size: 24
            })
          ]
        }),

        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1 },
            bottom: { style: BorderStyle.SINGLE, size: 1 },
            left: { style: BorderStyle.SINGLE, size: 1 },
            right: { style: BorderStyle.SINGLE, size: 1 },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
            insideVertical: { style: BorderStyle.SINGLE, size: 1 }
          },
          rows: [
            new TableRow({
              children: [
                createLabelCell("监理工程师签字"),
                createCell("", 25),
                createLabelCell("日期"),
                createCell("", 25)
              ]
            }),
            new TableRow({
              children: [
                createLabelCell("施工单位项目经理签字"),
                createCell("", 25),
                createLabelCell("日期"),
                createCell("", 25)
              ]
            })
          ]
        })
      ]
    }]
  })

  // 生成文档
  const buffer = await Packer.toBuffer(doc)
  
  // 生成文件名
  const fileName = `旁站记录_${data.project_name || "未命名项目"}_${new Date().toISOString().split('T')[0]}.docx`
  
  // 保存文件
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" })
  saveAs(blob, fileName)

  return fileName
} 