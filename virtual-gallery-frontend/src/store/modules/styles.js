import api from '@/services/api';

export default {
  namespaced: true,
  state: {
    styles: [],
    loading: false,
    error: null
  },
  mutations: {
    SET_STYLES(state, styles) {
      state.styles = styles;
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    }
  },
  getters: {
    allStyles: (state) => state.styles,
    loading: (state) => state.loading,
    error: (state) => state.error
  },
  actions: {
    async fetchStyles({ commit }) {
      commit('SET_LOADING', true);
      try {
        const response = await api.get('/styles');
        commit('SET_STYLES', response.data.data);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || error.message);
        console.error('Error fetching styles:', error);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  }
};
