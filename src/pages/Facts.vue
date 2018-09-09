<template>
	<v-content>
		<v-container fluid>
			<v-layout justify-center align-center wrap v-if="isLoading">
				<v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
			</v-layout>
			<v-layout wrap v-if="!isLoading" class="animated fadeIn">
				<v-flex xs12>
					<h3 class="title text-xs-center" v-if="sortedFacts.length==0">No related topic raised yet.</h3>
					<v-layout wrap class="card-wrapper">
						<v-flex xs12 v-for="fact in sortedFacts" :key="fact.id">
							<v-card class="my-2" :class="{'red darken-4':isAdmin&&fact.report!=null}">
								<div class="empty-img" style="height:200px">
									<v-icon class="empty-img-icon">photo</v-icon>
								</div>
								<v-card-media @click="goToFact(fact.id)" class="hoverable" :src="fact.image_url" height="200px">
								</v-card-media>
								<v-card-title primary-title class="card-detail-wrapper">
									<div>
										<h3 class="headline white--text mb-3 truncate">#{{fact.id}} - {{fact.title}}</h3>
										<p class="subheading truncate white--text mb-0">{{fact.description}}</p>
									</div>
								</v-card-title>
								<trustCounter class="px-3 pt-2" :againstTrust="fact.against_trust_count" :supportTrust="fact.support_trust_count"></trustCounter>
								<v-card-actions class="px-3">
									<v-layout justify-space-between align-center>
										<span class="caption">Created {{fact.moment}}</span>
										<v-spacer></v-spacer>
										<v-tooltip top>
											<v-chip slot="activator" outline class="mx-2" color="white">
												<v-avatar>
													<v-icon>remove_red_eye</v-icon>
												</v-avatar>
												<span v-if="!fact.numOfView">0</span>
												<span v-if="fact.numOfView">{{fact.numOfView}}</span>
											</v-chip>
											<span>Views</span>
										</v-tooltip>
										<v-tooltip top>
											<v-chip slot="activator" outline class="mx-2" color="white">
												<v-avatar>
													<v-icon>explicit</v-icon>
												</v-avatar>
												<span v-if="!fact.numOfEvidence">0</span>
												<span v-if="fact.numOfEvidence">{{fact.numOfEvidence}}</span>
											</v-chip>
											<span>Related Evidence</span>
										</v-tooltip>
									</v-layout>
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
			<v-btn slot="activator" class="new-fact-btn" fab color="pink" dark fixed @click.stop="openFactDialog()">
				<v-icon>add</v-icon>
			</v-btn>
			<span>Create a new Fact</span>
		</v-tooltip>
		<newFactDialog :dialog="newFactDialog" :done="resetAllDialog"></newFactDialog>
		<deletionDialog :dialog="deletionDialog" :deletedItem="deletedFact" :done="actionComplete"></deletionDialog>
	</v-content>
</template>

<script>
	import newFactDialog from "@/components/newFactDialog.vue";
	import deletionDialog from "@/components/deletionDialog.vue";
	import trustCounter from "@/components/trustCounter.vue";
	var moment = require("moment");
	
	export default {
		components: {
			newFactDialog,
			deletionDialog,
			trustCounter
		},
		props: {
			search: String,
			tagFilter: String,
			isAdmin: Boolean
		},
		data: () => ({
			newFactDialog: false,
			deletionDialog: false,
			facts: [],
			sortList: ["Created at", "Views", "Evidence"],
			sortOrder: 1,
			selectedSortIndex: 0,
			isLoading: true,
			deletedFact: {
				id: Number,
				type: String
			},
		}),
		computed: {
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
							fact.moment = moment(parseInt(fact.createdAt)).fromNow();
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
					el.createdAt = moment(el.createdAt).fromNow();
				});
			},
			resetAllDialog() {
				this.deletionDialog = false;
				this.newFactDialog = false;
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
			actionComplete() {
				this.resetAllDialog();
				this.getFacts();
			},
			changeView(view) {
				this.view = view;
			}
		},
		mounted() {
			this.getFacts();
		}
	};
</script>

<style>
	.new-fact-btn {
		position: fixed;
		bottom: 90px;
		right: 30px
	}
	
	.card-wrapper {
		padding-bottom: 65px
	}
	
	.card-detail-wrapper {
		max-height: 300px;
		overflow: hidden
	}
	
	.empty-img {
		position: absolute;
		top: 0px;
		background-color: rgb(53, 55, 146);
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.empty-img-icon {
		font-size: 80px
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
		-webkit-line-clamp: 5;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>