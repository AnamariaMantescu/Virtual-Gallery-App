<template>
  <div class="exhibition-edit">
    <h1>Edit Exhibition</h1>
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
        <label for="coverImage">Cover Image URL</label>
        <input 
          id="coverImage"
          v-model="formData.coverImage"
          type="url"
          required
        >
        <img 
          v-if="formData.coverImage" 
          :src="formData.coverImage" 
          alt="Cover Preview"
          class="image-preview"
        >
      </div>

      <div class="date-inputs">
        <div class="form-group">
          <label for="startDate">Start Date</label>
          <input 
            id="startDate"
            v-model="formData.startDate"
            type="date"
            required
          >
        </div>

        <div class="form-group">
          <label for="endDate">End Date</label>
          <input 
            id="endDate"
            v-model="formData.endDate"
            type="date"
            required
          >
        </div>
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
        <router-link to="/exhibitions" class="cancel-btn">Cancel</router-link>
        <button type="submit" class="submit-btn">Save Changes</button>
      </div>
    </form>

    <div v-else-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
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
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    // Fetch available artworks
    await store.dispatch('artwork/fetchArtworks')
    availableArtworks.value = store.getters['artwork/allArtworks']
    
    // Fetch current exhibition data
    const exhibition = await store.dispatch('exhibition/fetchExhibitionById', route.params.id)
    
    // Format dates for input type="date"
    formData.value = {
      ...exhibition,
      startDate: formatDateForInput(exhibition.startDate),
      endDate: formatDateForInput(exhibition.endDate)
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})

const formatDateForInput = (dateString) => {
  const date = new Date(dateString)
  return date.toISOString().split('T')[0]
}

const handleSubmit = async () => {
  try {
    loading.value = true
    await store.dispatch('exhibition/updateExhibition', {
      id: route.params.id,
      exhibitionData: {
        ...formData.value,
        startDate: new Date(formData.value.startDate).toISOString(),
        endDate: new Date(formData.value.endDate).toISOString()
      }
    })
    router.push('/exhibitions')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.exhibition-edit {
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
input[type="url"],
input[type="date"],
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.image-preview {
  margin-top: 1rem;
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.date-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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

.loading, .error {
  text-align: center;
  padding: 2rem;
}

.error {
  color: #f44336;
}

@media (max-width: 768px) {
  .date-inputs {
    grid-template-columns: 1fr;
  }
}
</style>