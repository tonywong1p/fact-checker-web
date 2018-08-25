<template>
	<v-content>
		<v-container grid-list-xl class="mt-3">
			<v-layout justify-center align-center wrap v-if="isLoading">
				<v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
			</v-layout>
			<v-layout row wrap class="animated fadeIn" v-if="!isLoading">
				<v-flex xs12 sm6>
					<v-card :class="{'red darken-4':isAdmin&&fact.report!=null}">
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
							<div>
								<h3 class="headline mb-0">#{{$route.params.id}} - {{fact.title}}</h3>
								<h3 class="subtitle mb-0 mt-3 grey--text">Description</h3>
								<div>{{fact.description}}</div>
								<h3 class="subtitle mb-0 mt-3 grey--text" v-if="fact.ref_url!=''">Reference Link</h3>
								<a style="display:block" :href="url" target="_blank" v-for="url in fact.ref_url" :key="url.id">{{url}}</a>
							</div>
						</v-card-title>
						<v-divider></v-divider>
						<v-card-text>
							<v-layout>
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
								<v-tooltip top>
									<v-btn slot="activator" fab small flat color="white" @click="openReportDialog({type:'fact',id:$route.params.id})">
										<v-icon>warning</v-icon>
									</v-btn>
									<span>Report</span>
								</v-tooltip>
							</v-layout>
						</v-card-text>
					</v-card>
				</v-flex>
				<v-flex xs12 sm6>
					<v-layout class="px-4 mb-2">
						<h3 class="display-1">Evidence</h3>
						<v-tooltip right>
							<v-btn slot="activator" icon color="pink" style="top:-5px" @click="openEvidenceDialog()">
								<v-icon>add</v-icon>
							</v-btn>
							<span>Expose an Evidence</span>
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
								Evidence #{{evidence.id}} -
								<span class="green--text">Support</span> with {{evidence.trust_count}} trust<span v-if="evidence.trust_count>1">s</span>
							</div>
							<div slot="header" v-if="evidence.support=='0'">
								Evidence #{{evidence.id}} -
								<span class="red--text">Aginst</span> with {{evidence.trust_count}} trust<span v-if="evidence.trust_count>1">s</span>
							</div>
							<v-card>
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
								<v-card-text>{{evidence.text}}
									<h3 class="subtitle mb-0 mt-3" v-if="evidence.ref_url.length!=0&&evidence.ref_url[0]!=''">Reference Link</h3>
									<a style="display:block" :href="url" target="_blank" v-for="url in evidence.ref_url" :key="url.id">{{url}}</a>
								</v-card-text>
								<v-divider></v-divider>
								<v-card-text>
									<v-layout>
										<span class="caption ma-3">Created {{evidence.moment}}</span>
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
									</v-layout>
								</v-card-text>
							</v-card>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-flex>
			</v-layout>
			<newEvidenceDialog :dialog="evidenceDialog" :factId="parseInt($route.params.id)" :done="resetAllDialog"></newEvidenceDialog>
			<reportDialog :dialog="reportDialog" :reportedItem="reportedItem" :isAdmin="isAdmin" :done="()=>{reportedSnackbar=true;reportDialog=false}"></reportDialog>
			<mediaDialog :media="selectedMedia" :dialog="mediaDialog" :done="resetAllDialog"></mediaDialog>
			<v-snackbar v-model="trustedSnackbar" :bottom="true" :right="true" :timeout="6000">
				Trusted! The truth will finally be exposed!
				<v-btn color="pink" flat @click="trustedSnackbar = false">
					Close
				</v-btn>
			</v-snackbar>
			<v-snackbar v-model="reportedSnackbar" :bottom="true" :right="true" :timeout="6000">
				This case has been reported. Thank you for the effort!
				<v-btn color="pink" flat @click="reportedSnackbar = false">
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
	const api_domain = 'http://localhost:3000/api';
	// const img_server_domain = 'http://localhost:8080/uploads/';
	var moment = require('moment');
	
	export default {
		components: {
			newEvidenceDialog,
			pieChart,
			trustCounter,
			reportDialog,
			mediaDialog
		},
		props: {
			isAdmin: Boolean
		},
		data: () => ({
			evidenceDialog: false,
			reportDialog: false,
			mediaDialog: false,
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
			trustedSnackbar: false,
			reportedSnackbar: false,
			fullscreen: false,
			selectedMedia: {}
			// supportData: {
			// 	labels: ['Support', 'Aginst'],
			// 	datasets: [{
			// 		backgroundColor: ['#4caf50', '#dc3912'],
			// 		data: []
			// 	}],
			// },
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
				let api = api_domain + "/facts/" + self.$route.params.id;
				this.axios.get(api).then(res => {
					self.fact = res.data;
					self.fact.ref_url = self.fact.ref_url.split(',');
					self.fact.moment = moment(parseInt(self.fact.createdAt)).fromNow();
					self.isLoading = false;
				});
			},
			getEvidences() {
				const self = this;
				let api = api_domain + "/facts/" + this.$route.params.id + "/evidences";
				this.axios.get(api).then(res => {
					self.evidences = res.data;
					self.evidences.forEach((evidence) => {
						evidence.moment = moment(parseInt(evidence.createdAt)).fromNow();
						evidence.ref_url = evidence.ref_url.split(',');
					});
					self.isLoading = false;
				});
			},
			addView() {
				let api = api_domain + "/facts/" + this.$route.params.id + "/add_view";
				this.axios.get(api).then(() => {
					// eslint-disable-next-line
					console.log("Added view");
				});
			},
			addTrust(evidence) {
				let self = this;
				self.resetAllDialog();
				if (!evidence.trusted) {
					let api = api_domain + "/facts/" + this.$route.params.id + "/evidences/" + evidence.id + "/add_trust";
					this.axios.get(api).then(() => {
						// eslint-disable-next-line
						console.log("Added trust");
						evidence.trust_count++;
					});
				}
				self.trustedSnackbar = true;
				evidence.trusted = true;
			},
			resetAllDialog() {
				this.reportDialog = false;
				this.evidenceDialog = false;
				this.mediaDialog = false;
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
			selectSort(index) {
				this.resetAllDialog();
				this.selectedSortIndex = index;
			},
			changeSortOrder() {
				this.resetAllDialog();
				this.sortOrder = this.sortOrder * (-1);
			},
		},
		mounted() {
			this.getFact();
			this.getEvidences();
			this.addView();
			// window.alert(typeof this.$route.params.id)
		}
	};
</script>

<style>
	.truncate {
		display: block;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
