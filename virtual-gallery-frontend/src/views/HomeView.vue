<template>
  <main class="home">
    <section class="hero">
      <h1>Welcome to Virtual Gallery</h1>
      <p>Explore our digital exhibitions and discover amazing artworks</p>
    </section>

    <section class="featured-exhibitions" v-if="exhibitions.length">
      <h2>Featured Exhibitions</h2>
      <div class="exhibitions-grid">
        <div v-for="exhibition in exhibitions" :key="exhibition.id" class="exhibition-card">
          <h3>{{ exhibition.title }}</h3>
          <p>{{ exhibition.description }}</p>
          <router-link :to="`/exhibitions/${exhibition.id}`" class="view-button">
            View Exhibition
          </router-link>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const exhibitions = ref([])

onMounted(() => {

  exhibitions.value = []
})
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.hero {
  text-align: center;
  padding: 4rem 0;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
  color: #666;
}

.featured-exhibitions {
  margin-top: 4rem;
}

.featured-exhibitions h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
}

.exhibitions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.exhibition-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.2s;
}

.exhibition-card:hover {
  transform: translateY(-5px);
}

.exhibition-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.exhibition-card p {
  color: #666;
  margin-bottom: 1rem;
}

.view-button {
  display: inline-block;
  background-color: #4CAF50;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.2s;
}

.view-button:hover {
  background-color: #45a049;
}
</style>