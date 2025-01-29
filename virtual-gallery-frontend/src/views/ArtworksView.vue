<template>
  <div class="artworks-view">
    <!-- Header Section -->
    <div class="header">
      <div class="header-content">
        <h1 class="title">Virtual Gallery Artworks</h1>
        <p class="subtitle">Explore our collection of unique artworks</p>
      </div>

      <!-- Admin Controls -->
      <div v-if="isAdmin" class="admin-controls">
        <router-link to="/artworks/create" class="create-button">
          Add New Artwork
        </router-link>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="filters">
      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search artworks..."
          @input="handleSearch"
        />
      </div>

      <div class="filter-controls">
        <select v-model="selectedCategory" @change="handleFilter">
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>

        <select v-model="selectedStatus" @change="handleFilter">
          <option value="">All Statuses</option>
          <option value="available">Available</option>
          <option value="on_loan">On Loan</option>
          <option value="sold">Sold</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <LoadingSpinner />
      <p>Loading artworks...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <ErrorMessage :message="error" @retry="loadArtworks" />
    </div>

    <!-- Empty State -->
    <div v-else-if="!filteredArtworks.length" class="empty-state">
      <p>No artworks found matching your criteria</p>
      <button @click="resetFilters" class="reset-button">Reset Filters</button>
    </div>

    <!-- Artworks Grid -->
    <div v-else class="artworks-container">
      <ArtworkGrid
        :artworks="filteredArtworks"
        @view="viewArtwork"
        @edit="editArtwork"
        @delete="deleteArtwork"
      />

      <!-- Pagination Controls -->
      <div v-if="pagination.totalPages > 1" class="pagination">
        <button
          :disabled="pagination.currentPage === 1"
          @click="loadPage(pagination.currentPage - 1)"
          class="pagination-button"
        >
          Previous
        </button>
        <span class="pagination-info">
          Page {{ pagination.currentPage }} of {{ pagination.totalPages }}
        </span>
        <button
          :disabled="pagination.currentPage === pagination.totalPages"
          @click="loadPage(pagination.currentPage + 1)"
          class="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import ArtworkGrid from '@/components/artworks/ArtworkGrid.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import ErrorMessage from '@/components/common/ErrorMessage.vue';

const store = useStore();
const router = useRouter();

// State
const searchQuery = ref('');
const selectedCategory = ref('');
const selectedStatus = ref('');
const page = ref(1);
const limit = ref(12);

// Computed Properties
const loading = computed(() => store.getters['artwork/loading']);
const error = computed(() => store.getters['artwork/error']);
const allArtworks = computed(() => store.getters['artwork/visibleArtworks']);
const isAdmin = computed(() => store.getters['auth/isAdmin']);
const pagination = computed(() => store.getters['artwork/pagination']);

// Categories computation
const categories = computed(() => {
  const uniqueCategories = new Set(
    allArtworks.value.map((artwork) => artwork.category?.name).filter(Boolean)
  );
  return Array.from(uniqueCategories);
});

// Filtered Artworks
const filteredArtworks = computed(() => {
  return allArtworks.value.filter((artwork) => {
    const matchesSearch =
      !searchQuery.value ||
      artwork.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      artwork.artist.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesCategory =
      !selectedCategory.value || artwork.category?.name === selectedCategory.value;

    const matchesStatus =
      !selectedStatus.value || artwork.status === selectedStatus.value;

    return matchesSearch && matchesCategory && matchesStatus;
  });
});

// Methods
const loadArtworks = async () => {
  try {
    await store.dispatch('artwork/fetchArtworks', {
      page: page.value,
      limit: limit.value
    });
  } catch (error) {
    console.error('Failed to load artworks:', error);
  }
};

const loadPage = async (pageNumber) => {
  page.value = pageNumber;
  await loadArtworks();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleSearch = () => {
  page.value = 1;
  loadArtworks();
};

const handleFilter = () => {
  page.value = 1;
  loadArtworks();
};

const resetFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = '';
  selectedStatus.value = '';
  page.value = 1;
  loadArtworks();
};

const viewArtwork = (artwork) => {
  router.push(`/artworks/${artwork.id}`);
};

const editArtwork = (artwork) => {
  if (isAdmin.value) {
    router.push(`/artworks/${artwork.id}/edit`);
  }
};

const deleteArtwork = async (artwork) => {
  if (!isAdmin.value) return;
  
  if (confirm('Are you sure you want to delete this artwork?')) {
    try {
      await store.dispatch('artwork/deleteArtwork', artwork.id);
      await loadArtworks();
    } catch (error) {
      console.error('Failed to delete artwork:', error);
    }
  }
};

// Initial Load
onMounted(() => {
  loadArtworks();
});
</script>

<style scoped>
.artworks-view {
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-content .title {
  font-size: 2rem;
  margin: 0;
}

.header-content .subtitle {
  color: #666;
  margin: 0.5rem 0 0;
}

.create-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.create-button:hover {
  background-color: #45a049;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 200px;
}

.search-box input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.filter-controls {
  display: flex;
  gap: 1rem;
}

.filter-controls select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 150px;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 3rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination-button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-button:not(:disabled):hover {
  background-color: #f5f5f5;
}

.pagination-info {
  color: #666;
}

.reset-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.reset-button:hover {
  background-color: #e8e8e8;
}
</style>