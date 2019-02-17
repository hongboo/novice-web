import api from '@/api/index';

export default {
    load: () => {
        return api.get({ url: '/meta/load' });
    },
    dataTypes: () => {
        return api.get({ url: '/meta/dataTypes' });
    },
    loadEnumSync(key) {
        return api.syncGet({ url: '/meta/' + key + '/enumValues' });
    }
}