<template>
  <v-app id="fact-cracker" dark>
    <v-navigation-drawer clipped fixed app dark v-if="$route.path=='/'" mobile-break-point="1024" v-model="drawer" :value="selectedTag">
      <v-list dense>
        <v-list-tile @click="selectTag('all')" avatar ripple :class="{'grey darken-2':selectedTag=='all'}">
          <v-list-tile-avatar color="grey">
            <v-icon>all_inclusive</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{$t('tags.all')}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="selectTag('hot')" avatar ripple :class="{'grey darken-2':selectedTag=='hot'}">
          <v-list-tile-avatar color="red">
            <v-icon>whatshot</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{$t('tags.hottest')}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-subheader class="subtitle">{{$t('tags.topics')}}</v-subheader>
        <v-list-tile v-for="tag in tags" :key="tag.id" @click="selectTag(tag)" avatar ripple :class="{'grey darken-2':selectedTag==tag}">
          <v-list-tile-avatar :color="color[(tag.charCodeAt(0)+tag.charCodeAt(tag.length-1))%color.length]">
            <span class="white--text headline">{{tag[0].toUpperCase()}}</span>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{tag}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app clipped-left>
      <v-btn icon v-if="$route.path!='/'" @click="goBack()">
        <v-icon>arrow_back_ios</v-icon>
      </v-btn>
      <v-toolbar-side-icon v-if="$route.path=='/'" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <img src="./assets/logo.png" class="app-logo" />
      <v-toolbar-title style="width: 300px" class="ml-0 pl-1">
        <span class="hidden-sm-and-down grey--text" style="font-size:18px">Fact Checker</span>
      </v-toolbar-title>
      <v-text-field flat solo-inverted hide-details prepend-inner-icon="search" append-icon="clear" @click:append="clearSearch" :label="$t('search')" class="hidden-sm-and-down" v-model="search" @keyup.enter="checkAdmin(search)"></v-text-field>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <v-btn flat slot="activator" color="white" dark>
          {{selectedLang.name}}
        </v-btn>
        <v-list>
          <v-list-tile v-for="(lang, i) in langs" :key="`Lang${i}`" @click="selectLang(lang)">
            <v-list-tile-title>{{ lang.name }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-btn flat v-if="isAdmin" @click="isAdmin=false">I am Admin</v-btn>
      <v-btn flat icon @click="goToFaq()">
        <v-icon>contact_support</v-icon>
      </v-btn>
      <v-btn flat icon @click="goToBookmark()">
        <v-icon>bookmarks</v-icon>
      </v-btn>
      <admin-notification :isAdmin="isAdmin"></admin-notification>
      <v-avatar class="ml-4" @click="dialog = !dialog">
        <v-btn fab>
          <v-icon dark v-if="profile.imageUrl==''">account_circle</v-icon>
          <img v-if="profile.imageUrl!=''" :src="profile.imageUrl">
        </v-btn>
      </v-avatar>
    </v-toolbar>
    <router-view :search="search" :tagFilter="selectedTag" :isAdmin="isAdmin"></router-view>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-btn slot="activator" color="primary" dark>Open Dialog</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">User Login</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            {{profile}}
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field v-model="loginForm.username" label="Username" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="loginForm.password" label="Password" type="password" required></v-text-field>
              </v-flex>
            </v-layout>
            <div class="mb-3">OR</div>
            <g-signin-button class="g-signin2" :params="googleSignInParams" @success="onSignInSuccess">
            </g-signin-button>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click.native="userLogin()">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
  import {
    Carousel,
    Slide
  } from "vue-carousel";
  import adminNotification from '@/components/adminNotification.vue';
  export default {
    components: {
      Carousel,
      Slide,
      adminNotification
    },
    props: {
      source: String
    },
    data: () => ({
      profile: JSON.parse(sessionStorage.getItem('factchecker_profile')),
      loginForm: {
        username: null,
        password: null,
      },
      googleSignInParams: {
        client_id: '18039521998-t7fpreuiu7kr76imc1k4009d3qk39q4i.apps.googleusercontent.com'
      },
      langs: [{
        name: '繁體中文',
        value: 'ch',
        moment: 'zh-cn'
      }, {
        name: 'English',
        value: 'en',
        moment: 'en-au'
      }],
      selectedLang: JSON.parse(localStorage.getItem("factchecker_language")),
      dialog: false,
      drawer: true,
      items: [{
        avatar: 'https://pbs.twimg.com/profile_images/538456309603913728/ihbvZL7s_400x400.jpeg',
        title: 'Hi everyone!',
        subtitle: "I'll be in your neighborhood doing errands this weekend. Do you want to hang out? I'll be in your neighborhood doing errands this weekend. Do you want to hang out?I'll be in your neighborhood doing errands this weekend. Do you want to hang out?I'll be in your neighborhood doing errands this weekend. Do you want to hang out?I'll be in your neighborhood doing errands this weekend. Do you want to hang out?I'll be in your neighborhood doing errands this weekend. Do you want to hang out?I'll be in your neighborhood doing errands this weekend. Do you want to hang out?I'll be in your neighborhood doing errands this weekend. Do you want to hang out?"
      }],
      search: null,
      isAdmin: false,
      tags: [],
      color: ['blue', 'pink', 'teal', 'orange', 'purple', 'deep-purple', 'indigo', 'cyan', 'brown', 'deep-orange'],
      selectedTag: 'all',
    }),
    computed: {},
    methods: {
      initUser() {
        if (this.profile == null) {
          this.profile = {
            username: 'Guest',
            fullname: 'Guest',
            email: 'No email',
            imageUrl: '',
          };
        }
      },
      userLogin() {
        let self = this;
        let api = self.api_url + "/users/login";
        let credential = self.loginForm;
        self.axios.post(api, credential).then(res => {
          // eslint-disable-next-line
          sessionStorage.setItem("factchecker_profile", JSON.stringify(res.data));
          location.reload();
        });
      },
      onSignInSuccess(googleUser) {
        // `googleUser` is the GoogleUser object that represents the just-signed-in user.
        // See https://developers.google.com/identity/sign-in/web/reference#users
        let profile = googleUser.getBasicProfile() // etc etc
        this.profile = {
          username: profile['Eea'],
          fullname: profile['ig'],
          email: profile['U3'],
          imageUrl: profile['Paa']
        }
        sessionStorage.setItem("factchecker_profile", JSON.stringify(this.profile));
        location.reload();
      },
      goBack() {
        window.history.back();
      },
      checkAdmin(input) {
        const self = this;
        if (input == 'tonyww') {
          self.isAdmin = true;
          self.search = '';
        }
      },
      clearSearch() {
        this.search = null;
      },
      getTags() {
        const self = this;
        let api = self.api_url + "/tags";
        self.axios.get(api).then((res) => {
          self.tags = res.data.map((tag) => {
            return tag.tag
          })
        })
      },
      checkMobile() {
        let self = this;
        if (window.innerWidth < 1024) {
          self.drawer = false;
        } else {
          self.drawer = true;
        }
        if (window.innerWidth <= 425) {
          window.location.replace("https://m." + self.domain);
        }
      },
      selectTag(tag) {
        let self = this;
        self.selectedTag = tag;
        if (window.innerWidth < 1024) {
          self.drawer = false;
        }
      },
      goToBookmark() {
        this.$router.push({
          name: "Bookmark"
        });
      },
      goToFaq() {
        this.$router.push({
          name: "About"
        });
      },
      changeLang(lang) {
        this.$i18n.locale = lang.value;
        this.$moment.locale(lang.moment);
        this.$forceUpdate();
      },
      selectLang(lang) {
        localStorage.setItem("factchecker_language", JSON.stringify(lang));
        location.reload();
      },
      initLang() {
        if (this.selectedLang == null) {
          this.selectedLang = this.langs[0];
        }
        this.$i18n.locale = this.selectedLang.value;
        this.$moment.locale(this.selectedLang.moment);
      }
    },
    mounted() {
      this.getTags();
      this.initLang();
      this.initUser();
    },
    created() {
      this.checkMobile();
    },
  };
</script>

<style>
  .app-logo {
    height: 40px;
    width: auto;
  }
  
  .abcRioButton {
    width: 100% !important;
  }
</style>