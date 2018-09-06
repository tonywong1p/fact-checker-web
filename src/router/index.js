import Vue from 'vue';
import Router from 'vue-router';
import Main from '@/pages/Main.vue';
import Fact from '@/pages/Fact.vue';
import Bookmark from '@/pages/Bookmark.vue';
import About from '@/pages/About.vue';
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
    }, {
        path: '/bookmark',
        name: 'Bookmark',
        component: Bookmark,
    }, {
        path: '/about',
        name: 'About',
        component: About,
    }],
    mode: 'hash',
});