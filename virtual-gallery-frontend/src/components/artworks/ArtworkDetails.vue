// src/components/artworks/ArtworkDetail.vue
<template>
  <div class="artwork-detail">
    <div class="artwork-image">
      <img :src="artwork.imageUrl" :alt="artwork.title" @error="handleImageError">
    </div>
    <div class="artwork-content">
      <h1 class="artwork-title">{{ artwork.title }}</h1>
      <div class="artwork-metadata">
        <p class="artwork-artist">
          <strong>Artist:</strong> {{ artwork.artist }}
        </p>
        <p class="artwork-year">
          <strong>Year:</strong> {{ artwork.year }}
        </p>
      </div>
      <div class="artwork-description">
        <h2>Description</h2>
        <p>{{ artwork.description }}</p>
      </div>
      <div class="artwork-actions" v-if="isAdmin">
        <AppButton variant="secondary" @click="$emit('edit')">
          Edit Artwork
        </AppButton>
        <AppButton variant="danger" @click="$emit('delete')">
          Delete Artwork
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import AppButton from '../common/AppButton.vue'

const props = defineProps({
  artwork: {
    type: Object,
    required: true
  }
})

const store = useStore()
const isAdmin = computed(() => store.getters['auth/isAdmin'])
const fallbackImage = '/images/artwork-placeholder.jpg'

const handleImageError = (e) => {
  e.target.src = fallbackImage
}

defineEmits(['edit', 'delete'])
</script>

<style scoped>
.artwork-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.artwork-image {
  position: relative;
  aspect-ratio: 3/2;
  border-radius: 8px;
  overflow: hidden;
}

.artwork-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.artwork-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.artwork-title {
  margin: 0;
  font-size: 2rem;
  color: #333;
}

.artwork-metadata {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.artwork-metadata p {
  margin: 0;
  color: #666;
}

.artwork-description h2 {
  font-size: 1.5rem;
  margin: 0 0 1rem;
}

.artwork-description p {
  margin: 0;
  line-height: 1.6;
  color: #444;
}

.artwork-actions {
  display: flex;
  gap: 1rem;
  margin-top: auto;
}

@media (max-width: 768px) {
  .artwork-detail {
    grid-template-columns: 1fr;
  }
}
</style>