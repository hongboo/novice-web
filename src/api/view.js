import api from '@/api/index'

export default {
    listGroupByViewType: (typeId) => {
        return api.get({ url: '/view/listGroupByViewType', params: { typeId: typeId } });
    },
    createOrUpdate: (opts) => {
        return api.post({ url: '/view/save' + opts.viewType + 'View', data: { ...opts } });
    },
    delete: (id) => {
        return api.get({ url: '/view/' + id + '/delete' });
    }
}