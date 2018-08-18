<template>
  <v-content>
    <v-container fluid>
      <v-layout justify-center align-center wrap>
        <v-flex xs12>
          <v-layout justify-end>
            <v-btn flat icon color="pink">
              <v-icon>arrow_downward</v-icon>
              <v-icon>arrow_upward</v-icon>
            </v-btn>
          <v-menu offset-y>
            <v-btn flat slot="activator" color="primary" dark>
              {{sortList[selectedSortIndex]}}
            </v-btn>
            <v-list>
              <v-list-tile v-for="(item, index) in sortList" :key="index" @click="selectSort(index)">
                <v-list-tile-title>{{item}}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
          </v-layout>
        </v-flex>
        <v-flex>
          <carousel :paginationEnabled="true" :navigateTo="1" :perPage="4">
            <slide v-for="fact in facts" :key="fact.id">
              <v-card class="grey darken-1 ma-3">
                <v-card-media @click="goToFact(fact.id)" class="hoverable" :src="fact.image_url" height="200px"></v-card-media>
                <v-card-title primary-title style="height:250px;align-items:stretch">
                  <div>
                    <h3 class="headline white--text mb-3 truncate">{{fact.title}}</h3>
                    <p class="truncate white--text mb-0">{{fact.description}}</p>
                  </div>
                </v-card-title>
                <v-card-title class="caption pb-0">Created {{fact.createdAt}}</v-card-title>
                <v-card-actions class="pb-3">
                  <v-chip outline class="mx-2" color="white">
                    <v-avatar>
                      <v-icon>remove_red_eye</v-icon>
                    </v-avatar>
                    <span v-if="!fact.numOfView">0</span>
                    <span v-if="fact.numOfView">{{fact.numOfView}}</span>
                  </v-chip>
                  <v-chip outline class="mx-2" color="white">
                    <v-avatar>
                      <v-icon>chat</v-icon>
                    </v-avatar>
                    <span v-if="!fact.numOfChat">0</span>
                    <span v-if="fact.numOfView">{{fact.numOfChat}}</span>
                  </v-chip>
                  <v-progress-circular :rotate="360" :size="45" :width="8" :value="fact.trustRate" class="ml-3 red--text" :class="{'orange--text':fact.trustRate>=50&&fact.trustRate<80,'green--text':fact.trustRate>=80}">
                    {{fact.trustRate}}
                  </v-progress-circular>
                </v-card-actions>
              </v-card>
            </slide>
          </carousel>
        </v-flex>
      </v-layout>
    </v-container>
    <v-btn fab bottom right color="pink" dark fixed @click.stop="dialog = !dialog">
      <v-icon>add</v-icon>
    </v-btn>
    <newFactModal :dialog="dialog"></newFactModal>
  </v-content>
</template>

<script>
  import {
    Carousel,
    Slide
  } from "vue-carousel";
  import newFactModal from "@/components/newFact.vue";
  const api_domain = 'http://localhost:3000/api';
  //const img_server_domain = 'http://localhost:8080/uploads/';
  var moment = require('moment');
  
  export default {
    components: {
      Carousel,
      Slide,
      newFactModal
    },
    data: () => ({
      dialog: false,
      facts: [],
      sortList: ['Created at','Views','Responses'],
      selectedSortIndex: 0,
    }),
    computed: {},
    methods: {
      getFacts() {
        const self = this;
        let api = api_domain + "/facts";
        this.axios.get(api).then(res => {
          self.facts = res.data;
          self.facts.forEach((el) => {
            el.createdAt = moment(parseInt(el.createdAt)).fromNow()
          })
        });
      },
      selectSort(index) {
        this.selectedSortIndex = index;
      },
      goToFact(factId) {
        this.$router.push({
          name: "Fact",
          params: {
            id: factId
          }
        });
      },
      timeFromNow(arr) {
        arr.forEach((el) => {
          el.createdAt = moment(el.createdAt).fromNow();
        })
      }
    },
    mounted() {
      this.getFacts();
    }
  };
</script>

<style>
  .hoverable:hover {
    cursor: pointer;
    transition: 0.3s;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  }
  
  h3.truncate {
    display: block;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  p.truncate {
    display: block;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>