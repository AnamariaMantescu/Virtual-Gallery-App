<template>
  <div id="app">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="nav-brand">
        <router-link to="/" class="brand-link">Virtual Gallery</router-link>
        <button 
          class="mobile-menu-btn" 
          @click="toggleMobileMenu"
          aria-label="Toggle navigation menu"
        >
          <span class="menu-icon"></span>
        </button>
      </div>

      <div class="nav-links" :class="{ 'nav-links-mobile': isMobileMenuOpen }">
        <router-link 
          v-for="link in navigationLinks" 
          :key="link.path"
          :to="link.path"
          @click="closeMobileMenu"
        >
          {{ link.name }}
        </router-link>

        <template v-if="!isAuthenticated">
          <router-link to="/login" @click="closeMobileMenu">Login</router-link>
          <router-link to="/register" @click="closeMobileMenu">Register</router-link>
        </template>
        <button 
          v-else 
          @click="handleLogout" 
          class="logout-btn"
        >
          Logout
        </button>
      </div>
    </nav>

    <!-- Content -->
    <RouterView />
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()


const isMobileMenuOpen = ref(false)
const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])


const navigationLinks = [
  { name: 'Exhibitions', path: '/exhibitions' },
  { name: 'Artworks', path: '/artworks' },
  { name: 'Collections', path: '/collections' }
]


const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleLogout = async () => {
  await store.dispatch('auth/logout')
  closeMobileMenu()
  router.push('/login')
}
</script>
<style>
#app {
  font-family: 'Arial', sans-serif;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.nav-brand {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.brand-link {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
}

.menu-icon {
  display: block;
  width: 25px;
  height: 3px;
  background-color: #333;
  position: relative;
  transition: background-color 0.3s;
}

.menu-icon::before,
.menu-icon::after {
  content: '';
  position: absolute;
  width: 25px;
  height: 3px;
  background-color: #333;
  transition: transform 0.3s;
}

.menu-icon::before {
  top: -8px;
}

.menu-icon::after {
  bottom: -8px;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-links a {
  color: #666;
  text-decoration: none;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: #4CAF50;
}

.nav-links a.router-link-active {
  color: #4CAF50;
  font-weight: bold;
}

.logout-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: #d32f2f;
}

/* Global */
body {
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}

main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-brand {
    width: auto;
  }

  .mobile-menu-btn {
    display: block;
  }

  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background-color: #ffffff;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }

  .nav-links-mobile {
    display: flex;
  }

  .nav-links a {
    padding: 0.5rem 0;
    width: 100%;
    text-align: center;
  }

  .logout-btn {
    width: 100%;
    margin-top: 0.5rem;
  }

  main {
    padding: 1rem;
  }
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  .nav-links {
    gap: 1rem;
  }

  main {
    padding: 1.5rem;
  }
}

/* Container responsiveness */
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1200px;
  }
}

/* Grid System */
.grid {
  display: grid;
  gap: var(--spacing-sm);
}

.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

@media (max-width: 1024px) {
  .grid-cols-4 { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 768px) {
  .grid-cols-3, .grid-cols-4 { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 576px) {
  .grid-cols-2, .grid-cols-3, .grid-cols-4 { grid-template-columns: 1fr; }
}
</style>