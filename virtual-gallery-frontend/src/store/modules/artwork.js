import api from '@/services/api';

export default {
  namespaced: true,
  
  state: {
    artworks: [],
    loading: false,
    error: null,
    currentArtwork: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0
    }
  },

  mutations: {
    SET_ARTWORKS(state, artworks) {
      state.artworks = artworks;
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_CURRENT_ARTWORK(state, artwork) {
      state.currentArtwork = artwork;
    },
    SET_PAGINATION(state, pagination) {
      state.pagination = pagination;
    },
    UPDATE_ARTWORK(state, updatedArtwork) {
      const index = state.artworks.findIndex(a => a.id === updatedArtwork.id);
      if (index !== -1) {
        state.artworks.splice(index, 1, updatedArtwork);
      }
    },
    REMOVE_ARTWORK(state, artworkId) {
      state.artworks = state.artworks.filter(a => a.id !== artworkId);
    },
    ADD_ARTWORK(state, artwork) {
      state.artworks.unshift(artwork);
    }
  },

  getters: {
    allArtworks: state => state.artworks,
    loading: state => state.loading,
    error: state => state.error,
    currentArtwork: state => state.currentArtwork,
    pagination: state => state.pagination,
    visibleArtworks: (state, getters, rootState) => {
      const userRole = rootState.auth?.user?.role || 'visitor';
      if (userRole === 'admin') {
        return state.artworks;
      }
      return state.artworks.filter(artwork => artwork.isApproved);
    }
  },

  actions: {
    async fetchArtworks({ commit, rootState }, { page = 1, limit = 12 } = {}) {
      commit('SET_LOADING', true);
      try {
        const response = await api.get('/artworks', {
          params: { 
            page, 
            limit
          }
        });
        
        commit('SET_ARTWORKS', response.data.data);
        commit('SET_PAGINATION', {
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalItems: response.data.totalItems
        });
        return response.data;
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error fetching artworks';
        commit('SET_ERROR', errorMessage);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async fetchArtworkById({ commit }, id) {
      commit('SET_LOADING', true);
      try {
        const response = await api.get(`/artworks/${id}`);
        commit('SET_CURRENT_ARTWORK', response.data);
        return response.data;
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error fetching artwork';
        commit('SET_ERROR', errorMessage);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async createArtwork({ commit }, artworkData) {
      commit('SET_LOADING', true);
      try {
        const response = await api.post('/artworks', artworkData);
        commit('ADD_ARTWORK', response.data);
        return response.data;
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error creating artwork';
        commit('SET_ERROR', errorMessage);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async updateArtwork({ commit }, { id, artworkData }) {
      commit('SET_LOADING', true);
      try {
        const response = await api.put(`/artworks/${id}`, artworkData);
        commit('UPDATE_ARTWORK', response.data);
        return response.data;
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error updating artwork';
        commit('SET_ERROR', errorMessage);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async deleteArtwork({ commit }, id) {
      commit('SET_LOADING', true);
      try {
        await api.delete(`/artworks/${id}`);
        commit('REMOVE_ARTWORK', id);
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error deleting artwork';
        commit('SET_ERROR', errorMessage);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    clearError({ commit }) {
      commit('SET_ERROR', null);
    },

    clearCurrentArtwork({ commit }) {
      commit('SET_CURRENT_ARTWORK', null);
    }
  }
};