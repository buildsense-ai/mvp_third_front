# 🏗️ 巡检记录助手 - BuildSense 前端项目

## 🎯 项目概述

巡检记录助手是一个专门为**工程建设监理**开发的现代化 Web 应用，帮助监理人员高效管理项目检查数据和相关文档。

**核心价值：** 数字化管理建设项目的监督检查记录，提升工程质量管控效率

## 💻 技术架构总览

```
🎨 前端技术栈
├── Next.js 15.2.4      # 全栈框架 (App Router)
├── React 19            # 用户界面
├── TypeScript 5        # 类型安全
├── Tailwind CSS        # 样式框架
└── Radix UI + Shadcn   # 组件库

🌐 后端服务
└── API: https://www.buildsense.asia

📦 核心依赖
├── React Hook Form     # 表单管理
├── Zod                # 数据验证  
├── Recharts           # 图表可视化
└── Date-fns           # 日期处理
```

## 🏗️ 核心功能模块

### 📋 **事件记录管理** (`/dashboard/events`)
> 775行代码的复杂业务页面，处理各类检查记录

**四大记录类型：**
- 🚨 **问题记录** - 施工现场问题的发现、记录与跟踪整改
- 👁️ **旁站记录** - 监理人员现场旁站检查记录  
- 📝 **监理日志** - 日常监理工作记录和总结
- 🤝 **会议纪要** - 项目相关会议讨论和决议记录

**主要操作：**
- ✅ 创建、编辑、删除各类记录
- 🔍 筛选和搜索功能（按状态、类型、时间）
- 📄 批量操作和文档自动生成
- 📊 数据统计和状态跟踪

### 📁 **文档管理** (`/dashboard/documents`) 
> 586行代码的文档处理系统

**支持格式：**
- 📄 PDF 文档
- 📝 Word 文档 (.doc, .docx)  
- 📊 Excel 表格 (.xls, .xlsx)
- 🎯 PowerPoint 演示文稿 (.ppt, .pptx)

**核心功能：**
- ⬆️ 多文件批量上传
- 👀 在线预览和下载
- 🔗 与记录的关联管理
- 🗂️ 分类存储和快速搜索

## 📱 页面结构与路由

```
🏠 应用首页 (/)
└── 项目入口和导航

📊 仪表板系统 (/dashboard)
├── 📋 事件记录页面 (/dashboard/events)
│   ├── 问题记录管理
│   ├── 旁站记录管理  
│   ├── 监理日志管理
│   └── 会议纪要管理
│
└── 📁 文档管理页面 (/dashboard/documents)
    ├── 文档上传中心
    ├── 文档预览查看
    ├── 批量操作工具
    └── 搜索分类功能
```

## 🔗 API 接口架构

### 🏢 基础配置
- **API Base URL**: `https://www.buildsense.asia`
- **Upload Base URL**: `https://www.buildsense.asia`

### 📡 主要接口分类

#### 🎯 **旁站记录 API** (`/pangzhan/`)
```typescript
GET    /docx_utils/pangzhan/     # 获取记录列表  
GET    /pangzhan/{id}            # 获取单条记录
POST   /pangzhan/                # 创建新记录
PUT    /pangzhan/{id}            # 更新记录
DELETE /pangzhan/{id}            # 删除记录
```

#### 🚨 **问题记录 API** (`/issue-records/`)
```typescript
POST   /issue-records/           # 创建问题记录
GET    /issue-records/           # 获取问题列表  
GET    /issue-records/{id}       # 获取问题详情
PUT    /issue-records/{id}       # 更新问题状态
DELETE /issue-records/{id}       # 删除问题记录
```

#### 📄 **文档管理 API**
```typescript
POST   /upload/supervision/{panzhanId}    # 上传文档
POST   /generate/supervision/{id}         # 生成文档  
DELETE /supervision/{panzhanId}/document  # 删除文档
```

## 📊 数据模型

### 🎯 **旁站记录模型** (SupervisionRecord)
```typescript
interface SupervisionRecord {
  id?: number                          # 记录ID
  project_name: string | null          # 项目名称
  construction_unit: string | null     # 施工单位
  supervision_company: string | null   # 监理公司
  start_datetime: string | null        # 开始时间
  end_datetime: string | null          # 结束时间
  work_overview: string | null         # 工作概况
  supervising_personnel: string | null # 监理人员
  issues_and_opinions: string | null   # 问题和意见
  document_urls: string | null         # 相关文档
  // ... 更多业务字段
}
```

### 🚨 **问题记录模型** (IssueRecord)
```typescript
interface IssueRecord {
  id?: number           # 问题ID
  location: string      # 问题地点
  description: string   # 问题描述
  images: string[]      # 相关图片
  record_time: string   # 记录时间
  status: string        # 处理状态
  // ... 更多跟踪字段
}
```

## 📂 项目文件结构

```
mvp_third_front/
├── 📱 app/                          # Next.js 页面路由
│   ├── 📊 dashboard/                # 仪表板模块
│   │   ├── 📋 events/              # 事件记录 (775行)
│   │   └── 📁 documents/           # 文档管理 (586行)
│   ├── 🎨 layout.tsx               # 根布局
│   ├── 🏠 page.tsx                 # 应用首页
│   └── 🎯 globals.css              # 全局样式
│
├── 🧩 components/                   # 可复用组件 (20+)
│   ├── 🎨 ui/                      # 基础UI组件 (50+)
│   ├── 📊 dashboard/               # 仪表板组件
│   ├── 🪟 *-modal.tsx              # 各类模态框
│   └── 🔧 *.tsx                    # 业务组件
│
├── 📚 lib/                         # 工具库
│   ├── 🌐 api-service.ts           # API服务 (672行)
│   ├── 🛤️ routes.ts                # 路由配置
│   └── 🔧 utils.ts                 # 工具函数
│
├── 🛠️ utils/                       # 业务工具
│   └── 📄 file.ts                  # 文件处理
│
├── 🎣 hooks/                       # 自定义Hooks
├── 🎨 styles/                      # 样式文件
└── 🖼️ public/                      # 静态资源
```

## 🚀 开发指南

### 🔧 **环境准备**
```bash
Node.js 18+                    # 运行环境
npm/yarn/pnpm                  # 包管理器
```

### ⚡ **快速开始**
```bash
# 1. 进入项目目录
cd mvp_third_front

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
pnpm dev

# 4. 构建生产版本
pnpm build
```

### ⚙️ **核心配置文件**
- `next.config.mjs` - Next.js 框架配置
- `tailwind.config.ts` - 样式框架配置  
- `tsconfig.json` - TypeScript 编译配置
- `components.json` - UI组件库配置

## 🌟 项目特色

### 📱 **响应式设计**
- 完全适配移动端和桌面端
- 移动端优化的触控交互
- 响应式导航和布局

### 🎨 **现代化界面**
- 明暗主题切换支持
- 统一的设计系统
- 优雅的交互动画

### 🔔 **用户体验**
- 实时状态反馈
- 友好的错误提示
- 流畅的操作流程

### 📊 **数据可视化**
- 图表展示和分析
- 状态统计面板
- 趋势数据展示

## 🛠️ 维护说明

### 📋 **代码规范**
- ESLint 代码检查
- React/Next.js 最佳实践
- PascalCase 组件命名
- kebab-case 文件命名

### 🚨 **错误处理**
- 统一的错误处理机制
- 用户友好的错误提示
- 网络请求重试机制

### 📈 **性能监控**
- 核心Web指标关注
- 定期性能评估
- 代码分割和懒加载优化

