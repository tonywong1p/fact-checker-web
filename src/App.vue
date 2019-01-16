<template>
  <v-app id="fact-cracker" dark>
    <!-- Side Bar -->
    <v-navigation-drawer v-if="$route.path=='/'" clipped fixed app dark mobile-break-point="1024" v-model="drawer" :value="selectedTag">
      <v-list>
        <!-- <v-list-tile @click="goToBookmark()" avatar ripple :class="{'grey darken-2':selectedTag=='bookmark'}">
                <v-list-tile-avatar color="yellow darken-3">
                  <v-icon>local_play</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title>Top Players</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile> -->
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
    <!-- Top Bar -->
    <v-toolbar fixed app clipped-left>
      <v-btn icon v-if="$route.path!='/'" @click="goToMain()">
        <v-icon>arrow_back_ios</v-icon>
      </v-btn>
      <v-toolbar-side-icon v-if="$route.path=='/'" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <img src="./assets/logo.png" class="app-logo" />
      <v-toolbar-title style="width: 300px" class="ml-0 pl-1">
        <span class="hidden-sm-and-down grey--text" style="font-size:18px">Fact Checker</span>
      </v-toolbar-title>
      <v-text-field flat solo-inverted hide-details prepend-inner-icon="search" append-icon="clear" @click:append="clearSearch" :label="$t('search')" class="hidden-sm-and-down" v-model="search" @keyup.enter="checkAdmin(search)"></v-text-field>
      <v-spacer></v-spacer>
      <v-btn flat v-if="isAdmin" @click="isAdmin=false">I am Admin</v-btn>
      <v-btn flat style="height:100%" @click="goToProfile()" v-if="profile.username!='guest'">
        <v-avatar size="40" class="mr-2" :class="{'grey':profile.username=='guest'}" :color="color[(profile.fullname.charCodeAt(0)+profile.fullname.charCodeAt(profile.fullname.length-1))%color.length]">
          <v-icon dark v-if="profile.username=='guest'">account_circle</v-icon>
          <span style="font-size:20px" v-if="profile.username!='guest' && profile.imageUrl==''">{{profile.fullname[0]}}</span>
          <img v-if="profile.imageUrl!=''" :src="profile.imageUrl">
        </v-avatar>
        <span>{{profile.fullname}}</span>
      </v-btn>
      <v-btn flat icon @click="goToFaq()">
        <v-icon>contact_support</v-icon>
      </v-btn>
      <admin-notification :isAdmin="isAdmin"></admin-notification>
      <setting></setting>
    </v-toolbar>
    <!-- Main Router -->
    <router-view :profile="profile" :search="search" :tagFilter="selectedTag" :isAdmin="isAdmin"></router-view>
  </v-app>
</template>

<script>
  import {
    Carousel,
    Slide
  } from "vue-carousel";
  import adminNotification from '@/components/adminNotification.vue';
  import setting from '@/components/setting.vue';
  export default {
    components: {
      Carousel,
      Slide,
      adminNotification,
      setting
    },
    props: {
      source: String
    },
    data: () => ({
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
    computed: {
      profile: function() {
        let profile = localStorage.getItem('factchecker_profile');
        if (profile == null) {
          return ({
            username: 'guest',
            fullname: 'Guest',
            email: 'No email',
            imageUrl: '',
          })
        } else {
          return JSON.parse(profile);
        }
      }
    },
    methods: {
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
        // if (window.innerWidth <= 425) {
        //   window.location.replace("https://m." + self.domain);
        // }
      },
      selectTag(tag) {
        let self = this;
        self.selectedTag = tag;
        if (window.innerWidth < 1024) {
          self.drawer = false;
        }
      },
      goToMain() {
        this.$router.push({
          name: "Main"
        });
      },
      goToProfile() {
        this.$router.push({
          name: "Profile"
        });
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
    },
    mounted() {
      this.getTags();
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