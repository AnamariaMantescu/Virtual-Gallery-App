<template>
  <div class="exhibitions-page">
    <h1>Exhibitions</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="exhibitions-grid">
      <exhibition-card 
        v-for="exhibition in exhibitions" 
        :key="exhibition.id" 
        :exhibition="exhibition"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import ExhibitionCard from '../components/exhibitions/ExhibitionCard.vue'

const store = useStore()

const exhibitions = computed(() => store.getters['exhibition/allExhibitions'])
const loading = computed(() => store.getters['exhibition/isLoading'])
const error = computed(() => store.getters['exhibition/error'])

onMounted(() => {
  store.dispatch('exhibition/fetchExhibitions')
})
</script>