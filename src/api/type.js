import api from '@/api/index'

export default {
    listBySubordinate: (moduleId) => {
        return api.get({ url: '/type/' + moduleId + '/listBySubordinate' });
    },
    listByExtends: (moduleId) => {
        return api.get({ url: '/type/' + moduleId + '/listByExtends' });
    },
    createOrUpdate: (opts) => {
        return api.post({ url: '/type/createOrUpdate', data: { ...opts } });
    },
    delete: (id) => {
        return api.get({ url: '/type/' + id + '/delete' });
    }
}