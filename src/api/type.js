import api from '@/api/index'

export default {
    list: () => {
        return api.get({ url: '/type/list' });
    },
    createOrUpdate: (opts) => {
        return api.post({ url: '/type/createOrUpdate', data: { ...opts } });
    },
    delete: (id) => {
        return api.get({ url: '/type/' + id + '/delete' });
    }
}