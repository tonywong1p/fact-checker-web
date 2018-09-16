<template>
	<v-content>
		<v-container grid-list-xl class="mt-3">
			<v-layout justify-center align-center wrap v-if="isLoading">
				<v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
			</v-layout>
			<v-layout row wrap class="animated fadeIn" v-if="!isLoading">
				<v-flex xs12 sm6>
					<v-card :class="{'red darken-4':isAdmin&&fact.report!=null}">
						<div class="empty-img" style="height:300px">
							<v-icon style="font-size:60px">photo</v-icon>
						</div>
						<v-card-media :src="fact.image_url" height="300px">
							<v-layout>
								<v-spacer></v-spacer>
								<div class="pa-4">
									<v-tooltip left>
										<v-btn slot="activator" fab @click="openMediaDialog(fact)" style="display:block">
											<v-icon>zoom_in</v-icon>
										</v-btn>
										<span>Fullscreen</span>
									</v-tooltip>
								</div>
							</v-layout>
						</v-card-media>
						<v-card-title primary-title>
							<div style="width:100%">
								<h3 class="headline mb-0">#{{$route.params.id}} - {{fact.title}}</h3>
								<h3 class="subtitle mb-0 mt-3 grey--text">{{$t('text.description')}}</h3>
								<p>{{fact.description}}</p>
								<h3 class="subtitle mb-0 mt-3 grey--text" v-if="fact.ref_url!=''">{{$t('text.referenceLink')}}</h3>
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
									<span>{{$t('tooltips.views')}}</span>
								</v-tooltip>
								<span class="caption ma-3">{{$t('text.created')}} {{fact.moment}} by {{fact.creator}}</span>
								<v-spacer></v-spacer>
								<v-tooltip top>
									<v-btn slot="activator" fab flat :class="{'pink--text':bookmarked}" @click="bookmark(fact.id)">
										<v-icon>bookmark</v-icon>
									</v-btn>
									<span>{{$t('tooltips.bookmark')}}</span>
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
									<span>{{$t('tooltips.report')}}</span>
								</v-tooltip>
							</v-layout>
						</v-card-text>
					</v-card>
				</v-flex>
				<v-flex xs12 sm6>
					<v-layout class="px-4 mb-2">
						<h3 class="display-1">{{$t('text.evidence')}}</h3>
						<v-tooltip right>
							<v-btn slot="activator" icon color="pink" style="top:-5px" @click="openEvidenceDialog()">
								<v-icon>add</v-icon>
							</v-btn>
							<span>{{$t('tooltips.newEvidence')}}</span>
						</v-tooltip>
						<v-spacer></v-spacer>
						<v-btn flat icon color="pink" @click="changeSortOrder()" v-if="selectedSortIndex<2">
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
					<v-expansion-panel popout expand>
						<v-card style="width:95%" class="mb-2">
							<v-card-title>
								<trust-counter :supportTrust="trustCount.support" :againstTrust="trustCount.against" style="width:80%;margin:auto"></trust-counter>
							</v-card-title>
						</v-card>
						<h3 class="subtitle" v-if="sortedEvidences.length==0">No related evidence raised yet.</h3>
						<v-expansion-panel-content v-for="evidence in sortedEvidences" :key="evidence.id" :class="{'red darken-4':evidence.report!=null && isAdmin}">
							<div slot="header" v-if="evidence.support=='1'">
								{{$t('text.evidence')}} #{{evidence.id}} -
								<span class="green--text">{{$t('form.support')}}</span> {{$t('text.with_trust', { count: evidence.trust_count })+$t('text.trust')}} 
							</div>
							<div slot="header" v-if="evidence.support=='0'">
								{{$t('text.evidence')}} #{{evidence.id}} -
								<span class="red--text">{{$t('form.against')}}</span> {{$t('text.with_trust', { count: evidence.trust_count })+$t('text.trust')}}
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
												<span>{{$t('tooltips.fullscreen')}}</span>
											</v-tooltip>
										</div>
									</v-layout>
								</v-card-media>
								<v-card-text>{{evidence.text}}
									<h3 class="subtitle mb-0 mt-3 grey--text" v-if="evidence.ref_url.length!=0&&evidence.ref_url[0]!=''">{{$t('text.referenceLink')}}</h3>
									<a style="display:block" class="truncate" :href="url" target="_blank" v-for="url in evidence.ref_url" :key="url.id">{{url}}</a>
								</v-card-text>
								<v-divider></v-divider>
								<v-card-text>
									<v-layout>
										<span class="caption ma-3">{{$t('text.created')}} {{evidence.moment}} by {{evidence.creator}}</span>
										<v-spacer></v-spacer>
										<v-tooltip top>
											<v-btn slot="activator" fab small flat dark color="white" @click="openReportDialog({type:'evidence',id:evidence.id})">
												<v-icon>warning</v-icon>
											</v-btn>
											<span>{{$t('tooltips.report')}}</span>
										</v-tooltip>
										<v-btn @click="addTrust(evidence)" :class="{'green':evidence.trusted && evidence.support=='1','red':evidence.trusted && evidence.support=='0'}">
											<v-icon left>thumb_up</v-icon>
											{{$t('i_trust_it')+'!'}}
										</v-btn>
										<v-btn color="red" v-if="isAdmin" @click="openDeletionDialog({type:'evidence',id:evidence.id})">Delete</v-btn>
									</v-layout>
								</v-card-text>
							</v-card>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-flex>
			</v-layout>
			<newEvidenceDialog :profile="profile" :dialog="evidenceDialog" :factId="parseInt($route.params.id)" :done="actionComplete"></newEvidenceDialog>
			<reportDialog :dialog="reportDialog" :reportedItem="reportedItem" :isAdmin="isAdmin" :done="()=>{snackbar=true;snackbarMessage='This case has been reported. Thank you for the effort!';reportDialog=false}"></reportDialog>
			<mediaDialog :media="selectedMedia" :dialog="mediaDialog" :done="resetAllDialog"></mediaDialog>
			<deletionDialog :deletedItem="deletedItem" :dialog="deletionDialog" :done="actionComplete"></deletionDialog>
			<v-snackbar v-model="snackbar" :bottom="true" :right="true" :timeout="6000">
				{{snackbarMessage}}
				<v-btn color="pink" flat @click="snackbar = false">
					Close
				</v-btn>
			</v-snackbar>
		</v-container>
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
			isAdmin: Boolean,
			profile: Object,
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
			sortOrder: 1,
			selectedSortIndex: 0,
			snackbar: false,
			snackbarMessage: false,
			fullscreen: false,
			selectedMedia: {},
			deletedItem: {},
			bookmarked: false,
		}),
		computed: {
			sortList: function() {
				return [this.$t('sort.createdAt'), this.$t('sort.trust'), this.$t('sort.support'), this.$t('sort.against')];
			},
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
	.empty-img {
		position: absolute;
		top: 0px;
		background-color: rgb(53, 55, 146);
		width: 100%;
		font-size: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.truncate {
		display: block;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
