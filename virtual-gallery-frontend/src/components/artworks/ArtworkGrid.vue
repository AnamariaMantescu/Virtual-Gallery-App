<template>
  <div class="artwork-grid">
    <div v-for="artwork in artworks" :key="artwork.id" class="artwork-item">
      <img :src="artwork.imageUrl" :alt="artwork.title">
      <h4>{{ artwork.title }}</h4>
      <p>{{ artwork.artist }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  artworks: {
    type: Array,
    required: true
  }
})
</script>