<template>
  <div class="artwork-edit">
    <h1>Edit Artwork</h1>
    <form v-if="formData" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Title</label>
        <input v-model="formData.title" type="text" required>
      </div>
      <div class="form-group">
        <label>Artist</label>
        <input v-model="formData.artist" type="text" required>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea v-model="formData.description" required></textarea>
      </div>
      <div class="form-group">
        <label>Image URL</label>
        <input v-model="formData.imageUrl" type="url" required>
      </div>
      <div class="form-group">
        <label>Year</label>
        <input v-model="formData.year" type="number" required>
      </div>
      <button type="submit">Save Changes</button>
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
  const artwork = await store.dispatch('artwork/fetchArtworkById', route.params.id)
  formData.value = { ...artwork }
})

const handleSubmit = async () => {
  try {
    await store.dispatch('artwork/updateArtwork', {
      id: route.params.id,
      artworkData: formData.value
    })
    router.push('/artworks')
  } catch (error) {
    console.error(error)
  }
}
</script>