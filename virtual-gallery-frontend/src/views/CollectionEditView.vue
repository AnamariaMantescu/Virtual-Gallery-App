<template>
  <div class="collection-edit">
    <h1>Edit Collection</h1>

    <form v-if="formData" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Title</label>
        <input v-model="formData.title" type="text" required />
      </div>

      <div class="form-group">
        <label>Description</label>
        <textarea v-model="formData.description" required></textarea>
      </div>

      <div class="form-group">
        <label>Theme</label>
        <input v-model="formData.theme" type="text" required />
      </div>

      <div class="actions">
        <button type="submit">Save Changes</button>
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

onMounted(async () => {
  try {
    const collection = await store.dispatch('collection/fetchCollectionById', route.params.id)
    formData.value = { ...collection }
  } catch (error) {
    console.error('Error fetching collection:', error)
    router.push('/collections')
  }
})

async function handleSubmit() {
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
.collection-edit {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #ddd;
}

h1 {
  text-align: center;
  margin-bottom: 1.5rem;
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

.artwork-selection {
  display: flex;
  flex-direction: column;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 0.5rem;
  border-radius: 4px;
}

.artwork-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.2rem 0;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}

.cancel-btn {
  padding: 0.75rem 1.25rem;
  background-color: #bbb;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
}

.cancel-btn:hover {
  background-color: #999;
}

.submit-btn {
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  background-color: #4CAF50;
  color: #fff;
}

.submit-btn:hover {
  background-color: #45a049;
}
</style>
