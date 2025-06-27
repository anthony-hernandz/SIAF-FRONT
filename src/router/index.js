import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import useUtils from '@/utils/useUtils'
import useAuthStore from '@/store/auth'
import dashboardRouter from '@/modules/dashboard/router'
import rolesRouter from '@/modules/roles/router'
import usuariosRouter from '@/modules/usuarios/router'
import authRouter from '@/modules/auth/router'
import catalogsRouter from '@/modules/catalogs/router'

const { canNext } = useUtils()

const routes = [
  ...authRouter,
  ...catalogsRouter,
  ...usuariosRouter,
  ...rolesRouter,
  {
    path: '/',
    component: () => import(/* webpackChunkName: "layout" */ '@/layouts/DashboardLayout.vue'),
    children: [...dashboardRouter, ...usuariosRouter ],
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      requiresAuth: false,
      title: 'Iniciar sesión'
    },
    component: () => import(/* webpackChunkName: "login" */ '@/modules/auth/views/LoginView.vue')
  },

  {
    path: '/forbidden',
    name: 'forbidden',
    meta: { requiresAuth: false, title: 'Acceso denegado' },
    component: () => import(/* webpackChunkName: "forbidden" */ '../views/errors/ForbiddenView.vue')
  },
  {
    path: '/:catchAll(.*)*',
    name: 'not-found',
    meta: {
      requiresAuth: false,
      title: 'Página no encontrada'
    },
    component: () => import(/* webpackChunkName: "not-found" */ '@/views/errors/NotFoundView.vue')
  },
  {
    path: '/notfound',
    name: 'intentionalnotfound',
    meta: {
      requiresAuth: false,
      title: 'Página no encontrada'
    },
    component: () => import(/* webpackChunkName: "not-found" */ '@/views/errors/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const { token } = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  if (requiresAuth && !token) next('/login')
  else if (!requiresAuth && !token) next()
  else if (requiresAuth && token) {
    const authorized = await canNext(to)
    if (authorized) {
      next()
    } else {
      next({
        name: 'forbidden'
      })
    }
  } else next()
})

router.afterEach((to) => {
  nextTick(() => {
    document.title = to.meta.title || 'Vue 3 + Vuetify'
  })
})

export default router
