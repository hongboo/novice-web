import api from '@/api/index'

export default {
    listBySubordinate: (moduleId) => {
        return api.get({ url: '/type/listBySubordinate', params: { moduleId: moduleId } });
    },
    listByExtends: (moduleId) => {
        return api.get({ url: '/type/listByExtends', params: { moduleId: moduleId } });
    },
    createOrUpdate: (opts) => {
        return api.post({ url: '/type/createOrUpdate', data: { ...opts } });
    },
    delete: (id) => {
        return api.get({ url: '/type/' + id + '/delete' });
    }
}