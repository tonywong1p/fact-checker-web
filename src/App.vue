<template>
  <v-app id="fact-cracker" dark>
    <v-navigation-drawer clipped fixed app dark v-if="$route.path=='/'">
      <v-list dense>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>All</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Hottest</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app clipped-left>
      <v-btn icon v-if="$route.path!='/'" @click="goBack()">
        <v-icon>arrow_back_ios</v-icon>
      </v-btn>
      <img src="./assets/logo.png" class="app-logo" />
      <v-toolbar-title style="width: 300px" class="ml-0 pl-1">
        <span class="hidden-sm-and-down grey--text" style="font-size:18px">Fact Checker</span>
      </v-toolbar-title>
      <v-text-field flat solo-inverted hide-details prepend-inner-icon="search" append-icon="clear" @click:append="clearSearch" label="Search for title, fact ID" class="hidden-sm-and-down" v-model="search" @keyup.enter="checkAdmin(search)"></v-text-field>
      <v-spacer></v-spacer>
      <v-btn flat v-if="isAdmin" @click="isAdmin=false">I am Admin</v-btn>
      <admin-notification :isAdmin="isAdmin"></admin-notification>
    </v-toolbar>
    <router-view :search="search" :isAdmin="isAdmin"></router-view>
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
      items: [{
        avatar: 'https://pbs.twimg.com/profile_images/538456309603913728/ihbvZL7s_400x400.jpeg',
        title: 'Hi everyone!',
        subtitle: "I'll be in your neighborhood doing errands this weekend. Do you want to hang out? I'll be in your neighborhood doing errands this weekend. Do you want to hang out?I'll be in your neighborhood doing errands this weekend. Do you want to hang out?I'll be in your neighborhood doing errands this weekend. Do you want to hang out?I'll be in your neighborhood doing errands this weekend. Do you want to hang out?I'll be in your neighborhood doing errands this weekend. Do you want to hang out?I'll be in your neighborhood doing errands this weekend. Do you want to hang out?I'll be in your neighborhood doing errands this weekend. Do you want to hang out?"
      }],
      search: null,
      isAdmin: false,
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
      }
    }
  };
</script>

<style>
  .app-logo {
    height: 40px;
    width: auto;
  }
</style>