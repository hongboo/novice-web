import api from '@/api/index';

export default {
    load: () => {
        return api.get({ url: '/meta/load' });
    },
    dataTypes: () => {
        return api.get({ url: '/meta/dataTypes' });
    },
    executeAction: (typeId, actionName, data) => {
        return api.post({ url: `/action/${typeId}/${actionName}`, data: data });
    },
    executeActionSync: (typeId, actionName, data) => {
        return api.syncAjax({ method: 'post', url: `/action/${typeId}/${actionName}`, data: data });
    },
}