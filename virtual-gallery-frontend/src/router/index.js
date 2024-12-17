import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

const requireAuth = (to, from, next) => {
  if (!store.getters['auth/isAuthenticated']) {
    next('/login')
  } else {
    next()
  }
}

const requireAdmin = (to, from, next) => {
  if (!store.getters['auth/isAdmin']) { 
    next('/')
  } else {
    next()
  }
}

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
      beforeEnter: requireAdmin
    },
    {
      path: '/artworks/:id/edit',
      name: 'artwork-edit',
      component: () => import('../views/ArtworkEditView.vue'),
      beforeEnter: requireAdmin
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
      beforeEnter: requireAdmin
    },
    {
      path: '/collections/:id/edit',
      name: 'collection-edit',
      component: () => import('../views/CollectionEditView.vue'),
      beforeEnter: requireAdmin
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
      beforeEnter: requireAdmin
    },
    {
      path: '/exhibitions/:id/edit',
      name: 'exhibition-edit',
      component: () => import('../views/ExhibitionEditView.vue'),
      beforeEnter: requireAdmin
    }
  ]
})

export default router