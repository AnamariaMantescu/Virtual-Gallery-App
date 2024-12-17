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
         
            
          commit('SET_LOADING', false)
        } catch (error) {
          commit('SET_ERROR', error.message)
          commit('SET_LOADING', false)
        }
      }
    }
  }