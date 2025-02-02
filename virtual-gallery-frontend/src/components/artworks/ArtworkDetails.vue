<template>
  <div class="artwork-details">
    <div class="background"
      :style="{ backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 1)), url(${artwork.imageUrl || fallbackImage})` }">
      <div class="overlay">
        <h1 class="title">{{ artwork.title }}</h1>
      </div>
    </div>

    <div class="info-container">
      <div class="info">
        <h2>{{ artwork.artist }}</h2>
        <p><strong>Year:</strong> {{ artwork.year }}</p>
        <p><strong>Medium:</strong> {{ artwork.medium }}</p>
        <p><strong>Style:</strong> {{ artwork.style?.name || 'Unknown' }}</p>
        <p><strong>Status:</strong> <span :class="['status', artwork.status]">{{ artwork.status }}</span></p>

        <div class="dimensions">
          <h3>Dimensions</h3>
          <p><strong>Height:</strong> {{ artwork.dimensions?.height || 'N/A' }} cm</p>
          <p><strong>Width:</strong> {{ artwork.dimensions?.width || 'N/A' }} cm</p>
          <p><strong>Depth:</strong> {{ artwork.dimensions?.depth || 'N/A' }} cm</p>
        </div>

        <div class="description">
          <h3>Description</h3>
          <p>{{ artwork.description || 'No description available.' }}</p>
        </div>
      </div>
    </div>

    <div class="wall-preview">
      <div class="frame">
        <div class="frame-inner">
          <img :src="artwork.imageUrl || fallbackImage" :alt="artwork.title" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  artwork: {
    type: Object,
    required: true,
  },
});

const fallbackImage = 'https://placehold.co/600x400?text=Artwork';

function formatDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
</script>

<style scoped>
.background {
  position: relative;
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  color: #fff;
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.7);
}

.status {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: bold;
  color: #ffffff;
}

.status.available {
  background-color: #2ecc71;
}

.status.sold {
  background-color: #e74c3c;
}

.status.reserved {
  background-color: #f39c12;
}

.info-container {
  padding: 2rem;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  border-radius: 15px;
  position: relative;
}

.info h2 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.info p {
  margin: 0.5rem 0;
  line-height: 1.6;
  color: #555555;
}

.dimensions,
.description {
  margin-top: 1.5rem;
  text-align: center;
}

h3 {
  font-size: 1.5rem;
  color: #34495e;
  margin-bottom: 1rem;
}

.wall-preview {
  text-align: center;
}

.frame {
  display: inline-block;
  position: relative;
  padding: 20px;
  background-color: black;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3), 0 2px 5px rgba(0, 0, 0, 0.1);
}

.frame-inner {
  background: #ffffff;
  padding: 10px;
  box-shadow: inset 0 4px 6px rgba(0, 0, 0, 0.1), inset 0 -4px 6px rgba(0, 0, 0, 0.1);
}

.frame-inner img {
  display: block;
  width: 100%;
  max-width: 500px;
  height: auto;
}
</style>
