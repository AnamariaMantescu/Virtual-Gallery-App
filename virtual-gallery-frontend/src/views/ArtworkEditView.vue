<template>
  <div class="artwork-edit">
    <h1>Edit Artwork</h1>

    <form v-if="formData" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Title</label>
        <input v-model="formData.title" type="text" required />
      </div>

      <div class="form-group">
        <label>Artist</label>
        <input v-model="formData.artist" type="text" required />
      </div>

      <div class="form-group">
        <label>Description</label>
        <textarea v-model="formData.description" required></textarea>
      </div>

      <div class="form-group">
        <label>Image URL</label>
        <input v-model="formData.imageUrl" type="url" required />
      </div>

      <div class="form-group">
        <label>Year</label>
        <input v-model="formData.year" type="number" required />
      </div>

      <div class="form-group">
        <label>Collection</label>
        <select v-model="formData.collectionId">
          <option value="">(No Collection)</option>
          <option v-for="collection in allCollections" :key="collection.id" :value="collection.id">
            {{ collection.title }}
          </option>
        </select>
      </div>

      <div class="form-group form-group-approve">
        <label>Approved?</label>
        <input type="checkbox" v-model="formData.isApproved" :disabled="!isAdmin" />
      </div>

      <div class="actions">
        <button type="submit">Save Changes</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

const store = useStore()
const route = useRoute()
const router = useRouter()

const formData = ref(null)
const allCollections = ref([])

const isAdmin = computed(() => store.getters['auth/isAdmin'])

onMounted(async () => {
  try {
    await store.dispatch('collection/fetchCollections')
    allCollections.value = store.getters['collection/allCollections']

    const artwork = await store.dispatch('artwork/fetchArtworkById', route.params.id)
    formData.value = { ...artwork }
  } catch (error) {
    console.error('Failed to load artwork or collections:', error)
    router.push('/artworks')
  }
})

async function handleSubmit() {
  try {
    await store.dispatch('artwork/updateArtwork', {
      id: route.params.id,
      artworkData: formData.value
    })
    router.push('/artworks')
  } catch (error) {
    console.error('Failed to update artwork:', error)
  }
}
</script>

<style scoped>
.artwork-edit {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.artwork-edit h1 {
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.form-group-approve {
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.form-group textarea {
  min-height: 80px;
  resize: vertical;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.actions button {
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  background-color: #4CAF50;
  color: #fff;
}

.actions button:hover {
  background-color: #45a049;
}
</style>
