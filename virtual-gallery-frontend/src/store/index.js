import { createStore } from 'vuex'

import auth from './modules/auth'
import exhibition from './modules/exhibition'
import artwork from './modules/artwork'
import collection from './modules/collection'

export default createStore({
  modules: {
    auth,
    exhibition,
    artwork,
    collection
  }
})