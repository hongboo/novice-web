import Vue from 'vue'
import Vuex from 'vuex'
import adminTab from './modules/admin-tab'
import metaLoader from './modules/meta-loader'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        adminTab,
        metaLoader
    },
})