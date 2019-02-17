import api from '@/api/meta';

const metaLoader = {
  state: {
    modules: [],
    loadStatus: "none",
    dataTypes: [],
    enums: {},
    currentBusiness: null,
    childBusinesses: []
  },
  getters: {
    modules: state => state.modules,
    loadStatus: state => state.loadStatus,
    dataTypes: state => state.dataTypes,
    currentBusiness: state => state.currentBusiness,
    childBusinesses: state => state.childBusinesses,
    loadDataType: state => dataTypeId => state.dataTypes.find(tmp => tmp.id === dataTypeId),
    loadType: state => typeIdOrName => {
      let modules = state.modules;
      for (const i in modules) {
        const mod = modules[i];
        let type = mod.types.find(type => type.name === typeIdOrName || type.id === typeIdOrName);
        if (type) return type;
      }
    },
    loadFields: state => typeId => {
      let type = metaLoader.getters.loadType(state)(typeId);
      return type ? type.fields : [];
    },
    loadEnum: state => key => {
      let en = state.enums[key];
      if (en) return en;
      let result = api.loadEnumSync(key);
      if (result.code === 1) {
        state.enums[key] = result.body;
        return result.body;
      }
    }
  },
  actions: {
    loadMetaAsync: ({ commit }, needLoading) => {
      if (needLoading) commit('changeLoadStatus', 'loading');
      return new Promise((resolve) => {
        Promise.all([api.load(), api.dataTypes()]).then(reses => {
          commit('setModules', reses[0].body);
          commit('setDataTypes', reses[1].body);
          commit('changeLoadStatus', 'over');
          setTimeout(() => {
            resolve();
          }, 1);
        });
      });
    },
    executeBusiness: ({ state, commit }, payload) => {
      // e.g : lms.Lawyer@create
      let name = payload.name;
      let params = payload.params;
      let businessName = name.split("@")[1];
      let type = metaLoader.getters.loadType(state)(name.split("@")[0]);
      if (type) {
        let business = type.businesses.find(business => business.name === businessName);
        if (business) {
          let view = business.viewName ? type.views.find(view => view.name === business.viewName) : null;
          let isPannel = !(view && view.windows);
          commit(isPannel ? 'setCurrentBusiness' : 'addChildBusiness', Object.assign({ params: params, view: view }, business));
        } else {
          commit('setCurrentBusiness', null);
        }
      }
    }
  },
  mutations: {
    changeLoadStatus(state, status) {
      state.loadStatus = status;
    },
    setModules(state, modules) {
      state.modules = modules;
    },
    setDataTypes(state, dataTypes) {
      state.dataTypes = dataTypes;
    },
    setCurrentBusiness(state, business) {
      state.currentBusiness = business;
    },
    addChildBusiness(state, business) {
      state.childBusiness.push(business);
    },
  }
}
export default metaLoader;