<template>
  <div class="artwork-create">
    <h1>Add New Artwork</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Title</label>
        <input v-model="formData.title" type="text" id="title" required :class="{ 'input-error': errors.title }" />
        <span v-if="errors.title" class="error-text">{{ errors.title }}</span>
      </div>

      <div class="form-group">
        <label for="artist">Artist</label>
        <input v-model="formData.artist" type="text" id="artist" required :class="{ 'input-error': errors.artist }" />
        <span v-if="errors.artist" class="error-text">{{ errors.artist }}</span>
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea v-model="formData.description" id="description" required
          :class="{ 'input-error': errors.description }"></textarea>
        <span v-if="errors.description" class="error-text">{{ errors.description }}</span>
      </div>

      <div class="form-group">
        <label for="imageUrl">Image URL</label>
        <input v-model="formData.imageUrl" type="url" id="imageUrl" required
          :class="{ 'input-error': errors.imageUrl }" />
        <span v-if="errors.imageUrl" class="error-text">{{ errors.imageUrl }}</span>
      </div>

      <div class="form-group">
        <label for="year">Year</label>
        <input v-model="formData.year" type="number" id="year" required :class="{ 'input-error': errors.year }" />
        <span v-if="errors.year" class="error-text">{{ errors.year }}</span>
      </div>

      <div class="form-group">
        <label for="style">Style</label>
        <select v-model="formData.styleId" id="style" required :class="{ 'input-error': errors.style }">
          <option value="">Select a style</option>
          <option v-for="style in styles" :key="style.id" :value="style.id">
            {{ style.name }}
          </option>
        </select>
        <span v-if="errors.style" class="error-text">{{ errors.style }}</span>
      </div>

      <div class="form-group">
        <label for="medium">Medium</label>
        <input v-model="formData.medium" type="text" id="medium" required :class="{ 'input-error': errors.medium }" />
        <span v-if="errors.medium" class="error-text">{{ errors.medium }}</span>
      </div>

      <div class="form-group">
        <label>Dimensions</label>
        <div class="dimensions-group">
          <div>
            <label for="height">Height (cm)</label>
            <input v-model="formData.dimensions.height" type="number" id="height" min="0" required
              :class="{ 'input-error': errors.dimensions?.height }" />
            <span v-if="errors.dimensions?.height" class="error-text">{{ errors.dimensions.height }}</span>
          </div>
          <div>
            <label for="width">Width (cm)</label>
            <input v-model="formData.dimensions.width" type="number" id="width" min="0" required
              :class="{ 'input-error': errors.dimensions?.width }" />
            <span v-if="errors.dimensions?.width" class="error-text">{{ errors.dimensions.width }}</span>
          </div>
          <div>
            <label for="depth">Depth (cm)</label>
            <input v-model="formData.dimensions.depth" type="number" id="depth" min="0"
              :class="{ 'input-error': errors.dimensions?.depth }" />
            <span v-if="errors.dimensions?.depth" class="error-text">{{ errors.dimensions.depth }}</span>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label for="status">Status</label>
        <select v-model="formData.status" id="status" required :class="{ 'input-error': errors.status }">
          <option value="">Select a status</option>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="sold">Sold</option>
        </select>
        <span v-if="errors.status" class="error-text">{{ errors.status }}</span>
      </div>

      <label for="collection">Collection</label>
      <select v-model="formData.collectionId" id="collection" required>
        <option value="">Select Collection</option>
        <option v-for="collection in allCollections" :key="collection.id" :value="collection.id">
          {{ collection.title }}
        </option>
      </select>

      <div class="form-actions">
        <button type="submit" class="btn-submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Creating...' : 'Create Artwork' }}
        </button>
      </div>

      <div v-if="serverError" class="server-error">
        {{ serverError }}
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
  artist: '',
  description: '',
  imageUrl: '',
  year: new Date().getFullYear(),
  styleId: '',
  status: '',
  medium: '',
  dimensions: {
    height: '',
    width: '',
    depth: ''
  },
  collectionId: ''
})

