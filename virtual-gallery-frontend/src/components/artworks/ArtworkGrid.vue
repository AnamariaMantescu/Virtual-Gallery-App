<template>
  <div class="artwork-grid">
    <ArtworkCard
      v-for="artwork in artworks"
      :key="artwork.id"
      :artwork="artwork"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
    />
    <AppModal v-model="showDeleteModal" title="Delete Artwork">
      <p>Are you sure you want to delete "{{ selectedArtwork?.title }}"?</p>
      <template #footer>
        <AppButton 
          variant="secondary" 
          @click="showDeleteModal = false"
        >
          Cancel
        </AppButton>
        <AppButton 
          variant="danger" 
          :loading="isDeleting"
          @click="confirmDelete"
        >
          Delete
        </AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import ArtworkCard from './ArtworkCard.vue'
import AppModal from '../common/AppModal.vue'
import AppButton from '../common/AppButton.vue'

const props = defineProps({
  artworks: {
    type: Array,
    required: true
  }
})

const router = useRouter()
const store = useStore()
const showDeleteModal = ref(false)
const selectedArtwork = ref(null)
const isDeleting = ref(false)

const handleView = (artwork) => {
  router.push(`/artworks/${artwork.id}`)
}

const handleEdit = (artwork) => {
  router.push(`/artworks/${artwork.id}/edit`)
}

const handleDelete = (artwork) => {
  selectedArtwork.value = artwork
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!selectedArtwork.value) return
  
  isDeleting.value = true
  try {
    await store.dispatch('artwork/deleteArtwork', selectedArtwork.value.id)
    showDeleteModal.value = false
  } catch (error) {
    console.error('Failed to delete artwork:', error)
  } finally {
    isDeleting.value = false
  }
}
</script>

<style scoped>
.artwork-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Ensures 4 artworks per row */
  gap: 2rem;
  padding: 1rem;
}

@media (max-width: 1024px) {
  .artwork-grid {
    grid-template-columns: repeat(3, 1fr); /* 3 artworks per row on medium screens */
  }
}

@media (max-width: 768px) {
  .artwork-grid {
    grid-template-columns: repeat(2, 1fr); /* 2 artworks per row on small screens */
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .artwork-grid {
    grid-template-columns: 1fr; /* 1 artwork per row on extra small screens */
  }
}
</style>
