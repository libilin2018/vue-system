import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/index',
    children: [{
      path: 'index',
      name: '首页',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '信息面板', icon: 'dashboard' }
    }]
  },

  {
    path: '/manage',
    component: Layout,
    redirect: '/manage/data-table',
    name: 'Manage',
    meta: { title: '信息管理', icon: 'example' },
    children: [
      {
        path: 'data-table',
        name: '原始数据',
        component: () => import('@/views/table/index'),
        meta: { title: '原始数据', icon: 'table' }
      },
      {
        path: 'wash-data',
        name: '数据清洗',
        component: () => import('@/views/wash/index'),
        meta: { title: '数据清洗', icon: 'tree' }
      }
    ]
  },
  {
    path: '/visual',
    component: Layout,
    redirect: '/visual/map',
    name: 'Visual',
    meta: {
      title: '可视化',
      icon: 'eye-open'
    },
    children: [
      {
        path: 'map',
        component: () => import('@/views/visual/map'), // Parent router-view
        name: '全国分布图',
        meta: { title: '全国分布图', icon: 'Map' }
      },
      {
        path: 'salary',
        component: () => import('@/views/visual/salary'),
        name: '需求数量',
        meta: { title: '需求数量', icon: 'salary' }
      },
      {
        path: 'education',
        component: () => import('@/views/visual/education'),
        name: '学历要求',
        meta: { title: '学历要求', icon: 'education' }
      },
      {
        path: 'workyear',
        component: () => import('@/views/visual/workyear'),
        name: '工作经验',
        meta: { title: '工作经验', icon: 'workyear' }
      },
      {
        path: 'companyType',
        component: () => import('@/views/visual/companyType'),
        name: '企业类型',
        meta: { title: '企业类型', icon: 'companyType' }
      },
      {
        path: 'companyScale',
        component: () => import('@/views/visual/companyScale'),
        name: '企业规模',
        meta: { title: '企业规模', icon: 'companyScale' }
      }
    ]
  }
]

export const asyncRouterMap = [
  {
    path: '/mine',
    component: Layout,
    name: 'Admin',
    alwaysShow: true,
    meta: { title: '我的', icon: 'admin' },
    children: [
      {
        path: 'center',
        name: '个人中心',
        component: () => import('@/views/center/index'),
        meta: { title: '个人中心', icon: 'admin-user' }
      },
      {
        path: 'admin-user',
        name: '用户管理',
        component: () => import('@/views/admin/user'),
        meta: { title: '用户管理', icon: 'admin-user', roles: ['admin'] }
      },
      {
        path: 'admin-publish',
        name: '公告发布',
        component: () => import('@/views/admin/publish'),
        meta: { title: '公告发布', icon: 'publish', roles: ['admin'] }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
