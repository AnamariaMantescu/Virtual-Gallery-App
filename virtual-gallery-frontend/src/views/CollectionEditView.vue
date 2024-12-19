<template>
  <div class="collection-edit">
    <h1>Edit Collection</h1>
    <form v-if="formData" @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="title">Title</label>
        <input 
          id="title"
          v-model="formData.title"
          type="text"
          required
        >
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="formData.description"
          rows="4"
          required
        ></textarea>
      </div>

      <div class="form-group">
        <label>Select Artworks</label>
        <div class="artwork-selection">
          <div v-for="artwork in availableArtworks" :key="artwork.id" class="artwork-option">
            <input
              type="checkbox"
              :value="artwork.id"
              v-model="formData.artworks"
              :id="'artwork-' + artwork.id"
            >
            <label :for="'artwork-' + artwork.id">{{ artwork.title }}</label>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <router-link to="/collections" class="cancel-btn">Cancel</router-link>
        <button type="submit" class="submit-btn">Save Changes</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

const store = useStore()
const route = useRoute()
const router = useRouter()

const formData = ref(null)
const availableArtworks = ref([])

onMounted(async () => {
  try {
    await store.dispatch('artwork/fetchArtworks')
    availableArtworks.value = store.getters['artwork/allArtworks']
    
    const collection = await store.dispatch('collection/fetchCollectionById', route.params.id)
    formData.value = { ...collection }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})

const handleSubmit = async () => {
  try {
    await store.dispatch('collection/updateCollection', {
      id: route.params.id,
      collectionData: formData.value
    })
    router.push('/collections')
  } catch (error) {
    console.error('Error updating collection:', error)
  }
}
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