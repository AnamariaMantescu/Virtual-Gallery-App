<template>
  <div class="artworks-view">
    <div class="header">
      <div class="header-content">
        <h1 class="title">Virtual Gallery Artworks</h1>
        <p class="subtitle">Explore our collection of unique artworks</p>
      </div>
      <div class="admin-controls">
        <router-link to="/artworks/create" class="create-button">
          Add New Artwork
        </router-link>
      </div>
    </div>
    <div class="filters">
      <div class="search-box">
        <input type="text" v-model="searchQuery" placeholder="Search artworks..." />
      </div>
      <div class="filter-controls">
        <select v-if="isAdmin" v-model="selectedApprovalStatus" class="filter-select">
          <option value="">All Approval Status</option>
          <option value="approved">Approved</option>
          <option value="unapproved">Unapproved</option>
        </select>
        <select v-model="selectedStatus" class="filter-select">
          <option value="">All Statuses</option>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="sold">Sold</option>
        </select>

        <select v-model="selectedStyle" class="filter-select">
          <option value="">All Styles</option>
          <option v-for="style in styles" :key="style.id" :value="style.name">
            {{ style.name }}
          </option>
        </select>

        <select v-model="selectedMedium" class="filter-select">
          <option value="">All Mediums</option>
          <option v-for="medium in uniqueMediums" :key="medium" :value="medium">
            {{ medium }}
          </option>
        </select>

        <select v-model="selectedYear" class="filter-select">
          <option value="">All Years</option>
          <option v-for="year in uniqueYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>

        <select v-model="selectedSize" class="filter-select">
          <option value="">All Sizes</option>
          <option v-for="size in uniqueSizes" :key="size" :value="size">
            {{ size }}
          </option>
        </select>

        <button @click="resetFilters" class="reset-button">
          Reset Filters
        </button>
      </div>
    </div>

    <div v-if="loading && !artworks.length" class="loading-state">
      <LoadingSpinner />
      <p>Loading artworks...</p>
    </div>
    <div v-else>
      <div v-if="error" class="error-state">
        <ErrorMessage :message="error" @retry="loadArtworks(false)" />
      </div>
      <div v-else class="artworks-container">
        <ArtworkGrid :artworks="filteredArtworks" @view="viewArtwork" @edit="editArtwork" @delete="deleteArtwork" />
      </div>
      <div v-if="loading && artworks.length" class="infinite-loading">
        <LoadingSpinner />
      </div>
    </div>
    <div ref="infiniteScrollSentinel" class="scroll-sentinel"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import ArtworkGrid from '@/components/artworks/ArtworkGrid.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import ErrorMessage from '@/components/common/ErrorMessage.vue';


const searchQuery = ref('');
const selectedStatus = ref('');
const selectedStyle = ref('');
const selectedMedium = ref('');
const selectedYear = ref('');
const selectedSize = ref('');
const selectedApprovalStatus = ref('');


const pagination = ref({
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  limit: 12
});


const artworks = ref([]);

const store = useStore();
const router = useRouter();

const error = ref(null);
const loading = ref(false);

const isAdmin = computed(() => store.getters['auth/isAdmin']);
const styles = computed(() => store.getters['styles/allStyles']);

const uniqueMediums = computed(() => {
  const mediums = new Set(artworks.value.map(artwork => artwork.medium));
  return Array.from(mediums).filter(medium => medium);
});

const uniqueYears = computed(() => {
  const years = new Set(artworks.value.map(artwork => artwork.year));
  return Array.from(years).filter(year => year).sort((a, b) => b - a);
});

const uniqueSizes = computed(() => {
  const sizes = new Set(artworks.value.map(artwork => {
    const { height, width } = artwork.dimensions || {};
    if (height && width) {
      if (height <= 50 && width <= 50) return 'Small (≤50cm)';
      if (height <= 100 && width <= 100) return 'Medium (51-100cm)';
      return 'Large (>100cm)';
    }
    return null;
  }));
  return Array.from(sizes).filter(size => size);
});

const infiniteScrollSentinel = ref(null);
let observer = null;


