<template>
  <div class="collection-create">
    <h1>Create New Collection</h1>
    <form @submit.prevent="handleSubmit" class="form">
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
        <button type="submit" class="submit-btn">Create Collection</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const formData = ref({
  title: '',
  description: '',
  artworks: []
})

const availableArtworks = ref([])

onMounted(async () => {
  try {
    await store.dispatch('artwork/fetchArtworks')
    availableArtworks.value = store.getters['artwork/allArtworks']
  } catch (error) {
    console.error('Error fetching artworks:', error)
  }
})

const handleSubmit = async () => {
  try {
    await store.dispatch('collection/createCollection', formData.value)
    router.push('/collections')
  } catch (error) {
    console.error('Error creating collection:', error)
  }
}
</script>

<style scoped>
.collection-create {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input[type="text"],
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.artwork-selection {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 4px;
}

.artwork-option {
  margin-bottom: 0.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-btn {
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.submit-btn {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #45a049;
}
</style>