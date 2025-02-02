<template>
  <div class="collection-details">
    <div v-if="loading" class="loading-state">
      <LoadingSpinner />
      <p>Loading collection...</p>
    </div>
    <div v-else-if="error" class="error-state">
      <ErrorMessage :message="error" @retry="loadCollection" />
    </div>
    <div v-else-if="collection" class="collection-content">
      <div class="collection-header">
        <div class="header-content">
          <h1>{{ collection.title }}</h1>
          <p class="theme"><strong>Theme:</strong> {{ collection.theme }}</p>
          <p class="description">{{ collection.description }}</p>
        </div>
      </div>
      <div class="artworks-section">
        <div class="filters">
          <div class="search-box">
            <input type="text" v-model="searchQuery" placeholder="Search artworks in collection..." />
          </div>
          <div class="filter-controls">
            <select v-model="selectedStatus">
              <option value="">All Statuses</option>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
            </select>
            <select v-model="selectedStyle">
              <option value="">All Styles</option>
              <option v-for="style in styles" :key="style.id" :value="style.name">
                {{ style.name }}
              </option>
            </select>
          </div>
        </div>
        <div v-if="loading && !filteredArtworks.length" class="loading-state">
          <LoadingSpinner />
          <p>Loading artworks...</p>
        </div>
        <div v-else-if="filteredArtworks.length" class="artworks-container">
          <div class="artwork-grid">
            <ArtworkCard v-for="artwork in filteredArtworks" :key="artwork.id" :artwork="artwork" @view="viewArtwork"
              @edit="editArtwork" @delete="deleteArtwork" />
          </div>
        </div>
        <div v-else class="empty-state">
          <p>No artworks found in this collection.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import ArtworkCard from '@/components/artworks/ArtworkCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const route = useRoute()
const router = useRouter()
const store = useStore()

const searchQuery = ref('')
const selectedStatus = ref('')
const selectedStyle = ref('')

const collection = computed(() => store.getters['collection/currentCollection'])
const loading = computed(() => store.getters['collection/loading'])
const error = computed(() => store.getters['collection/error'])
const styles = computed(() => store.getters['styles/allStyles'])

const filteredArtworks = computed(() => {
  if (!collection.value?.artworks) return []

  const lowerSearch = searchQuery.value.toLowerCase().trim()
  return collection.value.artworks.filter((artwork) => {
    const matchesSearch =
      !lowerSearch ||
      artwork.title?.toLowerCase().includes(lowerSearch) ||
      artwork.artist?.toLowerCase().includes(lowerSearch)

    const matchesStatus =
      !selectedStatus.value ||
      artwork.status?.toLowerCase().replace(/\s+/g, '_') === selectedStatus.value

    const matchesStyle =
      !selectedStyle.value ||
      artwork.style?.name === selectedStyle.value

    return matchesSearch && matchesStatus && matchesStyle
  })
})

const loadCollection = async () => {
  try {
    await Promise.all([
      store.dispatch('collection/fetchCollectionById', route.params.id),
      store.dispatch('styles/fetchStyles')
    ])
  } catch (err) {
    console.error('Error loading collection:', err)
  }
}

onMounted(loadCollection)

const viewArtwork = (artwork) => {
  router.push(`/artworks/${artwork.id}`)
}

const editArtwork = (artwork) => {
  router.push(`/artworks/${artwork.id}/edit`)
}

const deleteArtwork = async (artwork) => {
  try {
    await store.dispatch('artwork/deleteArtwork', artwork.id)
    await store.dispatch('collection/fetchCollectionById', route.params.id)
  } catch (err) {
    console.error('Error deleting artwork:', err)
  }
}
</script>

<style scoped>
.collection-details {
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
}

.collection-header {
  background: linear-gradient(135deg, #3f51b5, #673ab7);
  color: white;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  text-align: center;
}

.collection-header h1 {
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.collection-header .theme {
  margin: 0.5rem 0;
}

.collection-header .description {
  margin-top: 1rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 200px;
}

.search-box input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.filter-controls {
  display: flex;
  gap: 1rem;
}

.filter-controls select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 150px;
}

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

  .filter-controls {
    flex-direction: column;
    width: 100%;
  }

  .filter-controls select {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .artwork-grid {
    grid-template-columns: 1fr;
  }

  .collection-details {
    padding: 1rem;
  }
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 3rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.artworks-container {
  margin-top: 2rem;
}
</style>