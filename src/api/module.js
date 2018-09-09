import api from '@/api/index'

export default {
    list: () => {
        return api.get({ url: '/module/list' });
    },
    createOrUpdate: (opts) => {
        return api.post({ url: '/module/createOrUpdate', data: { ...opts } });
    },
    delete: (id) => {
        return api.get({ url: '/module/' + id + '/delete' });
    }
}