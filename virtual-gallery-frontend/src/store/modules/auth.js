export default {
  namespaced: true,
  state: {
    user: null
  },
  mutations: {
    SET_USER(state, userData) {
      state.user = userData
    }
  },
  getters: {
    isAuthenticated: state => !!state.user,
    isAdmin: state => state.user?.role === 'admin'
  },
  actions: {
    setUser({ commit }, userData) {
      commit('SET_USER', userData)
    },
    logout({ commit }) {
      commit('SET_USER', null)
    }
  }
}