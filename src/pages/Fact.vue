<template>
	<v-content>
		<v-layout justify-center align-center wrap v-if="isLoading">
			<v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
		</v-layout>
		<v-tabs class="tar-bar" v-model="tab" fixed-tabs dark icons-and-text>
			<v-tabs-slider color="yellow"></v-tabs-slider>
			<v-tab href="#tab-1" class="grey darken-3" :class="{'darken-4':tab!='tab-1'}">
				Fact
			</v-tab>
			<v-tab href="#tab-2" class="grey darken-3" :class="{'darken-4':tab!='tab-2'}">
				Evidence
			</v-tab>
		</v-tabs>
		<v-tabs-items v-model="tab" v-if="!isLoading" class="animated fadeIn" style="padding-top:68px">
			<v-tab-item id="tab-1">
				<v-card :class="{'red darken-4':isAdmin&&fact.report!=null}">
					<div class="empty-img" style="height:300px">
						<v-icon class="empty-img-icon">photo</v-icon>
					</div>
					<v-card-media :src="fact.image_url" height="300px">
						<v-layout>
							<v-spacer></v-spacer>
							<div class="pa-2">
								<v-tooltip left>
									<v-btn slot="activator" fab @click="openMediaDialog(fact)">
										<v-icon>zoom_in</v-icon>
									</v-btn>
									<span>Fullscreen</span>
								</v-tooltip>
							</div>
						</v-layout>
					</v-card-media>
					<v-card-title primary-title>
						<div class="w-100">
							<h3 class="headline mb-0">#{{$route.params.id}} - {{fact.title}}</h3>
							<h3 class="subheading mb-1 mt-3 grey--text">Description</h3>
							<p class="subheading">{{fact.description}}</p>
							<h3 class="subheading mb-1 mt-3 grey--text" v-if="fact.ref_url!=''">Reference Link</h3>
							<a class="truncate" :href="url" target="_blank" v-for="url in fact.ref_url" :key="url.id">{{url}}</a>
						</div>
					</v-card-title>
					<v-divider></v-divider>
					<v-card-text>
						<v-layout align-center>
							<v-tooltip top>
								<v-chip slot="activator" outline class="ma-2" color="white">
									<v-avatar>
										<v-icon>remove_red_eye</v-icon>
									</v-avatar>
									<span v-if="!fact.numOfView">0</span>
									<span v-if="fact.numOfView">{{fact.numOfView}}</span>
								</v-chip>
								<span>Views</span>
							</v-tooltip>
							<span class="caption ma-3">Created {{fact.moment}}</span>
							<v-spacer></v-spacer>
							<v-menu offset-y>
								<v-btn slot="activator" flat icon dark>
									<v-icon>more_vert</v-icon>
								</v-btn>
								<v-list>
									<v-tooltip top>
										<v-btn slot="activator" fab flat :class="{'pink--text':bookmarked}" @click="bookmark(fact.id)">
											<v-icon>bookmark</v-icon>
										</v-btn>
										<span>Bookmark</span>
									</v-tooltip>
									<social-sharing :url="`https://${domain}/#/fact/`+$route.params.id" :quote="fact.title" inline-template>
										<network network="facebook">
											<v-btn fab flat>
												<v-icon dark>share</v-icon>
											</v-btn>
										</network>
									</social-sharing>
									<v-tooltip top>
										<v-btn slot="activator" fab flat color="white" @click="openReportDialog({type:'fact',id:$route.params.id})">
											<v-icon>warning</v-icon>
										</v-btn>
										<span>Report</span>
									</v-tooltip>
								</v-list>
							</v-menu>
						</v-layout>
					</v-card-text>
				</v-card>
			</v-tab-item>
			<v-tab-item id="tab-2">
				<v-layout class="my-3 mx-2" align-center>
					<h3 class="display-1">Evidence</h3>
					<v-spacer></v-spacer>
					<v-tooltip left>
						<v-btn slot="activator" flat icon dark>
							<v-icon>sort</v-icon>
						</v-btn>
						<span>Expose an Evidence</span>
					</v-tooltip>
				</v-layout>
				<v-expansion-panel popout expand>
					<v-card style="width:95%" class="mb-2">
						<v-card-title>
							<trust-counter :supportTrust="trustCount.support" :againstTrust="trustCount.against" style="width:80%;margin:auto"></trust-counter>
						</v-card-title>
					</v-card>
					<h3 class="subheading my-3" v-if="sortedEvidences.length==0">No related evidence raised yet.</h3>
					<v-expansion-panel-content v-for="evidence in sortedEvidences" :key="evidence.id" :class="{'red darken-4':evidence.report!=null && isAdmin}">
						<div slot="header" v-if="evidence.support=='1'">
							Evidence #{{evidence.id}} -
							<span class="green--text">Support</span> with {{evidence.trust_count}} trust<span v-if="evidence.trust_count>1">s</span>
						</div>
						<div slot="header" v-if="evidence.support=='0'">
							Evidence #{{evidence.id}} -
							<span class="red--text">Aginst</span> with {{evidence.trust_count}} trust<span v-if="evidence.trust_count>1">s</span>
						</div>
						<v-card>
							<div class="empty-img" style="height:150px" v-if="evidence.image_url!=''">
								<v-icon style="font-size:60px">photo</v-icon>
							</div>
							<v-card-media :src="evidence.image_url" v-if="evidence.image_url!=''" height="150px">
								<v-layout>
									<v-spacer></v-spacer>
									<div class="pa-4">
										<v-tooltip left>
											<v-btn slot="activator" fab @click="openMediaDialog(evidence)" style="display:block">
												<v-icon>zoom_in</v-icon>
											</v-btn>
											<span>Fullscreen</span>
										</v-tooltip>
									</div>
								</v-layout>
							</v-card-media>
							<v-card-text>
								<span class="subheading">{{evidence.text}}</span>
								<h3 class="mb-0 mt-3" v-if="evidence.ref_url.length!=0&&evidence.ref_url[0]!=''">Reference Link</h3>
								<a style="display:block" class="truncate" :href="url" target="_blank" v-for="url in evidence.ref_url" :key="url.id">{{url}}</a>
							</v-card-text>
							<v-divider></v-divider>
							<v-layout align-center class="mx-3">
								<span class="caption">Created {{evidence.moment}}</span>
								<v-spacer></v-spacer>
								<v-tooltip top>
									<v-btn slot="activator" fab small flat dark color="white" @click="openReportDialog({type:'evidence',id:evidence.id})">
										<v-icon>warning</v-icon>
									</v-btn>
									<span>Report</span>
								</v-tooltip>
								<v-btn @click="addTrust(evidence)" :class="{'green':evidence.trusted && evidence.support=='1','red':evidence.trusted && evidence.support=='0'}">
									<v-icon left>thumb_up</v-icon>
									I trust it
								</v-btn>
								<v-btn color="red" v-if="isAdmin" @click="openDeletionDialog({type:'evidence',id:evidence.id})">Delete</v-btn>
							</v-layout>
						</v-card>
					</v-expansion-panel-content>
				</v-expansion-panel>
				<v-tooltip left>
					<v-btn slot="activator" bottom right fab color="pink" dark fixed @click.stop="openEvidenceDialog()">
						<v-icon>add</v-icon>
					</v-btn>
					<span>Create a new evidence</span>
				</v-tooltip>
			</v-tab-item>
		</v-tabs-items>
		<newEvidenceDialog :dialog="evidenceDialog" :factId="parseInt($route.params.id)" :done="actionComplete"></newEvidenceDialog>
		<reportDialog :dialog="reportDialog" :reportedItem="reportedItem" :isAdmin="isAdmin" :done="()=>{snackbar=true;snackbarMessage='This case has been reported. Thank you for the effort!';reportDialog=false}"></reportDialog>
		<mediaDialog :media="selectedMedia" :dialog="mediaDialog" :done="resetAllDialog"></mediaDialog>
		<deletionDialog :deletedItem="deletedItem" :dialog="deletionDialog" :done="actionComplete"></deletionDialog>
		<v-snackbar v-model="snackbar" :bottom="true" :right="true" :timeout="6000">
			{{snackbarMessage}}
			<v-btn color="pink" flat @click="snackbar = false">
				Close
			</v-btn>
		</v-snackbar>
	</v-content>
