// 路由工具函数
const BASE_PATH = process.env.NODE_ENV === "production" ? "/web" : ""

export const routes = {
  home: `${BASE_PATH}/`,
  dashboard: `${BASE_PATH}/dashboard`,
  documents: `${BASE_PATH}/dashboard/documents`,
  events: `${BASE_PATH}/dashboard/events`,
} as const

// 导航函数
export const navigate = {
  toDashboard: () => routes.dashboard,
  toDocuments: () => routes.documents,
  toEvents: () => routes.events,
}
