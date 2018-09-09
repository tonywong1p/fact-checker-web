<template>
  <v-content>
    <v-toolbar color="indigo" dark>
      <v-toolbar-title>Notifications</v-toolbar-title>
    </v-toolbar>
    <v-layout justify-center align-center wrap v-if="isLoading">
      <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
    </v-layout>
    <v-list three-line style="width:100%" v-if="!isLoading" class="animated fadeIn">
      <!-- <v-subheader>Creator Announcement</v-subheader> -->
      <v-textarea box v-if="isAdmin" name="input-7-4" label="Message" v-model="newMessage" append-icon="send" @click:append="addNotification"></v-textarea>
      <v-list-tile v-if="notifications.length==0">No recent nofication</v-list-tile>
      <v-list-tile v-for="notification in notifications" :key="notification.id" avatar class="py-2">
        <v-list-tile-avatar>
          <img src="@/assets/avatar.jpg">
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-sub-title class="white--text my-2">{{notification.text}}</v-list-tile-sub-title>
          <v-list-tile-sub-title class="caption">{{notification.moment}} by Creator</v-list-tile-sub-title>
        </v-list-tile-content>
        <v-btn v-if="isAdmin" @click="openDeletionDialog({type:'notification',id:notification.id})">Delete</v-btn>
      </v-list-tile>
    </v-list>
    <deletionDialog :dialog="deletionDialog" :deletedItem="deletedNotification" :done="actionComplete"></deletionDialog>
  </v-content>
</template>

<script>
  import deletionDialog from "@/components/deletionDialog.vue";
  var moment = require("moment");
  export default {
    props: {
      isAdmin: Boolean
    },
    components: {
      deletionDialog
    },
    data: () => ({
      notifications: [],
      deletedNotification: {
        id: Number,
        type: String
      },
      newMessage: null,
      deletionDialog: false,
      isLoading: true,
    }),
    methods: {
      getNotifications() {
        const self = this;
        let api = self.api_url + "/notifications";
        self.axios(api).then((res) => {
          self.notifications = res.data;
          self.notifications.forEach(notification => {
            notification.moment = moment(parseInt(notification.createdAt)).fromNow();
          })
          self.isLoading = false;
        })
      },
      addNotification() {
        const self = this;
        let fact = {
          text: self.newMessage,
        };
        let api = self.api_url + "/notifications";
        self.axios.post(api, fact).then(res => {
          // eslint-disable-next-line
          console.log("Added ID:" + res.data);
          self.getNotifications();
        });
      },
      openDeletionDialog(item) {
        this.deletedNotification = item;
        this.deletionDialog = true;
      },
      actionComplete() {
        this.deletionDialog = false;
        this.getNotifications();
      }
    },
    mounted() {
      this.getNotifications();
    }
  }
</script>

<style>
  .v-list--three-line .v-list__tile {
    height: 100% !important;
  }
</style>