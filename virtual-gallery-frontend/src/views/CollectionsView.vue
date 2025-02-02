<template>
  <div class="collections-page">
    <div class="header">
      <h1>Collections</h1>
      <router-link v-if="isAdmin" to="/collections/create" class="create-btn">
        Create Collection
      </router-link>
    </div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="!collections.length">No collections found.</div>
    <CollectionGrid :collections="collections" @edit="editCollection" @delete="confirmDelete" />
    <AppModal v-model="showDeleteModal" title="Delete Collection">
      <p>Are you sure you want to delete "<strong>{{ selectedCollection?.title }}</strong>"?</p>
      <template #footer>
        <AppButton variant="secondary" @click="showDeleteModal = false">Cancel</AppButton>
        <AppButton variant="danger" :loading="isDeleting" @click="deleteCollection">Delete</AppButton>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import CollectionGrid from '@/components/collections/CollectionGrid.vue'
import AppModal from '@/components/common/AppModal.vue'
import AppButton from '@/components/common/AppButton.vue'

const store = useStore()
const router = useRouter()

const collections = computed(() => store.getters['collection/allCollections'])
const loading = computed(() => store.getters['collection/loading'])
const error = computed(() => store.getters['collection/error'])
const isAdmin = computed(() => store.getters['auth/isAdmin'])

const showDeleteModal = ref(false)
const selectedCollection = ref(null)
const isDeleting = ref(false)

onMounted(() => {
  store.dispatch('collection/fetchCollections')
})

const editCollection = (collection) => {
  router.push(`/collections/${collection.id}/edit`)
}

const confirmDelete = (collection) => {
  selectedCollection.value = collection
  showDeleteModal.value = true
}

const deleteCollection = async () => {
  if (!selectedCollection.value) return
  isDeleting.value = true
  try {
    await store.dispatch('collection/deleteCollection', selectedCollection.value.id)
    showDeleteModal.value = false
  } catch (err) {
    console.error('Error deleting collection:', err)
  } finally {
    isDeleting.value = false
  }
}
</script>

<style scoped>
.collections-page {
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

.create-btn {
  background-color: #4CAF50;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
}
</style>
