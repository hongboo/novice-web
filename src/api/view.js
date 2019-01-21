import api from '@/api/index'

export default {
    listGroupByViewType: (typeId) => {
        return api.get({ url: '/view/listGroupByViewType', params: { typeId: typeId } });
    },
}