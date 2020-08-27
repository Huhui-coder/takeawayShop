import Vue from 'vue'
import dayjs from 'dayjs'
import config from './config'

Vue.mixin({
    data() {
        return {
            baseUrl: config.baseUrl,
        }
    },
    computed: {
    },
    methods: {
        formatTime(time) {
            if (!time) return '-'
            return dayjs(time).format('YYYY-MM-DD HH:mm:ss:ss')
        }
    },
    filters: {
        dateformat(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss:ss') {
            return dayjs(dataStr).format(pattern) || '-'
        }
    }
})

export default Vue
