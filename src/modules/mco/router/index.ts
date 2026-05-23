import type { RouteRecordRaw } from 'vue-router'
import { MCO_ROUTES } from '../constants'

const mcoRoutes: RouteRecordRaw[] = [
  {
    path: '/mco/dashboard',
    name: MCO_ROUTES.Dashboard,
    component: () => import('../views/Dashboard.vue'),
    meta: { public: false },
  },
  {
    path: '/mco/perf',
    name: MCO_ROUTES.PerformanceTest,
    component: () => import('../views/PerformanceTest.vue'),
    meta: { public: false },
  },
]

export default mcoRoutes
