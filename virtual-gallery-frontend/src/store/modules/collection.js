import api from '@/services/api';

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
      state.collections = collections;
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_CURRENT_COLLECTION(state, collection) {
      state.currentCollection = collection;
    }
  },
  getters: {
    allCollections: (state) => state.collections,
    loading: (state) => state.loading,
    error: (state) => state.error,
    currentCollection: (state) => state.currentCollection
  },
  actions: {
    async fetchCollections({ commit }) {
      commit('SET_LOADING', true);
      try {
        const response = await api.get('/collections');
        commit('SET_COLLECTIONS', response.data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || error.message);
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async fetchCollectionById({ commit }, id) {
      commit('SET_LOADING', true);
      try {
        const response = await api.get(`/collections/${id}`);
        console.log('Collection Data:', response.data);
        commit('SET_CURRENT_COLLECTION', response.data);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async createCollection({ commit, state }, collectionData) {
      commit('SET_LOADING', true);
      try {
        const response = await api.post('/collections', collectionData);

        const newCollection = response.data;
        commit('SET_COLLECTIONS', [...state.collections, newCollection]);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async updateCollection({ commit }, { id, collectionData }) {
      commit('SET_LOADING', true);
      try {
        const response = await api.put(`/collections/${id}`, collectionData);
        commit('SET_CURRENT_COLLECTION', response.data);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async deleteCollection({ commit, state }, id) {
      commit('SET_LOADING', true);
      try {
        await api.delete(`/collections/${id}`);
        commit('SET_COLLECTIONS', state.collections.filter((c) => c.id !== id));
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  }
};
