import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import Vuetify from 'vuetify'
import App from './App.vue'
import router from '@/router';

import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

import 'animate.css/animate.css'

import SocialSharing from 'vue-social-sharing'
Vue.use(SocialSharing);

import '@fortawesome/fontawesome-free/css/all.css'
Vue.use(Vuetify, {
    iconfont: 'fa'
})

import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

import { messages } from './plugins/localization'

const moment = require('moment')
require('moment/locale/en-au')
require('moment/locale/zh-cn')
Vue.use(require('vue-moment'), {
    moment
})

import GSignInButton from 'vue-google-signin-button'
Vue.use(GSignInButton)

Vue.config.productionTip = false

const domain = 'factchecker.xyz'
Vue.prototype.domain = domain
Vue.prototype.api_url = `https://${domain}:4433/api`
Vue.prototype.media_server_url = `https://${domain}:8080/uploads`

const i18n = new VueI18n({
    locale: 'ch', // set locale
    messages, // set locale messages
})

new Vue({
    i18n,
    router,
    render: h => h(App),
    // beforeCreate: function() {
    //     window.alert(this.$appName)
    // }
}).$mount('#app')