const styles = ref([])
const allCollections = ref([])

const errors = ref({})
const serverError = ref(null)
const isSubmitting = ref(false)


onMounted(async () => {
  try {
    await Promise.all([
      store.dispatch('styles/fetchStyles'),
      store.dispatch('collection/fetchCollections')
    ])

    styles.value = store.getters['styles/allStyles']
    allCollections.value = store.getters['collection/allCollections']
  } catch (error) {
    console.error('Failed to fetch data:', error)
    serverError.value = 'Failed to load required data. Please try again later.'
  }
})

const validateForm = () => {
  errors.value = {}
  let isValid = true

  if (!formData.value.title || formData.value.title.length < 3) {
    errors.value.title = 'Title must be at least 3 characters long'
    isValid = false
  }

  if (!formData.value.artist || formData.value.artist.length < 3) {
    errors.value.artist = 'Artist name must be at least 3 characters long'
    isValid = false
  }

  if (!formData.value.description || formData.value.description.length < 10) {
    errors.value.description = 'Description must be at least 10 characters long'
    isValid = false
  }

  const currentYear = new Date().getFullYear()
  if (
    !formData.value.year ||
    formData.value.year < 1000 ||
    formData.value.year > currentYear
  ) {
    errors.value.year = `Year must be between 1000 and ${currentYear}`
    isValid = false
  }

  if (!formData.value.imageUrl) {
    errors.value.imageUrl = 'Image URL is required'
    isValid = false
  }

  if (!formData.value.styleId) {
    errors.value.style = 'Please select a style'
    isValid = false
  }

  if (!formData.value.medium) {
    errors.value.medium = 'Medium is required'
    isValid = false
  }

  const { height, width, depth } = formData.value.dimensions
  if (!height || height <= 0) {
    errors.value.dimensions = errors.value.dimensions || {}
    errors.value.dimensions.height = 'Height must be a positive number'
    isValid = false
  }

  if (!width || width <= 0) {
    errors.value.dimensions = errors.value.dimensions || {}
    errors.value.dimensions.width = 'Width must be a positive number'
    isValid = false
  }

  if (depth !== '' && depth < 0) {
    errors.value.dimensions = errors.value.dimensions || {}
    errors.value.dimensions.depth = 'Depth cannot be negative'
    isValid = false
  }

  if (!formData.value.status) {
    errors.value.status = 'Please select a status'
    isValid = false
  }
  if (!formData.value.collectionId) {
    errors.value.collectionId = 'Please select a collection'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return
  isSubmitting.value = true
  serverError.value = null

  try {
    const selectedStyle = styles.value.find(s => s.id === formData.value.styleId)

    if (!selectedStyle) {
      throw new Error('Selected style is invalid')
    }

    const artworkData = {
      title: formData.value.title,
      artist: formData.value.artist,
      description: formData.value.description,
      imageUrl: formData.value.imageUrl,
      year: formData.value.year,
      style: {
        id: selectedStyle.id,
        name: selectedStyle.name
      },
      status: formData.value.status,
      medium: formData.value.medium,
      dimensions: {
        height: formData.value.dimensions.height,
        width: formData.value.dimensions.width,
        depth: formData.value.dimensions.depth || null
      },
      collectionId: formData.value.collectionId
    }

    await store.dispatch('artwork/createArtwork', artworkData)
    router.push('/artworks')
  } catch (error) {
    console.error('Failed to create artwork:', error)
    serverError.value = error.message || 'An error occurred while creating the artwork'
  } finally {
    isSubmitting.value = false
  }
}
</script>


<style scoped>
.artwork-create {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input,
textarea,
select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.input-error {
  border-color: #dc3545;
}

.error-text {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.server-error {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  color: #721c24;
}

.form-actions {
  margin-top: 2rem;
}

.btn-submit {
  padding: 0.75rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
}

.btn-submit:hover {
  background-color: #45a049;
}

.btn-submit:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