const loadArtworks = async (append = false) => {
  try {
    loading.value = true;
    const response = await store.dispatch('artwork/fetchArtworks', {
      page: pagination.value.currentPage,
      limit: pagination.value.limit
    });

    pagination.value.currentPage = response.currentPage;
    pagination.value.totalPages = response.totalPages;
    pagination.value.totalItems = response.totalItems;

    if (append) {
      artworks.value = [...artworks.value, ...response.data];
    } else {
      artworks.value = response.data;
    }
  } catch (err) {
    console.error('Error loading artworks:', err);
    error.value = err.message || 'Failed to load artworks.';
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    await store.dispatch('styles/fetchStyles');
    await loadArtworks();
  } catch (err) {
    console.error('Initialization error:', err);
  }

  observer = new IntersectionObserver(handleIntersection, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  });
  if (infiniteScrollSentinel.value) {
    observer.observe(infiniteScrollSentinel.value);
  }
});

onBeforeUnmount(() => {
  if (observer && infiniteScrollSentinel.value) {
    observer.unobserve(infiniteScrollSentinel.value);
  }
});

const handleIntersection = (entries) => {
  const [entry] = entries;
  if (entry.isIntersecting && !loading.value) {
    if (pagination.value.currentPage < pagination.value.totalPages) {
      pagination.value.currentPage++;
      loadArtworks(true);
    }
  }
};

const filteredArtworks = computed(() => {
  const lowerSearch = searchQuery.value.toLowerCase().trim();
  return artworks.value.filter((artwork) => {
    const matchesSearch =
      !lowerSearch ||
      artwork.title?.toLowerCase().includes(lowerSearch) ||
      artwork.artist?.toLowerCase().includes(lowerSearch);

    const matchesStatus =
      !selectedStatus.value ||
      artwork.status?.toLowerCase().replace(/\s+/g, '_') === selectedStatus.value;

    const matchesStyle =
      !selectedStyle.value ||
      artwork.style?.name === selectedStyle.value;

    const matchesMedium =
      !selectedMedium.value ||
      artwork.medium === selectedMedium.value;

    const matchesYear =
      !selectedYear.value ||
      artwork.year === selectedYear.value;

    const matchesSize = !selectedSize.value || (() => {
      const { height, width } = artwork.dimensions || {};
      if (!height || !width) return false;

      switch (selectedSize.value) {
        case 'Small (≤50cm)':
          return height <= 50 && width <= 50;
        case 'Medium (51-100cm)':
          return height <= 100 && width <= 100 && (height > 50 || width > 50);
        case 'Large (>100cm)':
          return height > 100 || width > 100;
        default:
          return true;
      }
    })();

    const matchesApproval =
      !selectedApprovalStatus.value ||
      (selectedApprovalStatus.value === 'approved' ? artwork.isApproved : !artwork.isApproved);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesStyle &&
      matchesMedium &&
      matchesYear &&
      matchesSize &&
      matchesApproval
    );
  });
});

const resetFilters = () => {
  searchQuery.value = '';
  selectedStatus.value = '';
  selectedStyle.value = '';
  selectedMedium.value = '';
  selectedYear.value = '';
  selectedSize.value = '';
  selectedApprovalStatus.value = '';
};

const viewArtwork = (artwork) => {
  router.push(`/artworks/${artwork.id}`);
};

const editArtwork = (artwork) => {
  router.push(`/artworks/${artwork.id}/edit`);
};

const deleteArtwork = async (artwork) => {
  try {
    await store.dispatch('artwork/deleteArtwork', artwork.id);
  } catch (err) {
    console.error('Error deleting artwork:', err);
  }
};
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
  background-color: #4caf50;
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
  flex-wrap: wrap;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 150px;
  background-color: white;
}

.reset-button {
  padding: 0.5rem 1rem;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.reset-button:hover {
  background-color: #e0e0e0;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 3rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.artworks-container {
  display: block;
}

.infinite-loading {
  text-align: center;
  padding: 1rem 0;
}

.scroll-sentinel {
  width: 100%;
  height: 1px;
  background: transparent;
}
</style>