<template>
  <main class="home">
    <section class="first">
      <div class="first-content">
        <h1 class="first-title">Welcome to the Virtual Gallery</h1>
        <p class="first-subtitle">Discover a world of art from the comfort of your home</p>
        <router-link to="/artworks" class="explore-button">Explore Artworks</router-link>
      </div>
    </section>
    <section class="coming-soon-collections">
      <h2>Coming Soon Collections</h2>
      <div v-if="comingSoonCollections.length" class="collection-grid">
        <div v-for="collection in comingSoonCollections" :key="collection.id" class="collection-card empty-collection">
          <div class="collection-image">
            <div class="collection-title-overlay">
              <h2>{{ collection.title }}</h2>
            </div>
            <div class="coming-soon">Coming Soon</div>
          </div>
          <div class="collection-info">
            <h3>{{ collection.title }}</h3>
            <p>{{ collection.theme }}</p>
          </div>
        </div>
      </div>
      <p v-else class="no-coming-soon">No coming soon collections at the moment.</p>
    </section>
    <section class="latest-artworks">
      <h2>Latest Artworks</h2>
      <ArtworkGrid :artworks="latestArtworks" />
    </section>
  </main>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import ArtworkGrid from '@/components/artworks/ArtworkGrid.vue'

const store = useStore()
const latestArtworks = ref([])
const fallbackImage = 'https://placehold.co/600x400?text=Collection'

onMounted(async () => {
  try {
    await store.dispatch('artwork/fetchArtworks')
    await store.dispatch('collection/fetchCollections')

    latestArtworks.value = store.getters['artwork/allArtworks'].slice(0, 8)
  } catch (error) {
    console.error('Failed to load homepage data:', error)
  }
})

const comingSoonCollections = computed(() => {
  return store.getters['collection/allCollections'].filter(collection => collection.artworks?.length === 0)
})
</script>


<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.first {
  background-image: linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)), url('@/assets/anamaria_17370_a_virtual_gallery_idea_--ar_43_--v_6.1_94502e28-15cd-42d0-96a8-62e1167f2729_3.png');
  background-size: cover;
  background-position: center;
  text-align: center;
  padding: 6rem 0;
  color: white;
  border-radius: 12px;
}

.first-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.first-subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.explore-button {
  display: inline-block;
  background-color: #4CAF50;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-size: 1.2rem;
}

.explore-button:hover {
  background-color: #45a049;
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.collection-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.collection-image {
  position: relative;
  height: 200px;
  background-size: cover;
  background-position: center;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.collection-image:hover .overlay {
  opacity: 1;
}

.view-btn {
  background-color: white;
  color: black;
  padding: 10px 15px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
}

.view-btn:hover {
  background-color: #ddd;
}

.collection-info {
  padding: 1rem;
  text-align: center;
}

@media (max-width: 768px) {
  .first {
    padding: 4rem 1rem;
  }

  .first-title {
    font-size: 2rem;
  }

  .first-subtitle {
    font-size: 1rem;
  }
}

.coming-soon-collections h2 {
  text-align: center;
  margin: 2rem 0;
  font-size: 1.8rem;
  color: #444;
}

.no-coming-soon {
  text-align: center;
  font-size: 1.1rem;
  color: #666;
  font-style: italic;
  margin-top: 1rem;
}

.empty-collection {
  background: white;
  transition: all 0.3s ease;
}

.empty-collection .collection-image {
  background: linear-gradient(135deg, #e6f3ff, #cce4ff);
  min-height: 150px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.coming-soon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  transform: none;
  background: rgba(255, 255, 255, 0.95);
  color: #495057;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid #e9ecef;
  backdrop-filter: blur(5px);
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  line-height: 1;
}

.coming-soon::before {
  content: '🎨';
  font-size: 1rem;
}

.empty-collection:hover .coming-soon {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.latest-artworks h2 {
  margin-top: 2rem;
}
</style>
