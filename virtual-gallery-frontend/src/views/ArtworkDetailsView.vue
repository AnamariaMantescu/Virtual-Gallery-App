<template>
  <div class="artwork-detail-view">
    <div v-if="loading" class="state-container">
      <p>Loading artwork details...</p>
    </div>

    <div v-else-if="error" class="state-container">
      <p class="error-text">{{ error }}</p>
      <button @click="retryFetch" class="btn">Retry</button>
    </div>

    <div v-else-if="artwork" class="artwork-container">
      <ArtworkDetails :artwork="artwork" @edit="editArtwork" @delete="deleteArtwork" />
    </div>

    <div v-else class="state-container">
      <p>Artwork not found.</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import ArtworkDetails from '@/components/artworks/ArtworkDetails.vue';

const store = useStore();
const route = useRoute();
const router = useRouter();

const loading = computed(() => store.state.artwork.loading);
const error = computed(() => store.state.artwork.error);
const artwork = computed(() => store.state.artwork.currentArtwork);

onMounted(async () => {
  try {
    await store.dispatch('artwork/fetchArtworkById', route.params.id);
  } catch (err) {
    console.error('Failed to load artwork details:', err);
  }
});

function retryFetch() {
  store.dispatch('artwork/fetchArtworkById', route.params.id).catch(err =>
    console.error('Retry fetch error:', err)
  );
}

function editArtwork() {
  router.push(`/artworks/${artwork.value.id}/edit`);
}

async function deleteArtwork() {
  try {
    await store.dispatch('artwork/deleteArtwork', artwork.value.id);
    router.push('/artworks');
  } catch (err) {
    console.error('Failed to delete artwork:', err);
  }
}
</script>

<style scoped>
.artwork-detail-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background-color: #fdfdfd;
}

.state-container {
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.error-text {
  color: #e74c3c;
  margin-bottom: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #2980b9;
}

.artwork-container {
  width: 100%;
  padding: 0;
  margin: 0;
}
</style>