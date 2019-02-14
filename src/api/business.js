import api from '@/api/index'

export default {
    list: (typeId) => {
        return api.get({ url: '/business/list', params: { typeId: typeId } });
    },
    createOrUpdate: (opts) => {
        return api.post({ url: '/business/createOrUpdate', data: { ...opts } });
    },
    delete: (id) => {
        return api.get({ url: '/business/' + id + '/delete' });
    },
}