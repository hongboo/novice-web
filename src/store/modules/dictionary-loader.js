import api from '@/api/dictionary';

const dictionaryLoader = {
  state: {
    enums: {},
  },
  getters: {
    loadEnum: state => key => {
      let en = state.enums[key];
      if (en) return en;
      let result = api.loadEnumSync(key);
      if (result.code === 1) {
        state.enums[key] = result.body;
        return result.body;
      }
    },
    enumDisplay: state => (enumClass, value) => {
      let enumValues = dictionaryLoader.getters.loadEnum(state)(enumClass);
      let opt = enumValues.find(e => e.value === value);
      return opt ? opt.display : value; Ò
    }
  },
  actions: {

  },
  mutations: {

  }
}
export default dictionaryLoader;