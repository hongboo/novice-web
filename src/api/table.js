import api from '@/api/index'

export default {
    listBySubordinate: (moduleId) => {
        return api.get({ url: '/table/listBySubordinate', params: { moduleId: moduleId } });
    },
    listByExtends: (moduleId) => {
        return api.get({ url: '/table/listByExtends', params: { moduleId: moduleId } });
    },
    createOrUpdate: (opts) => {
        return api.post({ url: '/table/createOrUpdate', data: { ...opts } });
    },
    delete: (id) => {
        return api.get({ url: '/table/' + id + '/delete' });
    }
}