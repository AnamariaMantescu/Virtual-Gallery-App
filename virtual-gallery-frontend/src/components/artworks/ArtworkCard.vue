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
  import { ref } from 'vue'
  import { useStore } from 'vuex'
  import AppButton from '../common/AppButton.vue'
  
  const store = useStore()
  const props = defineProps({
    artwork: {
      type: Object,
      required: true
    }
  })
  
  const isAdmin = computed(() => store.getters['auth/isAdmin'])
  const fallbackImage = '/images/artwork-placeholder.jpg'
  
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
  }
  
  .artwork-card:hover {
    transform: translateY(-4px);
  }
  
  .artwork-image {
    position: relative;
    aspect-ratio: 3/2;
    overflow: hidden;
  }
  
  .artwork-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
    transition: opacity 0.2s ease;
  }
  
  .artwork-image:hover .artwork-overlay {
    opacity: 1;
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
  