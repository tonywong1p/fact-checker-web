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


Vue.config.productionTip = false

const domain = 'factchecker.xyz'
Vue.prototype.domain = domain
Vue.prototype.api_url = `https://${domain}:4433/api`
Vue.prototype.media_server_url = `https://${domain}:8080/uploads`

new Vue({
    router,
    render: h => h(App),
    // beforeCreate: function() {
    //     window.alert(this.$appName)
    // }
}).$mount('#app')