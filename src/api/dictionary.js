import api from '@/api/index';

export default {
    loadEnumSync(key) {
        return api.syncAjax({ url: `/dictionary/${key}/enumValues` });
    }
}