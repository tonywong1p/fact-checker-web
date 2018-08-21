<template>
  <v-content>
    <v-container fluid>
      <v-layout justify-center align-center wrap v-if="isLoading">
        <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
      </v-layout>
      <v-layout justify-center align-center wrap v-if="!isLoading" class="animated fadeIn">
        <v-flex xs12>
          <v-layout justify-end>
            <v-btn flat icon color="pink" @click="changeSortOrder()">
              <v-icon v-if="sortOrder==1">arrow_downward</v-icon>
              <v-icon v-if="sortOrder==-1">arrow_upward</v-icon>
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
          <h3 class="title text-xs-center" v-if="sortedFacts.length==0">No related topic raised yet.</h3>
          <carousel :paginationEnabled="true" :navigateTo="0" :perPageCustom="[[420, 1], [768, 4]]">
            <slide v-for="fact in sortedFacts" :key="fact.id">
              <v-card class="ma-3">
                <v-card-media @click="goToFact(fact.id)" class="hoverable" :src="fact.image_url" height="200px"></v-card-media>
                <v-card-title primary-title style="height:250px;align-items:stretch">
                  <div>
                    <h3 class="headline white--text mb-3 truncate">#{{fact.id}} - {{fact.title}}</h3>
                    <p class="truncate white--text mb-0">{{fact.description}}</p>
                  </div>
                </v-card-title>
                <v-card-title class="caption pb-0">Created {{fact.moment}}</v-card-title>
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
                    <span v-if="!fact.numOfEvidence">0</span>
                    <span v-if="fact.numOfEvidence">{{fact.numOfEvidence}}</span>
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
    <v-btn fab bottom right color="pink" dark fixed @click.stop="openModal()">
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
      sortList: ['Created at', 'Views', 'Responses'],
      sortOrder: 1,
      selectedSortIndex: 0,
      isLoading: true,
    }),
    computed: {
      sortedFacts: function() {
        let self = this;
        if (self.selectedSortIndex == 0) {
          return self.facts.sort(function(a, b) {
            return (b.createdAt - a.createdAt) * (self.sortOrder);
          });
        }
        if (self.selectedSortIndex == 1) {
          return self.facts.sort(function(a, b) {
            return (b.numOfView - a.numOfView) * (self.sortOrder);
          });
        }
        if (self.selectedSortIndex == 2) {
          return self.facts.sort(function(a, b) {
            return (b.numOfEvidence - a.numOfEvidence) * (self.sortOrder);
          });
        }
      },
    },
    methods: {
      getFacts() {
        const self = this;
        let api = api_domain + "/facts";
        this.axios.get(api).then(res => {
          self.facts = res.data;
          self.facts.forEach((el) => {
            el.moment = moment(parseInt(el.createdAt)).fromNow()
          });
          self.isLoading = false;
        });
      },
      selectSort(index) {
        this.selectedSortIndex = index;
      },
      changeSortOrder() {
        this.sortOrder = this.sortOrder * (-1);
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
      },
      openModal() {
        this.dialog = false;
        this.dialog = true;
      }
    },
    mounted() {
      this.getFacts();
      // eslint-disable-next-line
      console.log(this);
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