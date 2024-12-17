<template>
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
      <template v-else>
        <button @click="logout">Logout</button>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const logout = () => {
  authStore.logout()
}
</script>