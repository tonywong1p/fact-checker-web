<template>
	<v-content>
		<v-container fluid>
			<v-layout justify-center align-center wrap v-if="isLoading">
				<v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
			</v-layout>
			<v-layout wrap v-if="!isLoading" class="animated fadeIn">
				<v-flex xs12>
					<v-layout justify-space-between>
						<v-layout justify-start>
							<v-btn flat color="pink" v-if="view=='carousel'" @click="changeView('grid')">
								<v-icon left>view_module</v-icon>
								{{$t('view.gridView')}}
							</v-btn>
							<v-btn flat color="pink" v-if="view=='grid'" @click="changeView('carousel')">
								<v-icon left>view_array</v-icon>
								{{$t('view.slideView')}}
							</v-btn>
						</v-layout>
						<v-layout justify-end>
							<v-btn flat icon color="pink" @click="changeSortOrder()" v-if="tagFilter!='hot'">
								<v-icon v-if="sortOrder==1">arrow_downward</v-icon>
								<v-icon v-if="sortOrder==-1">arrow_upward</v-icon>
							</v-btn>
							<v-btn flat color="primary" dark v-if="tagFilter=='hot'">
								{{$t('tags.hottest')}}
							</v-btn>
						</v-layout>
						<v-menu offset-y v-if="tagFilter!='hot'">
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
				<v-flex xs12>
					<h3 class="title text-xs-center" v-if="sortedFacts.length==0">No related topic raised yet.</h3>
					<carousel v-if="view=='carousel'" :paginationEnabled="true" :navigateTo="0" :perPageCustom="[[0, 1], [768, 2],[1024,3],[1440,4]]">
						<slide v-for="fact in sortedFacts" :key="fact.id">
							<v-card class="ma-3 slide-card" :class="{'red darken-4':isAdmin&&fact.report!=null}">
								<div class="empty-img">
									<v-icon style="font-size:60px">photo</v-icon>
								</div>
								<v-card-media @click="goToFact(fact.id)" class="hoverable" :src="fact.image_url" height="200px">
								</v-card-media>
								<v-card-title primary-title style="height:250px;align-items:stretch;overflow:hidden">
									<div style="width:100%">
										<h3 class="headline white--text mb-3 truncate">#{{fact.id}} - {{fact.title}}</h3>
										<p class="truncate white--text mb-0">{{fact.description}}</p>
									</div>
								</v-card-title>
								<v-card-title class="caption py-2 grey--text">{{fact.moment}} by <span class="font-weight-bold mx-1">{{fact.creator}}</span> | {{fact.numOfView}} {{$tc('counter.views',fact.numOfView)}}</v-card-title>
								<v-divider></v-divider>
								<v-card-actions class="mt-1">
									<v-tooltip top>
										<v-chip slot="activator" outline class="mx-2" color="white">
											<v-avatar>
												<v-icon>explicit</v-icon>
											</v-avatar>
											<span v-if="!fact.numOfEvidence">0</span>
											<span v-if="fact.numOfEvidence">{{fact.numOfEvidence}}</span>
										</v-chip>
										<span>{{$t('tooltips.evidence')}}</span>
									</v-tooltip>
									<trustCounter style="width:100%" class="px-3" :againstTrust="fact.against_trust_count" :supportTrust="fact.support_trust_count"></trustCounter>
								</v-card-actions>
								<v-card-actions v-if="isAdmin">
									<span>{{fact.reported}}</span>
									<v-btn color="red" @click="openDeletionDialog({type:'fact',id:fact.id})">Delete</v-btn>
									<span class="ml-2" v-if="fact.report!=null">Report: {{fact.report}}</span>
								</v-card-actions>
							</v-card>
						</slide>
					</carousel>
					<v-layout wrap v-if="view=='grid'">
						<v-flex xs12 sm6 md4 lg3 v-for="fact in sortedFacts" :key="fact.id">
							<v-card class="ma-3" :class="{'red darken-4':isAdmin&&fact.report!=null}">
								<div class="empty-img">
									<v-icon style="font-size:60px">photo</v-icon>
								</div>
								<v-card-media @click="goToFact(fact.id)" class="hoverable" :src="fact.image_url" height="200px">
								</v-card-media>
								<v-card-title primary-title style="height:250px;align-items:stretch;overflow:hidden">
									<div style="width:100%">
										<h3 class="headline white--text mb-3 truncate">#{{fact.id}} - {{fact.title}}</h3>
										<p class="truncate white--text mb-0">{{fact.description}}</p>
									</div>
								</v-card-title>
								<v-card-title class="caption py-2 grey--text">{{fact.moment}} by <span class="font-weight-bold mx-1">{{fact.creator}}</span> | {{fact.numOfView}} {{$tc('counter.views',fact.numOfView)}}</v-card-title>
								<v-divider></v-divider>
								<v-card-actions class="mt-1">
									<v-tooltip top>
										<v-chip slot="activator" outline class="mx-2" color="white">
											<v-avatar>
												<v-icon>explicit</v-icon>
											</v-avatar>
											<span v-if="!fact.numOfEvidence">0</span>
											<span v-if="fact.numOfEvidence">{{fact.numOfEvidence}}</span>
										</v-chip>
										<span>{{$t('tooltips.evidence')}}</span>
									</v-tooltip>
									<trustCounter style="width:100%" class="px-3" :againstTrust="fact.against_trust_count" :supportTrust="fact.support_trust_count"></trustCounter>
								</v-card-actions>
								<v-card-actions v-if="isAdmin">
									<span>{{fact.reported}}</span>
									<v-btn color="red" @click="openDeletionDialog({type:'fact',id:fact.id})">Delete</v-btn>
									<span class="ml-2" v-if="fact.report!=null">Report: {{fact.report}}</span>
								</v-card-actions>
							</v-card>
						</v-flex>
					</v-layout>
				</v-flex>
			</v-layout>
		</v-container>
		<v-tooltip left>
			<v-btn slot="activator" fab bottom right color="pink" dark fixed @click.stop="openFactDialog()">
				<v-icon>add</v-icon>
			</v-btn>
			<span>{{$t('tooltips.newFact')}}</span>
		</v-tooltip>
		<newFactDialog :profile="profile" :dialog="newFactDialog" :done="resetAllDialog" @close="resetAllDialog"></newFactDialog>
		<deletionDialog :dialog="deletionDialog" :deletedItem="deletedFact" :done="actionComplete"></deletionDialog>
	</v-content>
