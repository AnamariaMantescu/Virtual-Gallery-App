import { auth, db } from '@/config/firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  fetchSignInMethodsForEmail
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

export default {
  namespaced: true,

  state: {
    user: null,
    loading: false,
    error: null
  },

  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    CLEAR_ERROR(state) {
      state.error = null
    }
  },

  getters: {
    isAuthenticated: state => !!state.user,
    isAdmin: state => state.user?.role === 'admin',
    currentUser: state => state.user,
    loading: state => state.loading,
    error: state => state.error
  },

  actions: {
    async login({ commit }, { email, password }) {
      console.log('Login action started')
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        console.log('User credential:', userCredential)
        const { user } = userCredential

        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          throw new Error("User details not found in Firestore.");
        }
        const token = await user.getIdToken()
        console.log('Token:', token)

        localStorage.setItem('token', token)

        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        console.log('API response:', response)

        if (!response.ok) {
          throw new Error('Failed to get user details')
        }

        const userData = await response.json()

        if (!userData.name) {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            userData.name = userDoc.data().name || '';
          }
        }

        const userState = {
          uid: user.uid,
          email: user.email,
          name: userData.name,
          role: userData.role,
          token
        }

        commit('SET_USER', userState)
        return userState

      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },


    async register({ commit }, { email, password, name }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const { user } = userCredential

        const token = await user.getIdToken()

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ email, name })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to register user')
        }

        commit('SET_USER', {
          uid: user.uid,
          email: user.email,
          name: userData.name,
          role: 'user',
          token
        })
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async logout({ commit }) {
      try {
        await signOut(auth)
        commit('SET_USER', null)
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      }
    },

    async initAuth({ commit }) {
      return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
          if (user) {
            const token = await user.getIdToken()
            try {
              const response = await fetch('/api/auth/me', {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              })

              if (response.ok) {
                const userData = await response.json()
                commit('SET_USER', {
                  uid: user.uid,
                  email: user.email,
                  role: userData.role,
                  name: userData.name,
                  token
                })
              }
            } catch (error) {
              console.error('Error fetching user data:', error)
            }
          } else {
            commit('SET_USER', null)
          }
          resolve()
          unsubscribe()
        })
      })
    }
  }
}