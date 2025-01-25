<template>
  <div class="login-view">
    <div class="auth-container">
      <h1>Login</h1>
      
      <form @submit.prevent="handleLogin" class="auth-form">
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required
            :disabled="loading"
            class="form-input"
            placeholder="email"
          >
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required
            :disabled="loading"
            class="form-input"
            placeholder="password"
          >
        </div>

        <div class="form-actions">
          <button 
            type="submit" 
            class="submit-btn"
            :disabled="loading"
          >
            {{ loading ? 'Logging in...' : 'Sign up' }}
          </button>
        </div>

        <div class="auth-links">
          <p>Don't have an account? 
            <router-link to="/register">Register here</router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import backgroundImage from '@/assets/pozaarta.png'

const store = useStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = computed(() => store.getters['auth/error'])
const loading = computed(() => store.getters['auth/loading'])

const handleLogin = async () => {
  try {
    const result = await store.dispatch('auth/login', {
      email: email.value,
      password: password.value
    })
    console.log('Login success:', result)
    router.push('/')
  } catch (err) {
    console.error('Login error:', err)
  }
}
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  background-image: linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), url('@/assets/pozaarta.png');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-container {
  width: 90%;
  max-width: 400px;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
}


.form-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  padding: 1rem 1.5rem;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.form-input:focus {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.4);
  outline: none;
}

.submit-btn {
  width: 100%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 1rem;
  border-radius: 30px;
  font-size: 1rem;
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

label {
  display: none;
}

.auth-links {
  text-align: center;
  margin-top: 1.5rem;
  color: rgba(255, 255, 255, 0.7);
}

.auth-links a {
  color: white;
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

h1 {
  text-align: center;
  color: white;
  margin-bottom: 2rem;
  font-weight: bold;
}
</style>