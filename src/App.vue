<template>
  <v-app id="fact-cracker" dark>
    <v-navigation-drawer clipped app dark v-if="$route.path=='/'" v-model="drawer">
      <v-list>
        <v-text-field class="ma-2" flat solo-inverted prepend-inner-icon="search" append-icon="clear" @click:append="clearSearch" @click:prepend="drawer = !drawer" label="Search for title, fact ID" v-model="search" @keyup.enter="checkAdmin(search)"></v-text-field>
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
      <v-spacer></v-spacer>
      <v-btn flat icon @click="goToFaq()">
        <v-icon>contact_support</v-icon>
      </v-btn>
      <v-btn flat icon @click="goToNotification()">
        <v-icon>notifications</v-icon>
      </v-btn>
    </v-toolbar>
    <router-view :search="search" :tagFilter="selectedTag" :isAdmin="isAdmin"></router-view>
  </v-app>
</template>

<script>
  export default {
    props: {
      source: String
    },
    data: () => ({
      dialog: false,
      drawer: false,
      search: null,
      isAdmin: false,
      tags: [],
      color: ['blue', 'pink', 'teal', 'orange', 'purple', 'deep-purple', 'indigo', 'cyan', 'brown', 'deep-orange'],
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
        self.drawer = !self.drawer;
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
      selectTag(tag) {
        let self = this;
        self.selectedTag = tag;
        if (window.innerWidth < 1024) {
          self.drawer = false;
        }
      },
      goToFaq() {
        this.$router.push({
          name: "About"
        });
      },
      goToNotification() {
        this.$router.push({
          name: "Notification"
        });
      },
      checkDesktop() {
        if (window.innerWidth > 425) {
          window.location.replace("https://www." + this.domain);
        }
      }
    },
    mounted() {
      this.getTags();
      this.checkDesktop();
    },
    created() {}
  };
</script>

<style>
  .app-logo {
    height: 40px;
    width: auto;
  }
</style>