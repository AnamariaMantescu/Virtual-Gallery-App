<template>
  <div class="collections-page">
    <div class="header">
      <h1>Collections</h1>
      <router-link 
        v-if="isAdmin" 
        to="/collections/create" 
        class="create-btn"
      >
        Create Collection
      </router-link>
    </div>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="collections-grid">
      <div v-for="collection in collections" :key="collection.id" class="collection-card">
        <h3>{{ collection.title }}</h3>
        <p>{{ collection.description }}</p>
        <div class="artwork-count">
          {{ collection.artworks?.length || 0 }} artworks
        </div>
        <div class="actions" v-if="isAdmin">
          <router-link 
            :to="`/collections/${collection.id}/edit`"
            class="edit-btn"
          >
            Edit
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const collections = computed(() => store.getters['collection/allCollections'])
const loading = computed(() => store.getters['collection/loading'])
const error = computed(() => store.getters['collection/error'])
const isAdmin = computed(() => store.getters['auth/isAdmin'])

onMounted(() => {
  store.dispatch('collection/fetchCollections')
})
</script>

<style scoped>
.collections-page {
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

.collections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding-bottom: 1rem;
  padding-left: 4rem;
  padding-right: 4rem;
}

.collection-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  background: white;
}

.edit-btn {
  background-color: #2196F3;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  display: inline-block;
  margin-top: 1rem;
}

.artwork-count {
  color: #666;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .collections-grid {
    grid-template-columns: 1fr;
  }
}
</style>