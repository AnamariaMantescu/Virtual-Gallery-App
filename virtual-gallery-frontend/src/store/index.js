import { createStore } from 'vuex'

import auth from './modules/auth'
import artwork from './modules/artwork'
import collection from './modules/collection'
import styles from './modules/styles'

export default createStore({
  modules: {
    auth,
    artwork,
    collection,
    styles
  }
})