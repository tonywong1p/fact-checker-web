<template>
	<v-content>
		<v-container>
			<v-layout justify-center align-center wrap v-if="isLoading">
				<v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
			</v-layout>
			<v-layout column v-if="!isLoading" class="animated fadeIn">
				<v-layout wrap justify-center class="mb-3">
					<div style="display:flex;align-content:center">
						<v-layout wrap column align-center class="mr-5" style="display:inline-flex;">
							<v-avatar :size="100" class="mb-3" :class="{'grey':profile.username=='guest'}" :color="color[(profile.fullname.charCodeAt(0)+profile.fullname.charCodeAt(profile.fullname.length-1))%color.length]">
								<v-icon dark v-if="profile.username=='guest'">account_circle</v-icon>
								<span style="font-size:50px" v-if="profile.username!='guest' && profile.imageUrl==''">{{profile.fullname[0]}}</span>
								<img v-if="profile.imageUrl!=''" :src="profile.imageUrl">
							</v-avatar>
							<span class="title mb-1">{{profile.fullname}}</span>
							<span class="subheading">{{profile.email}}</span>
						</v-layout>
						<v-card class="ma-2" style="display:inline-block;height:120px;width:150px">
							<v-card-text>
								<v-layout column>
									<span style="font-size:50px">{{facts.length}}</span>
									<span>{{$t('profile.posts')}}</span>
								</v-layout>
							</v-card-text>
						</v-card>
						<v-card class="ma-2" style="display:inline-block;height:120px;width:150px">
							<v-card-text>
								<v-layout column>
									<span style="font-size:50px">{{views}}</span>
									<span>{{$t('profile.views')}}</span>
								</v-layout>
							</v-card-text>
						</v-card>
					</div>
				</v-layout>
				<v-layout wrap justify-center>
					<v-flex xs12 sm10 md8 lg6>
						<v-tabs dark centered color="grey darken-4">
							<v-tab>{{$t('profile.fact')}}</v-tab>
							<v-tab>{{$t('profile.evidence')}}</v-tab>
							<v-tab>{{$t('profile.bookmark')}}</v-tab>
							<v-tab-item>
								<v-card>
									<v-list two-line subheader>
										<v-subheader class="subtitle" v-if="facts.length==0">No fact from you yet.</v-subheader>
										<v-list-tile avatar v-for="fact in facts" :key="fact.id" @click="goToFact(fact.id)">
											<v-list-tile-avatar>
												<img :src="fact.image_url">
											</v-list-tile-avatar>
											<v-list-tile-content>
												<v-list-tile-title v-html="fact.title"></v-list-tile-title>
												<v-list-tile-sub-title v-html="fact.moment"></v-list-tile-sub-title>
											</v-list-tile-content>
											<v-spacer></v-spacer>
											<trustCounter style="min-width:200px" :againstTrust="fact.against_trust_count" :supportTrust="fact.support_trust_count"></trustCounter>
										</v-list-tile>
									</v-list>
								</v-card>
							</v-tab-item>
							<v-tab-item>
								<v-card>
									<v-list two-line subheader>
										<v-subheader class="subtitle" v-if="evidences.length==0">No evidence from you yet.</v-subheader>
										<v-list-tile avatar v-for="evidence in evidences" :key="evidence.id" @click="goToFact(evidence.fact_id)">
											<v-list-tile-avatar v-if="evidence.image_url">
												<img :src="evidence.image_url">
											</v-list-tile-avatar>
											<v-list-tile-content>
												<v-list-tile-title v-html="evidence.text"></v-list-tile-title>
												<v-list-tile-sub-title v-html="evidence.moment"></v-list-tile-sub-title>
											</v-list-tile-content>
											<v-spacer></v-spacer>
											<v-list-tile-action>
												<v-chip color="grey darken-2" text-color="white">{{evidence.trust_count}} Trusts</v-chip>
											</v-list-tile-action>
										</v-list-tile>
									</v-list>
								</v-card>
							</v-tab-item>
							<v-tab-item>
								<v-card>
									<v-list two-line subheader>
										<v-subheader class="subtitle" v-if="bookmarks.length==0">No bookmark from you yet.</v-subheader>
										<v-list-tile avatar v-for="fact in bookmarks" :key="fact.id" @click="goToFact(fact.id)">
											<v-list-tile-avatar>
												<img :src="fact.image_url">
											</v-list-tile-avatar>
											<v-list-tile-content>
												<v-list-tile-title v-html="fact.title"></v-list-tile-title>
												<v-list-tile-sub-title v-html="fact.moment"></v-list-tile-sub-title>
											</v-list-tile-content>
											<v-spacer></v-spacer>
											<trustCounter style="min-width:200px" :againstTrust="fact.against_trust_count" :supportTrust="fact.support_trust_count"></trustCounter>
										</v-list-tile>
									</v-list>
								</v-card>
							</v-tab-item>
						</v-tabs>
					</v-flex>
				</v-layout>
			</v-layout>
		</v-container>
	</v-content>
</template>

<script>
	import trustCounter from "@/components/trustCounter.vue";
	export default {
		components: {
			trustCounter
		},
		props: {
			isAdmin: Boolean,
			profile: Object,
		},
		data: () => ({
			isLoading: true,
			color: ['blue', 'pink', 'teal', 'orange', 'purple', 'deep-purple', 'indigo', 'cyan', 'brown', 'deep-orange'],
			facts: [],
			evidences: [],
			bookmarks: [],
		}),
		computed: {
			views: function() {
				if (this.facts.length != 0) {
					return this.facts.reduce((a, b) => ({
						numOfView: a.numOfView + b.numOfView
					})).numOfView
				} else {
					return 0;
				}
			}
		},
		methods: {
			getFacts() {
				const self = this;
				let api = self.api_url + "/facts";
				self.axios.get(api, {
						params: {
							username: self.profile.username
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
			getEvidences() {
				const self = this;
				let api = self.api_url + "/evidences";
				self.axios.get(api, {
					params: {
						username: self.profile.username
					}
				}).then((res) => {
					self.evidences = res.data;
				})
			},
			getBookmarks() {
				const self = this;
				let api = self.api_url + "/bookmarks/facts";
				self.axios.get(api, {
					params: {
						username: self.profile.username
					}
				}).then((res) => {
					self.bookmarks = res.data;
				})
			},
			goToFact(factId) {
				this.$router.push({
					name: "Fact",
					params: {
						id: factId
					}
				});
			},
		},
		mounted() {
			this.getFacts();
			this.getEvidences();
			this.getBookmarks();
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
