import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from '@/router';

import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

import 'animate.css/animate.css'

import SocialSharing from 'vue-social-sharing'
Vue.use(SocialSharing);

Vue.config.productionTip = false

Vue.prototype.api_url = 'https://factchecker.xyz:4433/api'
Vue.prototype.media_server_url = 'https://factchecker.xyz:8080/uploads'

new Vue({
    router,
    render: h => h(App),
    // beforeCreate: function() {
    //     window.alert(this.$appName)
    // }
}).$mount('#app')