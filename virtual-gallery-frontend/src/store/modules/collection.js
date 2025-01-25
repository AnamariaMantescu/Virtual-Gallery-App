import { db } from '@/config/firebase'
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'

export default {
  namespaced: true,
  state: {
    collections: [],
    loading: false,
    error: null,
    currentCollection: null
  },
  mutations: {
    SET_COLLECTIONS(state, collections) {
      state.collections = collections
    },
    SET_LOADING(state, status) {
      state.loading = status
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    SET_CURRENT_COLLECTION(state, collection) {
      state.currentCollection = collection
    },
    ADD_COLLECTION(state, collection) {
      state.collections.push(collection)
    },
    UPDATE_COLLECTION(state, updatedCollection) {
      const index = state.collections.findIndex(c => c.id === updatedCollection.id)
      if (index !== -1) {
        state.collections[index] = updatedCollection
      }
    },
    DELETE_COLLECTION(state, id) {
      state.collections = state.collections.filter(c => c.id !== id)
    }
  },
  getters: {
    allCollections: state => state.collections,
    loading: state => state.loading,
    error: state => state.error,
    currentCollection: state => state.currentCollection
  },
  actions: {
    async fetchCollections({ commit }) {
      commit('SET_LOADING', true)
      try {
        const querySnapshot = await getDocs(collection(db, 'collections'))
        const collections = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        commit('SET_COLLECTIONS', collections)
      } catch (error) {
        commit('SET_ERROR', error.message)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchCollectionById({ commit }, id) {
      commit('SET_LOADING', true)
      try {
        const docRef = doc(db, 'collections', id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const collection = { id: docSnap.id, ...docSnap.data() }
          commit('SET_CURRENT_COLLECTION', collection)
          return collection
        }
      } catch (error) {
        commit('SET_ERROR', error.message)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async createCollection({ commit }, collectionData) {
      commit('SET_LOADING', true)
      try {
        const docRef = await addDoc(collection(db, 'collections'), {
          ...collectionData,
          createdAt: new Date().toISOString()
        })
        const newCollection = { id: docRef.id, ...collectionData }
        commit('ADD_COLLECTION', newCollection)
        return newCollection
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async updateCollection({ commit }, { id, collectionData }) {
      commit('SET_LOADING', true)
      try {
        const docRef = doc(db, 'collections', id)
        await updateDoc(docRef, {
          ...collectionData,
          updatedAt: new Date().toISOString()
        })
        const updatedCollection = { id, ...collectionData }
        commit('UPDATE_COLLECTION', updatedCollection)
        return updatedCollection
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async deleteCollection({ commit }, id) {
      commit('SET_LOADING', true)
      try {
        const docRef = doc(db, 'collections', id)
        await deleteDoc(docRef)
        commit('DELETE_COLLECTION', id)
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    }
  }
}