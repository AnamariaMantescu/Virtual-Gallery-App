<template>
  <div class="artwork-create">
    <h1>Add New Artwork</h1>
    <form @submit.prevent="handleSubmit">
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
      <button type="submit">Create</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const formData = ref({
  title: '',
  artist: '',
  description: '',
  imageUrl: '',
  year: new Date().getFullYear()
})

const handleSubmit = async () => {
  try {
    await store.dispatch('artwork/createArtwork', formData.value)
    router.push('/artworks')
  } catch (error) {
    console.error(error)
  }
}
</script>