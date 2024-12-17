<template>
  <div class="exhibition-card">
    <img :src="exhibition.coverImage" :alt="exhibition.title">
    <div class="card-content">
      <h3>{{ exhibition.title }}</h3>
      <p>{{ exhibition.description }}</p>
      <div class="dates">
        <span>{{ formatDate(exhibition.startDate) }}</span>
        <span>-</span>
        <span>{{ formatDate(exhibition.endDate) }}</span>
      </div>
      <router-link 
        :to="{ name: 'exhibition-details', params: { id: exhibition.id }}"
        class="view-more"
      >
        View Details
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  exhibition: {
    type: Object,
    required: true
  }
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}
</script>