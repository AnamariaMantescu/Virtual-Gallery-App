<template>
  <div class="artwork-create">
    <h1>Submit Artwork Proposal</h1>
    <form @submit.prevent="handleSubmit">
      <!-- Title -->
      <div class="form-group">
        <label for="title">Title</label>
        <input 
          v-model="formData.title" 
          type="text" 
          id="title" 
          required 
          :class="{ 'input-error': errors.title }"
        >
        <span v-if="errors.title" class="error-text">{{ errors.title }}</span>
      </div>

      <!-- Artist -->
      <div class="form-group">
        <label for="artist">Artist</label>
        <input 
          v-model="formData.artist" 
          type="text" 
          id="artist" 
          required 
          :class="{ 'input-error': errors.artist }"
        >
        <span v-if="errors.artist" class="error-text">{{ errors.artist }}</span>
      </div>

      <!-- Description -->
      <div class="form-group">
        <label for="description">Description</label>
        <textarea 
          v-model="formData.description" 
          id="description" 
          required 
          :class="{ 'input-error': errors.description }"
        ></textarea>
        <span v-if="errors.description" class="error-text">{{ errors.description }}</span>
      </div>

      <!-- Image URL -->
      <div class="form-group">
        <label for="imageUrl">Image URL</label>
        <input 
          v-model="formData.imageUrl" 
          type="url" 
          id="imageUrl" 
          required 
          :class="{ 'input-error': errors.imageUrl }"
        >
        <span v-if="errors.imageUrl" class="error-text">{{ errors.imageUrl }}</span>
      </div>

      <!-- Year -->
      <div class="form-group">
        <label for="year">Year</label>
        <input 
          v-model="formData.year" 
          type="number" 
          id="year" 
          required 
          :class="{ 'input-error': errors.year }"
        >
        <span v-if="errors.year" class="error-text">{{ errors.year }}</span>
      </div>

      <!-- Category -->
      <div class="form-group">
        <label for="category">Category</label>
        <select 
          v-model="formData.category" 
          id="category"
          required
          :class="{ 'input-error': errors.category }"
        >
          <option value="">Select a category</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
        <span v-if="errors.category" class="error-text">{{ errors.category }}</span>
      </div>

      <!-- Status -->
      <div class="form-group">
        <label for="status">Status</label>
        <select 
          v-model="formData.status" 
          id="status"
          required
          :class="{ 'input-error': errors.status }"
        >
          <option value="">Select a status</option>
          <option value="available">Available</option>
          <option value="on_loan">On Loan</option>
          <option value="sold">Sold</option>
        </select>
        <span v-if="errors.status" class="error-text">{{ errors.status }}</span>
      </div>

      <!-- Submit Button -->
      <div class="form-actions">
        <button 
          type="submit" 
          class="btn-submit" 
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Submitting...' : 'Submit Proposal' }}
        </button>
      </div>

      <!-- Server Error -->
      <div v-if="serverError" class="server-error">
        {{ serverError }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const formData = ref({
  title: '',
  artist: '',
  description: '',
  imageUrl: '',
  year: new Date().getFullYear(),
  category: '',
  status: '',
});

const errors = ref({});
const serverError = ref(null);
const isSubmitting = ref(false);

const categories = ['Abstract', 'Contemporary', 'Modern', 'Renaissance', 'Baroque', 'Impressionism'];

const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (!formData.value.title || formData.value.title.length < 3) {
    errors.value.title = 'Title must be at least 3 characters long';
    isValid = false;
  }

  if (!formData.value.artist || formData.value.artist.length < 3) {
    errors.value.artist = 'Artist name must be at least 3 characters long';
    isValid = false;
  }

  if (!formData.value.description || formData.value.description.length < 10) {
    errors.value.description = 'Description must be at least 10 characters long';
    isValid = false;
  }

  const currentYear = new Date().getFullYear();
  if (!formData.value.year || formData.value.year < 1000 || formData.value.year > currentYear) {
    errors.value.year = `Year must be between 1000 and ${currentYear}`;
    isValid = false;
  }

  if (!formData.value.imageUrl) {
    errors.value.imageUrl = 'Image URL is required';
    isValid = false;
  }

  if (!formData.value.category) {
    errors.value.category = 'Please select a category';
    isValid = false;
  }

  if (!formData.value.status) {
    errors.value.status = 'Please select a status';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;
  serverError.value = null;

  try {
    await store.dispatch('artwork/createArtwork', {
      ...formData.value,
      isApproved: false, // Submit as a proposal
    });
    alert('Proposal submitted successfully!');
    router.push('/artworks');
  } catch (error) {
    serverError.value = error.message || 'An error occurred while submitting the proposal';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.artwork-create {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input, textarea, select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.input-error {
  border-color: #dc3545;
}

.error-text {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.server-error {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  color: #721c24;
}

.form-actions {
  margin-top: 2rem;
}

.btn-submit {
  padding: 0.75rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
}

.btn-submit:hover {
  background-color: #45a049;
}

.btn-submit:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>
