import Vue from 'vue';
import Router from 'vue-router';
import Main from '@/pages/Main.vue';
import Fact from '@/pages/Fact.vue';
Vue.use(Router);

export default new Router({
    routes: [{
        path: '/',
        name: 'Main',
        component: Main,
    }, {
        path: '/fact/:id',
        name: 'Fact',
        component: Fact,
    }],
    mode: 'hash',
});