</template>

<script>
	import newEvidenceDialog from "@/components/newEvidenceDialog.vue";
	import pieChart from "@/components/pieChart.vue";
	import trustCounter from "@/components/trustCounter.vue";
	import reportDialog from "@/components/reportDialog.vue";
	import mediaDialog from "@/components/mediaDialog.vue";
	import deletionDialog from "@/components/deletionDialog.vue";
	import SocialSharing from 'vue-social-sharing'
	var moment = require('moment');
	
	export default {
		components: {
			newEvidenceDialog,
			pieChart,
			trustCounter,
			reportDialog,
			mediaDialog,
			deletionDialog,
			SocialSharing
		},
		props: {
			isAdmin: Boolean
		},
		data: () => ({
			evidenceDialog: false,
			reportDialog: false,
			mediaDialog: false,
			deletionDialog: false,
			fact: {},
			reportedItem: {
				type: null,
				id: null
			},
			evidences: [],
			isLoading: true,
			sortList: ['Created at', 'Number of Trust', 'Support', 'Aginst'],
			sortOrder: 1,
			selectedSortIndex: 0,
			snackbar: false,
			snackbarMessage: false,
			fullscreen: false,
			selectedMedia: {},
			deletedItem: {},
			bookmarked: false,
			tab: 0
		}),
		computed: {
			sortedEvidences: function() {
				let self = this;
				if (self.selectedSortIndex == 0) {
					return self.evidences.sort(function(a, b) {
						return (b.createdAt - a.createdAt) * (self.sortOrder);
					});
				}
				if (self.selectedSortIndex == 1) {
					return self.evidences.sort(function(a, b) {
						return (b.trust_count - a.trust_count) * (self.sortOrder);
					});
				}
				if (self.selectedSortIndex == 2) {
					return self.evidences.filter((evidence) => {
						return (evidence.support == '1');
					});
				}
				if (self.selectedSortIndex == 3) {
					return self.evidences.filter((evidence) => {
						return (evidence.support == '0');
					});
				}
			},
			trustCount: function() {
				let temp = {
					support: 0,
					against: 0
				};
				this.evidences.forEach((evidence) => {
					if (evidence.support == '1') {
						temp.support = temp.support + evidence.trust_count;
					}
					if (evidence.support == '0') {
						temp.against = temp.against + evidence.trust_count;
					}
				})
				return temp;
			},
			supportData: function() {
				let self = this;
				let supportData = {
					labels: ['Support', 'Aginst'],
					datasets: [{
						backgroundColor: ['#4caf50', '#dc3912'],
						data: [self.trustCount.support, self.trustCount.against]
					}],
				};
				return supportData;
			},
		},
		methods: {
			getFact() {
				const self = this;
				let api = self.api_url + "/facts/" + self.$route.params.id;
				this.axios.get(api).then(res => {
					self.fact = res.data;
					self.fact.moment = moment(parseInt(self.fact.createdAt)).fromNow();
					self.isLoading = false;
				});
			},
			getEvidences() {
				const self = this;
				let api = self.api_url + "/facts/" + this.$route.params.id + "/evidences";
				this.axios.get(api).then(res => {
					self.evidences = res.data;
					self.evidences.forEach((evidence) => {
						evidence.moment = moment(parseInt(evidence.createdAt)).fromNow();
					});
					self.isLoading = false;
				});
			},
			addView() {
				const self = this;
				let api = self.api_url + "/facts/" + this.$route.params.id + "/add_view";
				this.axios.get(api).then(() => {
					// eslint-disable-next-line
					console.log("Added view");
				})
			},
			addTrust(evidence) {
				let self = this;
				self.resetAllDialog();
				if (!evidence.trusted) {
					let api = self.api_url + "/facts/" + this.$route.params.id + "/evidences/" + evidence.id + "/add_trust";
					this.axios.get(api).then(() => {
						// eslint-disable-next-line
						console.log("Added trust");
						evidence.trust_count++;
					});
				}
				self.snackbar = true;
				self.snackbarMessage = 'Trusted! The truth will finally be exposed!';
				evidence.trusted = true;
			},
			bookmark(factId) {
				let self = this;
				let bookmarks = [];
				if (localStorage.getItem("factchecker_bookmarks") != null) {
					bookmarks = localStorage.getItem("factchecker_bookmarks").split(',');
				}
				if (!self.bookmarked) {
					bookmarks.unshift(factId);
					localStorage.setItem("factchecker_bookmarks", bookmarks.toString())
					self.bookmarked = true;
					self.snackbar = true;
					self.snackbarMessage = 'Bookmarked';
				} else {
					bookmarks.splice(bookmarks.findIndex((bookmark) => {
						return bookmark == factId
					}), 1);
					localStorage.setItem("factchecker_bookmarks", bookmarks.toString());
					self.bookmarked = false;
					self.snackbar = true;
					self.snackbarMessage = 'Undo bookmarked';
				}
			},
			checkBookmarked() {
				let self = this;
				let bookmarks = [];
				if (localStorage.getItem("factchecker_bookmarks") != null) {
					bookmarks = localStorage.getItem("factchecker_bookmarks").split(',');
				}
				self.bookmarked = (bookmarks.find((bookmark) => {
					return bookmark == parseInt(self.$route.params.id)
				}) != null);
			},
			resetAllDialog() {
				this.reportDialog = false;
				this.evidenceDialog = false;
				this.mediaDialog = false;
				this.deletionDialog = false;
			},
			openEvidenceDialog() {
				this.resetAllDialog();
				this.evidenceDialog = true;
			},
			openReportDialog(item) {
				this.resetAllDialog();
				this.reportedItem = item;
				this.reportDialog = true;
			},
			openMediaDialog(media) {
				this.resetAllDialog();
				this.selectedMedia = media;
				this.mediaDialog = true;
			},
			openDeletionDialog(item) {
				this.resetAllDialog();
				this.deletedItem = item;
				this.deletionDialog = true;
			},
			selectSort(index) {
				this.resetAllDialog();
				this.selectedSortIndex = index;
			},
			changeSortOrder() {
				this.resetAllDialog();
				this.sortOrder = this.sortOrder * (-1);
			},
			actionComplete() {
				this.resetAllDialog();
				this.getEvidences();
			}
		},
		mounted() {
			this.getFact();
			this.getEvidences();
			this.checkBookmarked();
			this.addView();
			// window.alert(typeof this.$route.params.id)
		}
	};
</script>

<style>
	.w-100 {
		width: 100%
	}
	
	.empty-img {
		position: absolute;
		top: 0px;
		background-color: grey(53, 55, 146);
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.empty-img-icon {
		font-size: 80px
	}
	
	.truncate {
		display: block;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.tar-bar {
		position: fixed;
		top: 53px;
		width: 100%;
		z-index: 1
	}
</style>