</template>

<script>
	import {
		Carousel,
		Slide
	} from "vue-carousel";
	import newFactDialog from "@/components/newFactDialog.vue";
	import deletionDialog from "@/components/deletionDialog.vue";
	import trustCounter from "@/components/trustCounter.vue";
	// const moment = require("moment");
	// require(`moment/locale/zh-cn`);
	// en-au, zh-cn
	
	export default {
		components: {
			Carousel,
			Slide,
			newFactDialog,
			deletionDialog,
			trustCounter
		},
		props: {
			search: String,
			tagFilter: String,
			isAdmin: Boolean,
			profile: Object,
		},
		data: () => ({
			newFactDialog: false,
			deletionDialog: false,
			facts: [],
			sortOrder: 1,
			selectedSortIndex: 0,
			isLoading: true,
			deletedFact: {
				id: Number,
				type: String
			},
			view: 'carousel'
		}),
		computed: {
			sortList: function() {
				return [this.$t('sort.createdAt'), this.$t('sort.views'), this.$t('sort.evidence')];
			},
			sortedFacts: function() {
				let self = this;
				let results = [];
				if (self.selectedSortIndex == 0) {
					results = self.facts.sort(function(a, b) {
						return (b.createdAt - a.createdAt) * self.sortOrder;
					});
				}
				if (self.selectedSortIndex == 1) {
					results = self.facts.sort(function(a, b) {
						return (b.numOfView - a.numOfView) * self.sortOrder;
					});
				}
				if (self.selectedSortIndex == 2) {
					results = self.facts.sort(function(a, b) {
						return (b.numOfEvidence - a.numOfEvidence) * self.sortOrder;
					});
				}
				if (self.tagFilter == 'hot') {
					results = self.facts.sort(function(a, b) {
						return ((b.numOfEvidence + b.against_trust_count + b.support_trust_count + b.numOfView) - (a.numOfEvidence + a.against_trust_count + a.support_trust_count + a.numOfView));
					});
				}
				if (self.tagFilter == 'all' || self.tagFilter == 'hot') {
					return results;
				} else {
					return results.filter((result) => {
						let flag = false;
						result.tags.forEach((tag) => {
							if (tag == self.tagFilter) {
								flag = true;
							}
						})
						return flag;
					})
				}
			}
		},
		watch: {
			search: function() {
				this.getFacts();
			},
		},
		methods: {
			getFacts() {
				const self = this;
				let api = self.api_url + "/facts";
				self.axios.get(api, {
						params: {
							search: self.search
						}
					})
					.then((res) => {
						let facts = res.data;
						facts.forEach(fact => {
							fact.moment = this.$moment(parseInt(fact.createdAt)).fromNow();
							if (!fact.against_trust_count) {
								fact.against_trust_count = 0;
							}
							if (!fact.support_trust_count) {
								fact.support_trust_count = 0;
							}
						});
						self.facts = facts;
						self.isLoading = false;
					})
					.catch(error => {
						// eslint-disable-next-line
						console.log(error);
					})
			},
			selectSort(index) {
				this.selectedSortIndex = index;
			},
			changeSortOrder() {
				this.sortOrder = this.sortOrder * -1;
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
				arr.forEach(el => {
					el.createdAt = this.$moment(el.createdAt).fromNow();
				});
			},
			openFactDialog() {
				this.resetAllDialog();
				this.newFactDialog = true;
			},
			openDeletionDialog(item) {
				this.resetAllDialog();
				this.deletedFact = item;
				this.deletionDialog = true;
			},
			resetAllDialog() {
				this.deletionDialog = false;
				this.newFactDialog = false;
			},
			actionComplete() {
				this.resetAllDialog();
				this.getFacts();
			},
			changeView(view) {
				this.view = view;
			},
		},
		mounted() {
			this.getFacts();
			// eslint-disable-next-line
			console.log(this);
		},
	};
</script>

<style>
	.slide-card {
		max-width: 500px;
	}
	
	.empty-img {
		position: absolute;
		top: 0px;
		background-color: rgb(53, 55, 146);
		height: 200px;
		width: 100%;
		font-size: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
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
		-webkit-line-clamp: 6;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>