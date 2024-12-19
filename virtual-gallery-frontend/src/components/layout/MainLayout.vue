<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="header-content">
        <router-link to="/" class="logo">
          Virtual Gallery
        </router-link>
        <nav class="main-nav">
          <router-link to="/artworks">Artworks</router-link>
          <router-link to="/collections">Collections</router-link>
          <router-link to="/exhibitions">Exhibitions</router-link>
        </nav>
        <div class="user-menu">
          <template v-if="isAuthenticated">
            <span class="user-name">{{ user?.name }}</span>
            <AppButton variant="secondary" @click="handleLogout">Logout</AppButton>
          </template>
          <template v-else>
            <AppButton variant="primary" @click="navigateToLogin">Login</AppButton>
          </template>
        </div>
        <button class="mobile-menu-toggle" @click="toggleMobileMenu">
          <span class="menu-icon"></span>
        </button>
      </div>
    </header>

    <aside class="mobile-menu" :class="{ 'is-open': isMobileMenuOpen }">
      <nav class="mobile-nav">
        <router-link to="/artworks" @click="closeMobileMenu">Artworks</router-link>
        <router-link to="/collections" @click="closeMobileMenu">Collections</router-link>
        <router-link to="/exhibitions" @click="closeMobileMenu">Exhibitions</router-link>
      </nav>
    </aside>

    <main class="app-main">
      <div class="content-container">
        <slot></slot>
      </div>
    </main>

    <footer class="app-footer">
      <div class="footer-content">
        <p>&copy; 2024 Virtual Gallery. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import AppButton from '../components/common/AppButton.vue'

const store = useStore()
const router = useRouter()
const isMobileMenuOpen = ref(false)

const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
const user = computed(() => store.state.auth.user)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const handleLogout = async () => {
  await store.dispatch('auth/logout')
  router.push('/login')
}

const navigateToLogin = () => {
  router.push('/login')
}
</script>

<style>

.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--background-color);
}

.app-header {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: var(--large-desktop);
  margin: 0 auto;
  padding: var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  text-decoration: none;
}

.main-nav {
  display: flex;
  gap: var(--spacing-lg);
}

.main-nav a {
  color: var(--text-color);
  text-decoration: none;
  padding: var(--spacing-sm);
}

.main-nav a.router-link-active {
  color: var(--primary-color);
  font-weight: 500;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.mobile-menu-toggle {
  display: none;
  background: none;
  border: none;
  padding: var(--spacing-sm);
  cursor: pointer;
}

.app-main {
  margin-top: 64px; 
  flex: 1;
  padding: var(--spacing-xl);
}

.content-container {
  max-width: var(--large-desktop);
  margin: 0 auto;
}

.app-footer {
  background: white;
  padding: var(--spacing-xl) 0;
  margin-top: auto;
}

.footer-content {
  max-width: var(--large-desktop);
  margin: 0 auto;
  padding: 0 var(--spacing-md);
  text-align: center;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .main-nav {
    display: none;
  }

  .mobile-menu-toggle {
    display: block;
  }

  .mobile-menu {
    position: fixed;
    top: 64px;
    left: 0;
    width: 100%;
    background: white;
    padding: var(--spacing-md);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .mobile-menu.is-open {
    transform: translateX(0);
  }

  .mobile-nav {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .mobile-nav a {
    color: var(--text-color);
    text-decoration: none;
    padding: var(--spacing-sm);
  }

  .app-main {
    padding: var(--spacing-md);
  }
}

/* Grid System */
.grid {
  display: grid;
  gap: var(--spacing-md);
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