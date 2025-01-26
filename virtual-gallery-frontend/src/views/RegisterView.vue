<template>
  <div class="login-view"> 
    <div class="auth-container">
      <h1>Register</h1>
      
      <form @submit.prevent="handleRegister" class="auth-form">
        <div v-if="error" class="error-message">
          {{ error }}
          <div v-if="error.includes('already registered')" class="error-action">
            <router-link to="/login">Go to Login</router-link>
          </div>
        </div>

        <div class="form-group">
          <label for="name">Name</label>
          <input
            type="text"
            id="name"
            v-model="name"
            required
            :disabled="loading"
            class="form-input"
            placeholder="Your name"
          >
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

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="confirmPassword" 
            required
            :disabled="loading"
            class="form-input"
            placeholder="confirm password"
          >
        </div>

        <div class="form-actions">
          <button 
            type="submit" 
            class="submit-btn"
            :disabled="loading || !passwordsMatch"
          >
            {{ loading ? 'Creating account...' : 'Register' }}
          </button>
        </div>

        <div class="auth-links">
          <p>Already have an account? 
            <router-link to="/login">Login here</router-link>
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

const store = useStore()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = computed(() => store.getters['auth/error'])
const loading = computed(() => store.getters['auth/loading'])

const passwordsMatch = computed(() => 
  password.value && confirmPassword.value && password.value === confirmPassword.value
)

const validateForm = () => {
  if (password.value.length < 6) {
    store.commit('auth/SET_ERROR', 'Password must be at least 6 characters long')
    return false
  }
  if (password.value !== confirmPassword.value) {
    store.commit('auth/SET_ERROR', 'Passwords do not match')
    return false
  }
  return true
}

const handleRegister = async () => {
  if (!validateForm()) {
    return
  }

  try {
    await store.dispatch('auth/register', {
      name: name.value,
      email: email.value,
      password: password.value
    })
    router.push('/')
  } catch (err) {
    console.error('Registration error:', err)
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

.auth-container h1 {
  text-align: center;
  color: white; 
  margin-bottom: 2rem;
  font-weight: bold;
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
  cursor: pointer;
}

.submit-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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

.auth-links a:hover {
  border-bottom-color: rgba(255, 255, 255, 0.5);
}

.error-message {
  background-color: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.error-action {
  margin-top: 0.5rem;
}

.form-input::placeholder {
  color: rgba(255, 255, 255, 0.7); 
}


.form-group label {
  display: none; 
}
</style>
