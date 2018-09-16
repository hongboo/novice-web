import api from '@/api/index'

export default {
    listBySubordinate: (moduleId) => {
        return api.get({ url: '/table/' + moduleId + '/listBySubordinate' });
    },
    listByExtends: (moduleId) => {
        return api.get({ url: '/table/' + moduleId + '/listByExtends' });
    },
    createOrUpdate: (opts) => {
        return api.post({ url: '/table/createOrUpdate', data: { ...opts } });
    },
    delete: (id) => {
        return api.get({ url: '/table/' + id + '/delete' });
    }
}