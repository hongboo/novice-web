import api from '@/api/index'

export default {
    load: () => {
        return api.get({ url: '/meta/load' });
    },
    wrappers:() => {
        return api.get({ url: '/meta/wrappers' });
    },
}