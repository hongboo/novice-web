import api from '@/api/index'

export default {
    listGroupByViewType: (typeId) => {
        return api.get({ url: '/view/listGroupByViewType', params: { typeId: typeId } });
    },
    createOrUpdate: (opts) => {
        return api.post({ url: '/view/' + ('Detail' === opts.viewType ? 'saveDetailView' : 'saveListView'), data: { ...opts } });
    },
    delete: (id) => {
        return api.get({ url: '/view/' + id + '/delete' });
    }
}