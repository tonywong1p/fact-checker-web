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

<<<<<<< HEAD
Vue.prototype.api_url = 'http://localhost:3000/api'
Vue.prototype.media_server_url = 'http://localhost:8080/uploads'
=======
Vue.prototype.api_url = 'https://factchecker.xyz:4433/api'
Vue.prototype.media_server_url = 'https://factchecker.xyz:8080/uploads'
>>>>>>> cd07a163bcb4d83aa06395b991117e198421922f

new Vue({
    router,
    render: h => h(App),
    // beforeCreate: function() {
    //     window.alert(this.$appName)
    // }
}).$mount('#app')