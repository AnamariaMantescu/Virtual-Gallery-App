<template>
  <div class="artwork-card">
    <div class="artwork-image">
      <img :src="artwork.imageUrl" :alt="artwork.title" @error="handleImageError">
      <div class="artwork-overlay">
        <AppButton variant="primary" @click="$emit('view', artwork)">View Details</AppButton>
      </div>
    </div>
    <div class="artwork-info">
      <h3 class="artwork-title">{{ artwork.title }}</h3>
      <p class="artwork-artist">{{ artwork.artist }}</p>
      <p class="artwork-year">{{ artwork.year }}</p>
      <div class="artwork-actions" v-if="isAdmin">
        <AppButton 
          variant="secondary" 
          size="small"
          @click="$emit('edit', artwork)"
        >
          Edit
        </AppButton>
        <AppButton 
          variant="danger" 
          size="small"
          @click="$emit('delete', artwork)"
        >
          Delete
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import AppButton from '../common/AppButton.vue'
import { ref, computed } from 'vue'

const store = useStore()
const props = defineProps({
  artwork: {
    type: Object,
    required: true
  }
})

const isAdmin = computed(() => store.getters['auth/isAdmin'])
const fallbackImage = 'https://placehold.co/600x400?text=Artwork' 

const handleImageError = (e) => {
  e.target.src = fallbackImage
}

defineEmits(['view', 'edit', 'delete'])
</script>

<style scoped>
.artwork-card {
background: white;
border-radius: 8px;
overflow: hidden;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
transition: transform 0.2s ease;
height: 100%; /* Add this */
}

.artwork-image {
position: relative;
aspect-ratio: 3/2;
overflow: hidden;
background: #f5f5f5; /* Add this as placeholder background */
}

.artwork-image img {
width: 100%;
height: 100%;
object-fit: cover;
position: relative; /* Add this */
z-index: 1; /* Add this */
}

.artwork-overlay {
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
z-index: 2; /* Add this */
pointer-events: none; /* Add this */
}

.artwork-image:hover .artwork-overlay {
opacity: 1;
pointer-events: auto; /* Add this */
}

.artwork-info {
  padding: 1rem;
}

.artwork-title {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
}

.artwork-artist {
  color: #666;
  margin: 0 0 0.25rem;
}

.artwork-year {
  color: #888;
  font-size: 0.875rem;
  margin: 0;
}

.artwork-actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}
</style>