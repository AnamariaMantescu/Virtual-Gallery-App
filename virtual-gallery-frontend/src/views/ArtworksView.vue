<template>
  <div class="artworks-page">
    <h1>Artworks</h1>
    <LoadingSpinner v-if="loading" message="Loading artworks..." />
    <ErrorMessage 
      v-else-if="error" 
      :message="error"
      :retryAction="loadArtworks" 
    />
    <div v-else class="grid grid-cols-3">
      <ArtworkCard 
        v-for="artwork in artworks" 
        :key="artwork.id" 
        :artwork="artwork"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import ArtworkGrid from '../components/artworks/ArtworkGrid.vue'

const store = useStore()
const artworks = computed(() => store.getters['artwork/allArtworks'])
const loading = computed(() => store.getters['artwork/loading'])
const error = computed(() => store.getters['artwork/error'])

onMounted(async () => {
  await store.dispatch('artwork/fetchArtworks')
})
</script>