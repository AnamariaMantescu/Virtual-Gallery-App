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
        state.artworks = artworks
      },
      SET_LOADING(state, status) {
        state.loading = status
      },
      SET_ERROR(state, error) {
        state.error = error
      },
      SET_CURRENT_ARTWORK(state, artwork) {
        state.currentArtwork = artwork
      }
    },
    getters: {
      allArtworks: state => state.artworks,
      loading: state => state.loading,
      error: state => state.error,
      currentArtwork: state => state.currentArtwork
    },
    actions: {
     

      async fetchArtworks({ commit }) {
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