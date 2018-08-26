<template>
  <v-menu bottom left :close-on-content-click="false">
    <v-btn slot="activator" icon class="mr-1">
      <v-badge color="red">
        <span slot="badge">{{notifications.length}}</span>
        <v-icon>notifications</v-icon>
      </v-badge>
    </v-btn>
    <v-toolbar color="indigo" dark>
      <v-toolbar-title>Notifications</v-toolbar-title>
    </v-toolbar>
    <v-list two-line style="width:500px">
      <v-subheader>Creator Announcement</v-subheader>
      <v-textarea box v-if="isAdmin" name="input-7-4" label="Message" v-model="newMessage" append-icon="send" @click:append="addNotification"></v-textarea>
      <v-list-tile v-if="notifications.length==0">No recent nofication</v-list-tile>
      <v-list-tile v-for="notification in notifications" :key="notification.id" avatar>
        <v-list-tile-avatar>
          <img src="@/assets/avatar.png">
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title v-html="notification.text"></v-list-tile-title>
          <v-list-tile-sub-title v-html="notification.moment"></v-list-tile-sub-title>
        </v-list-tile-content>
        <v-btn v-if="isAdmin" @click="openDeletionDialog({type:'notification',id:notification.id})">Delete</v-btn>
      </v-list-tile>
    </v-list>
    <deletionDialog :dialog="deletionDialog" :deletedItem="deletedNotification" :done="actionComplete"></deletionDialog>
  </v-menu>
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
      deletionDialog: false
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

