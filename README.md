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

### 📋 **事件记录管理** (`/events` | `/dashboard/events`)
> 重构后提供两种界面模式：简化版和完整版

**🎯 简化版界面** (`/events`)
- ✨ **专为AI对话辅助设计** - 去除所有导航层级，聚焦核心功能
- 🎨 **扁平化Tab设计** - 将四种记录类型设为平级标签页
- 🚀 **无冗余UI元素** - 移除顶部导航、面包屑、侧边栏等
- 📱 **响应式布局** - 适配各种屏幕尺寸的简洁界面
- 🔄 **自动重定向** - 从 `/web` 自动导向简化版页面

**🏢 完整版界面** (`/dashboard/events`) 
- 📊 **传统仪表板风格** - 保留完整的导航和层级结构
- 🧭 **完整导航体系** - 包含顶栏、侧边栏、面包屑导航
- 🎛️ **管理员功能** - 适合系统管理和数据分析场景

**四大记录类型：**
- 🚨 **问题记录** - 施工现场问题的发现、记录与跟踪整改
  - ✅ **智能复选框** - 仅问题记录支持批量操作
  - 🔄 **批量处理** - 合并记录、生成巡检报告
  - 📋 **状态管理** - 跟踪问题处理进度
- 👁️ **旁站记录** - 监理人员现场旁站检查记录  
- 📝 **监理日志** - 日常监理工作记录和总结
- 🤝 **会议纪要** - 项目相关会议讨论和决议记录

**主要操作：**
- ✅ 创建、编辑、删除各类记录
- 🔍 筛选和搜索功能（按状态、类型、时间）
- 📄 **智能批量操作** - 仅对问题记录启用复选框和批量功能
- 📊 数据统计和状态跟踪
- 🎯 **AI对话集成** - 记录来源于AI对话，无需手动新建

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
├── 🔄 自动重定向至 /events (从 /web 访问时)
└── 项目入口和导航

🎯 简化版事件页面 (/events) [NEW]
├── 📋 问题记录 (支持复选框 + 批量操作)
├── 👁️ 旁站记录 (纯展示)
├── 📝 监理日志 (纯展示)
├── 🤝 会议纪要 (纯展示)
└── 📄 已生成文档

📊 完整版仪表板系统 (/dashboard)
├── 📋 事件记录页面 (/dashboard/events)
│   ├── 🚨 问题记录管理 (带复选框功能)
│   ├── 👁️ 旁站记录管理  
│   ├── 📝 监理日志管理
│   └── 🤝 会议纪要管理
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

#### 🚨 **问题记录 API** (`/issues/`)
```typescript
POST   /issues/                  # 创建问题记录
GET    /issues/                  # 获取问题列表  
GET    /issues/{id}              # 获取问题详情
PUT    /issues/{id}              # 更新问题状态
DELETE /issues/{id}              # 删除问题记录
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
  type?: string                        # 记录类型 (用于UI区分)
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
│   ├── 🎯 events/                  # 简化版事件页面 [NEW]
│   │   └── page.tsx                # AI对话辅助界面 (785行)
│   ├── 📊 dashboard/                # 完整版仪表板模块
│   │   ├── 📋 events/              # 传统事件记录页面 (775行)
│   │   └── 📁 documents/           # 文档管理 (586行)
│   ├── 🎨 layout.tsx               # 根布局
│   ├── 🏠 page.tsx                 # 应用首页 (含重定向逻辑)
│   └── 🎯 globals.css              # 全局样式
│
├── 🧩 components/                   # 可复用组件 (20+)
│   ├── 🎨 ui/                      # 基础UI组件 (50+)
│   ├── 📊 dashboard/               # 仪表板组件
│   ├── 🪟 *-modal.tsx              # 各类模态框
│   └── 🔧 *.tsx                    # 业务组件
│
├── 📚 lib/                         # 工具库
│   ├── 🌐 api-service.ts           # API服务 (676行)
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

# 4. 访问应用
# 简化版: http://localhost:3001/events
# 完整版: http://localhost:3001/dashboard/events
# 或从首页自动重定向

# 5. 构建生产版本
pnpm build
```

### ⚙️ **核心配置文件**
- `next.config.mjs` - Next.js 框架配置
- `tailwind.config.ts` - 样式框架配置  
- `tsconfig.json` - TypeScript 编译配置
- `components.json` - UI组件库配置

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
- API服务不可用时的优雅降级

### 🔄 **最近更新**
- ✅ **界面重构** - 创建简化版事件页面，优化AI对话辅助体验
- ✅ **复选框优化** - 仅问题记录支持批量操作，其他类型纯展示
- ✅ **路由调整** - 添加自动重定向，优化用户访问路径
- ✅ **UI简化** - 去除冗余导航元素，聚焦核心功能
- ✅ **响应式优化** - 改善各设备上的使用体验



