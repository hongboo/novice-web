import api from '@/api/index'

export default {
    list: (typeId) => {
        return api.get({ url: '/field/list', params: { typeId: typeId } });
    },
    createOrUpdate: (opts) => {
        return api.post({ url: '/field/createOrUpdate', data: { ...opts } });
    },
    delete: (id) => {
        return api.get({ url: '/field/' + id + '/delete' });
    },
}