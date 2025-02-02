import api from '@/services/api';

export default {
  namespaced: true,
  state: {
    artworks: [],
    loading: false,
    error: null,
    currentArtwork: null
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
    }
  },
  getters: {
    allArtworks: (state) => state.artworks,
    loading: (state) => state.loading,
    error: (state) => state.error,
    currentArtwork: (state) => state.currentArtwork
  },
  actions: {
    async fetchArtworks({ commit }, { page = 1, limit = 10 } = {}) {
      commit('SET_LOADING', true);
      try {
        const response = await api.get('/artworks', { params: { page, limit } });
        commit('SET_ARTWORKS', response.data.data);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },


    async createArtwork({ commit, state }, artworkData) {
      commit('SET_LOADING', true);
      try {
        const response = await api.post('/artworks', artworkData);
        commit('SET_ARTWORKS', [...state.artworks, response.data]);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
    ,

    async fetchArtworkById({ commit }, id) {
      commit('SET_LOADING', true);
      try {
        const response = await api.get(`/artworks/${id}`);
        commit('SET_CURRENT_ARTWORK', response.data);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async updateArtwork({ commit }, { id, artworkData }) {
      commit('SET_LOADING', true);
      try {
        const response = await api.put(`/artworks/${id}`, artworkData);
        commit('SET_CURRENT_ARTWORK', response.data);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async approveArtwork({ commit }, id) {
      commit('SET_LOADING', true);
      try {
        await api.patch(`/artworks/${id}/approve`);
        if (this.state.artwork.currentArtwork && this.state.artwork.currentArtwork.id === id) {
          this.state.artwork.currentArtwork.isApproved = true;
        }
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async deleteArtwork({ commit, state }, id) {
      commit('SET_LOADING', true);
      try {
        await api.delete(`/artworks/${id}`);
        commit('SET_ARTWORKS', state.artworks.filter((artwork) => artwork.id !== id));
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || error.message);
      } finally {
        commit('SET_LOADING', false);
      }
    }
  }
};