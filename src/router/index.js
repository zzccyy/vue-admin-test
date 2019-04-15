import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/form',
    component: Layout,
    redirect: '/example/form',
    name: 'form',
    meta: { title: 'form', icon: 'form' },
    children: [
      {
        path: 'index1',
        name: 'Form1',
        component: () => import('@/views/form/index1'),
        meta: { title: 'Form1', icon: 'form' }
      },
      {
        path: 'index2',
        name: 'Form2',
        component: () => import('@/views/form/index2'),
        meta: { title: 'Form2', icon: 'form' }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    name: 'Home',
    hidden: true,
    children: [
      {
        path: 'home',
        component: () => import('@/views/common/home')
      }
    ]
  },
  {
    path: '/sys',
    component: Layout,
    redirect: '/sys',
    name: 'sys',
    meta: { title: '系统管理', icon: 'form' },
    children: [
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/modules/sys/user'),
        meta: { title: '管理员列表', icon: 'form' }
      },
      {
        path: 'config',
        name: 'config',
        component: () => import('@/views/modules/sys/config'),
        meta: { title: '系统配置', icon: 'form' }
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/modules/sys/role'),
        meta: { title: '角色管理', icon: 'form' }
      },
      {
        path: 'menu',
        name: 'menu',
        component: () => import('@/views/modules/sys/menu'),
        meta: { title: '菜单管理', icon: 'form' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
