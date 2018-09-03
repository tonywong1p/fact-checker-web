<template>
  <v-app id="fact-cracker" dark>
    <v-navigation-drawer clipped fixed app dark v-if="$route.path=='/'" mobile-break-point="1024" v-model="drawer" :value="selectedTag">
      <v-list dense>
        <v-list-tile @click="selectTag('all')" avatar ripple :class="{'grey darken-2':selectedTag=='all'}">
          <v-list-tile-avatar color="grey">
            <v-icon>all_inclusive</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>All</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="selectTag('hot')" avatar ripple :class="{'grey darken-2':selectedTag=='hot'}">
          <v-list-tile-avatar color="red">
            <v-icon>whatshot</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>Hottest</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <v-subheader class="subtitle">Topics</v-subheader>
        <v-list-tile v-for="tag in tags" :key="tag.id" @click="selectTag(tag)" avatar ripple :class="{'grey darken-2':selectedTag==tag}">
          <v-list-tile-avatar :color="color[(tag.charCodeAt(0)+tag.charCodeAt(1))%color.length]">
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
      <v-text-field flat solo-inverted hide-details prepend-inner-icon="search" append-icon="clear" @click:append="clearSearch" label="Search for title, fact ID" class="hidden-sm-and-down" v-model="search" @keyup.enter="checkAdmin(search)"></v-text-field>
      <v-spacer></v-spacer>
      <v-btn flat v-if="isAdmin" @click="isAdmin=false">I am Admin</v-btn>
      <admin-notification :isAdmin="isAdmin"></admin-notification>
    </v-toolbar>
    <router-view :search="search" :tagFilter="selectedTag" :isAdmin="isAdmin"></router-view>
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
      color: ['blue', 'pink', 'teal', 'orange', 'purple', 'deep-purple', 'indigo','cyan','brown','deep-orange'],
      selectedTag: 'all',
    }),
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
      checkMobile(){
        let self = this;
        if (window.innerWidth<1024){
          self.drawer = false;
        } else {
          self.drawer = true;
        }
      },
      selectTag(tag){
        let self = this;
        self.selectedTag = tag;
        if (window.innerWidth<1024) {
          self.drawer = false;
        }
      }
    },
    mounted() {
      this.getTags();
    },
    created(){
      this.checkMobile();
    }
  };
</script>

<style>
  .app-logo {
    height: 40px;
    width: auto;
  }
</style>