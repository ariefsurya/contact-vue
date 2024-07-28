import { createApp } from 'vue'
import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

// modules
import group from './modules/group';

const store = createStore({
  modules: {
    group,
  },
  plugins: [createPersistedState()]
})

export default store