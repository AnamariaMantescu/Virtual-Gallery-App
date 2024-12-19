<template>
  <div class="exhibitions-page">
    <div class="header">
      <h1>Exhibitions</h1>
      <router-link 
        v-if="isAdmin" 
        to="/exhibitions/create" 
        class="create-btn"
      >
        Create Exhibition
      </router-link>
    </div>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="exhibitions-grid">
      <exhibition-card 
        v-for="exhibition in exhibitions" 
        :key="exhibition.id" 
        :exhibition="exhibition"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import ExhibitionCard from '../components/exhibitions/ExhibitionCard.vue'

const store = useStore()

const exhibitions = computed(() => store.getters['exhibition/allExhibitions'])
const loading = computed(() => store.getters['exhibition/isLoading'])
const error = computed(() => store.getters['exhibition/error'])
const isAdmin = computed(() => store.getters['auth/isAdmin'])

onMounted(() => {
  store.dispatch('exhibition/fetchExhibitions')
})
</script>

<style scoped>
.exhibitions-page {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.create-btn {
  background-color: #4CAF50;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
}

.exhibitions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

@media (max-width: 768px) {
  .exhibitions-grid {
    grid-template-columns: 1fr;
  }
}
</style>