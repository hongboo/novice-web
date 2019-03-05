import api from '@/api/meta';

const metaLoader = {
  state: {
    modules: [],
    loadStatus: "none",
    dataTypes: [],
    urlExecute: true,
    currentBusiness: null,
    childBusinesses: [],
    businessHashHistory: [],
    backHashing: false,
  },
  getters: {
    modules: state => state.modules,
    loadStatus: state => state.loadStatus,
    dataTypes: state => state.dataTypes,
    currentBusiness: state => state.currentBusiness,
    childBusinesses: state => state.childBusinesses,
    urlExecute: state => state.urlExecute,
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
    loadField: state => (typeId, name) => {
      let type = metaLoader.getters.loadType(state)(typeId);
      return type ? type.fields.find(field => field.name === name) : null;
    },
    loadViews: state => typeId => {
      let type = metaLoader.getters.loadType(state)(typeId);
      return type ? type.views : [];
    },
    loadView: state => (typeId, name) => {
      let type = metaLoader.getters.loadType(state)(typeId);
      return type ? type.views.find(view => view.name === name) : null;
    },
    loadActions: state => typeId => {
      let type = metaLoader.getters.loadType(state)(typeId);
      return type ? type.actions : [];
    },
    loadAction: state => (typeId, name) => {
      let type = metaLoader.getters.loadType(state)(typeId);
      return type ? type.actions.find(action => action.name === name) : null;
    },
    loadBusinesses: state => typeId => {
      let type = metaLoader.getters.loadType(state)(typeId);
      return type ? type.businesses : [];
    },
    loadBusiness: state => (typeId, name) => {
      let type = metaLoader.getters.loadType(state)(typeId);
      return type ? type.businesses.find(business => business.name === name) : null;
    },
    getEntity: state => (entityId, typeId) => {
      let res = api.executeActionSync(typeId, "view", { entityId: entityId });
      if (res.code === 1) return res.body;
    },
    businessHashHistory: state => {
      if (!state.businessHashHistory || state.businessHashHistory.length === 0) {
        let businessHashHistoryStr = sessionStorage.getItem("businessHashHistory");
        state.businessHashHistory = businessHashHistoryStr ? JSON.parse(businessHashHistoryStr) : [];
      }
      return state.businessHashHistory;
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
      let name = payload.name;
      var typeIdOrName = payload.typeId;
      var businessName = name;
      if (name.indexOf("@") !== -1) {
        typeIdOrName = name.split("@")[0];
        businessName = name.split("@")[1];
      }
      let type = metaLoader.getters.loadType(state)(typeIdOrName);
      if (type) {
        let business = type.businesses.find(business => business.name === businessName);
        if (business) {
          let view = business.viewName ? type.views.find(view => view.name === business.viewName) : null;
          let isPannel = !(view && view.windows);
          if (isPannel) {
            state.urlExecute = false;
            let hash = `#/?business=${encodeURIComponent(`${type.name}@${businessName}`)}`;
            if (payload.params) hash += "&params=" + encodeURIComponent(JSON.stringify(payload.params));
            if (!state.backHashing && location.hash !== hash) {
              commit('pushBusinessHash', location.hash);
            }
            location.hash = hash;
          }
          let businessWrapper = Object.assign({ params: payload.params || {}, callback: payload.callback, view: view }, business);
          commit(isPannel ? 'setCurrentBusiness' : 'addChildBusiness', businessWrapper);
        } else {
          commit('setCurrentBusiness', null);
          throw `business not found, name:${type.name}@${businessName}`;
        }
      } else {
        throw `type not found, typeIdOrName:${typeIdOrName}`;
      }
    },
    executeAction: ({ state }, payload) => {
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
      api.executeAction(typeId, actionName, payload.params).then(res => {
        if (callback && res.code === 1) callback(res.body);
      });
    },
    reOpenUrlExecute: ({ commit }) => {
      commit('setUrlExecute', true);
    },
    completeBackHashing: ({ commit }) => {
      commit('setBackHashing', false);
    },
    backBusinessHash: ({ state }) => {
      let businessHashHistory = metaLoader.getters.businessHashHistory(state);
      let before = businessHashHistory.pop();
      if (before) {
        state.backHashing = true;
        location.hash = before;
      } else {
        history.back();
      }
    },
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
    setUrlExecute(state, flag) {
      state.urlExecute = flag;
    },
    setBackHashing(state, flag) {
      state.backHashing = flag;
    },
    pushBusinessHash(state, hash) {
      let businessHashHistory = metaLoader.getters.businessHashHistory(state);
      businessHashHistory.push(hash);
      sessionStorage.setItem("businessHashHistory", JSON.stringify(businessHashHistory));
    },
  }
}
export default metaLoader;