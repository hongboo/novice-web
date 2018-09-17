import api from '@/api/index'

export default {
    list: (tableId) => {
        return api.get({ url: '/column/list', params: { tableId: tableId } });
    },
    createOrUpdate: (opts) => {
        return api.post({ url: '/column/createOrUpdate', data: { ...opts } });
    },
    delete: (id) => {
        return api.get({ url: '/column/' + id + '/delete' });
    }
}