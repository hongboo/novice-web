import api from '@/api/meta';

export default {
  state: {
    modules: [],
    metaLoading: false,
    wrappers: []
  },
  getters: {
    modules: state => state.modules,
    metaLoading: state => state.metaLoading,
    wrappers: state => state.wrappers,
  },
  actions: {
    loadMeta: ({ commit }, needLoading) => {
      if (needLoading) commit('changeLoading', true);
      Promise.all([api.load(), api.wrappers()]).then(reses => {
        commit('setModules', reses[0].data.body);
        commit('setWrappers', reses[1].data.body);
        if (needLoading) commit('changeLoading', false);
      });
    },
  },
  mutations: {
    changeLoading(state, flag) {
      state.metaLoading = flag;
    },
    setModules(state, modules) {
      state.modules = modules;
    },
    setWrappers(state, wrappers) {
      state.wrappers = wrappers;
    },
  }
}
