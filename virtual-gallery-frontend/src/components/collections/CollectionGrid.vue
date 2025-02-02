<template>
  <div class="collection-grid">
    <div v-for="collection in sortedCollections" :key="collection.id"
      :class="['collection-card', { 'empty-collection': collection.artworks?.length === 0 }]">
      <div class="collection-image">
        <div class="collection-title-overlay">
          <h2>{{ collection.title }}</h2>
        </div>

        <div v-if="collection.artworks?.length === 0" class="coming-soon">
          Coming Soon
        </div>

        <div class="overlay">
          <router-link :to="`/collections/${collection.id}`" class="view-btn">
            View Collection
          </router-link>
        </div>
      </div>

      <div class="collection-info">
        <p class="collection-theme"><strong>Theme:</strong> {{ collection.theme }}</p>
        <p class="collection-artworks">
          <strong>Artworks:</strong> {{ collection.artworks?.length || 0 }}
        </p>
        <p class="collection-description">
          {{ truncateText(collection.description, 120) }}
        </p>

        <div v-if="isAdmin" class="collection-actions">
          <AppButton variant="secondary" size="small" @click="$emit('edit', collection)">
            Edit
          </AppButton>
          <AppButton variant="danger" size="small" @click="$emit('delete', collection)">
            Delete
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import AppButton from '../common/AppButton.vue'

const store = useStore()

const props = defineProps({
  collections: {
    type: Array,
    required: true
  }
})


const isAdmin = computed(() => store.getters['auth/isAdmin'])

const sortedCollections = computed(() => {
  return [...props.collections].sort((a, b) => {

    const isEmptyA = !a.artworks?.length
    const isEmptyB = !b.artworks?.length

    if (isEmptyA !== isEmptyB) {
      return isEmptyB ? 1 : -1
    }

    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0)
    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0)
    return dateB - dateA
  })
})

defineEmits(['edit', 'delete'])

function truncateText(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}
</script>

<style scoped>
.collection-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  padding: 1rem;
}

@media (max-width: 1024px) {
  .collection-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .collection-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .collection-grid {
    grid-template-columns: 1fr;
  }
}

.collection-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.empty-collection {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
}

.empty-collection .collection-image {
  background: lightblue;
  min-height: 150px;
  position: relative;
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

.collection-card:hover {
  transform: scale(1.02);
}

.collection-image {
  position: relative;
  background: linear-gradient(135deg, #787878, #a5a5a5);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  color: white;
  text-align: center;
  min-height: 108px;
}

.collection-title-overlay h2 {
  color: #fff;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.7);
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

.collection-card:hover .overlay {
  opacity: 1;
}

.collection-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.collection-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 1rem;
}

@media (max-width: 768px) {
  .collection-actions {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .collection-actions {
    gap: 0.25rem;
  }
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

.collection-theme,
.collection-artworks {
  color: #666;
  font-size: 0.9rem;
}

.collection-description {
  font-size: 0.875rem;
  color: #444;
  margin-top: 0.5rem;
}
</style>