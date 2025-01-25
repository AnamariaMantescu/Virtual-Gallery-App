import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
      path: '/exhibitions',
      name: 'exhibitions',
      component: () => import('../views/ExhibitionsView.vue')
    },
    {
      path: '/exhibitions/create',
      name: 'exhibition-create',
      component: () => import('../views/ExhibitionCreateView.vue'),
      beforeEnter: (to, from, next) => {
        if (!store.getters['auth/isAdmin']) {
          next('/')
        } else {
          next()
        }
      }
    }
  ]
})

export default router