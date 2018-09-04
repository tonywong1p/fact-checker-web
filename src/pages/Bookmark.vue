<template>
	<v-content>
		<v-container grid-list-xl class="mt-3">
			<v-layout justify-center align-center wrap v-if="isLoading">
				<v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
			</v-layout>
			<v-layout justify-center wrap v-if="!isLoading" class="animated fadeIn">
				<v-flex xs12 sm8 md6>
					<v-card>
						<v-toolbar>
							<v-toolbar-title>Bookmark</v-toolbar-title>
						</v-toolbar>
						<v-list two-line subheader>
							<v-subheader inset>Facts</v-subheader>
							<v-list-tile avatar v-for="fact in facts" :key="fact.id" @click="goToFact(fact.id)">
								<v-list-tile-avatar>
									<img :src="fact.image_url">
								</v-list-tile-avatar>
								<v-list-tile-content>
									<v-list-tile-title v-html="fact.title"></v-list-tile-title>
									<v-list-tile-sub-title v-html="fact.moment"></v-list-tile-sub-title>
								</v-list-tile-content>
							</v-list-tile>
						</v-list>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>
	</v-content>
</template>

<script>
	import trustCounter from "@/components/trustCounter.vue";
	var moment = require('moment');
	
	export default {
		components: {
			trustCounter,
		},
		props: {
			isAdmin: Boolean
		},
		data: () => ({
			facts: [],
			evidences: [],
			isLoading: true,
		}),
		methods: {
			getFacts() {
				const self = this;
				let api = self.api_url + "/facts";
				self.axios.get(api)
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
