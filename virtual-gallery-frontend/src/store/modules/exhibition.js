export default {
  namespaced: true,
  state: {
    exhibitions: [],
    loading: false,
    error: null
  },
  mutations: {
    SET_EXHIBITIONS(state, exhibitions) {
      state.exhibitions = exhibitions
    },
    SET_LOADING(state, status) {
      state.loading = status
    },
    SET_ERROR(state, error) {
      state.error = error
    }
  },
  actions: {

    
    async fetchExhibitions({ commit }) {
      commit('SET_LOADING', true)
      try {
        
        commit('SET_LOADING', false)
      } catch (err) {
        commit('SET_ERROR', err.message)
      } finally {
        commit('SET_LOADING', false)
      }
    }
  },
  getters: {
    allExhibitions: state => state.exhibitions,
    isLoading: state => state.loading,
    error: state => state.error
  }
}