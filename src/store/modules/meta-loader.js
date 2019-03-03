import api from '@/api/meta';

const metaLoader = {
  state: {
    modules: [],
    loadStatus: "none",
    dataTypes: [],
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
    loadViews: state => typeId => {
      let type = metaLoader.getters.loadType(state)(typeId);
      return type ? type.views : [];
    },
    loadActions: state => typeId => {
      let type = metaLoader.getters.loadType(state)(typeId);
      return type ? type.actions : [];
    },
    loadBusinesses: state => typeId => {
      let type = metaLoader.getters.loadType(state)(typeId);
      return type ? type.businesses : [];
    },
    getEntity: state => (entityId, typeId) => {
      let res = api.executeActionSync(typeId, "view", { entityId: entityId });
      if (res.code === 1) {
        return res.body;
      }
    },
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
      var typeIdOrName = payload.name.indexOf("@") !== -1 ? payload.name.split("@")[0] : payload.typeId;
      var businessName = payload.name.indexOf("@") !== -1 ? payload.name.split("@")[1] : payload.name;

      let type = metaLoader.getters.loadType(state)(typeIdOrName);
      if (type) {
        let business = type.businesses.find(business => business.name === businessName);
        if (business) {
          let view = business.viewName ? type.views.find(view => view.name === business.viewName) : null;
          let isPannel = !(view && view.windows);
          commit(isPannel ? 'setCurrentBusiness' : 'addChildBusiness', Object.assign({ params: payload.params, view: view }, business));
        } else {
          commit('setCurrentBusiness', null);
          throw "business not found, name:" + type.name + "@" + businessName;
        }
      } else {
        throw "type not found, typeIdOrName:" + typeIdOrName;
      }
    },
    executeAction: (state, payload) => {
      var typeId = payload.typeId;
      var actionName = payload.name;
      if (!typeId && payload.name.indexOf("@") !== -1) {
        let typeName = payload.name.split("@")[0];
        actionName = payload.name.split("@")[1];
        let type = metaLoader.getters.loadType(state)(typeName);
        if (type) {
          typeId = type.id;
        }
      }
      let callback = payload.callback;
      delete payload.callback;
      if (!typeId) throw { error: "type not found", data: payload };
      return api.executeAction(typeId, actionName, payload.params).then(res => {
        if (callback) callback(res);
      });
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