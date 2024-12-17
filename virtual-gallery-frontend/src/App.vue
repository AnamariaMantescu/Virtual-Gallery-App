<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-brand">
        <router-link to="/" class="brand-link">Virtual Gallery</router-link>
      </div>
      <div class="nav-links">
        <router-link to="/exhibitions">Exhibitions</router-link>
        <router-link to="/artworks">Artworks</router-link>
        <router-link to="/collections">Collections</router-link>
        <template v-if="!isAuthenticated">
          <router-link to="/login">Login</router-link>
          <router-link to="/register">Register</router-link>
        </template>
        <button v-else @click="logout" class="logout-btn">Logout</button>
      </div>
    </nav>

    <RouterView />
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])

const logout = () => {
  store.dispatch('auth/logout')
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
}

.nav-brand .brand-link {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
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

/* Global styles */
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
</style>