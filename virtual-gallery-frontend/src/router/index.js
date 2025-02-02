import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue')
  },
  {
    path: '/artworks',
    name: 'artworks',
    component: () => import('../views/ArtworksView.vue')
  },
  {
    path: '/artworks/create',
    name: 'artwork-create',
    component: () => import('../views/ArtworkCreateView.vue'),
    beforeEnter: (to, from, next) => {
      if (!store.getters['auth/isAuthenticated']) {
        next('/login')
      } else {
        next()
      }
    }
  },
  {
    path: '/artworks/:id',
    name: 'artwork-detail',
    component: () => import('../views/ArtworkDetailsView.vue')
  },
  {
    path: '/artworks/:id/edit',
    name: 'artwork-edit',
    component: () => import('../views/ArtworkEditView.vue'),
    beforeEnter: (to, from, next) => {
      if (!store.getters['auth/isAdmin']) {
        next('/')
      } else {
        next()
      }
    }
  },
  {
    path: '/collections',
    name: 'collections',
    component: () => import('../views/CollectionsView.vue')
  },
  {
    path: '/collections/create',
    name: 'collection-create',
    component: () => import('../views/CollectionCreateView.vue'),
    beforeEnter: (to, from, next) => {
      if (!store.getters['auth/isAdmin']) {
        next('/')
      } else {
        next()
      }
    }
  },
  {
    path: '/collections/:id',
    name: 'collection-detail',
    component: () => import('../views/CollectionDetailsView.vue')
  },
  {
    path: '/collections/:id/edit',
    name: 'collection-edit',
    component: () => import('../views/CollectionEditView.vue'),
    beforeEnter: (to, from, next) => {
      if (!store.getters['auth/isAdmin']) {
        next('/')
      } else {
        next()
      }
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return {}
  }
})

export default router
