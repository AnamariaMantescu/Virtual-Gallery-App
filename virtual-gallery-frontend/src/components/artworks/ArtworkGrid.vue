<template>
  <div class="artwork-grid">
    <ArtworkCard v-for="artwork in filteredArtworks" :key="artwork.id" :artwork="artwork" @view="handleView"
      @edit="handleEdit" @delete="handleDelete" />
    <AppModal v-model="showDeleteModal" title="Delete Artwork">
      <p>Are you sure you want to delete "{{ selectedArtwork?.title }}"?</p>
      <template #footer>
        <AppButton variant="secondary" @click="showDeleteModal = false">
          Cancel
        </AppButton>
        <AppButton variant="danger" :loading="isDeleting" @click="confirmDelete">
          Delete
        </AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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

const emit = defineEmits(['artworkDeleted'])
const router = useRouter()
const store = useStore()
const showDeleteModal = ref(false)
const selectedArtwork = ref(null)
const isDeleting = ref(false)
const deletedArtworkIds = ref(new Set())

const filteredArtworks = computed(() => {
  return props.artworks.filter(artwork => !deletedArtworkIds.value.has(artwork.id))
})

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
    deletedArtworkIds.value.add(selectedArtwork.value.id)
    emit('artworkDeleted', selectedArtwork.value.id)
    selectedArtwork.value = null
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
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  padding: 1rem;
}

@media (max-width: 1024px) {
  .artwork-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .artwork-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .artwork-grid {
    grid-template-columns: 1fr;
  }
}
</style>