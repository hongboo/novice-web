import api from '@/api/index'

export default {
    list: (typeId) => {
        return api.get({ url: '/column/list', params: { typeId: typeId } });
    },
    createOrUpdate: (opts) => {
        return api.post({ url: '/column/createOrUpdate', data: { ...opts } });
    },
    delete: (id) => {
        return api.get({ url: '/column/' + id + '/delete' });
    },
    listWrapper: () => {
        return api.get({ url: '/column/listWrapper' });
    },
}