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
							<v-subheader class="subtitle" v-if="bookmarkedFacts.length==0">No bookmark yet.</v-subheader>
							<v-list-tile avatar v-for="fact in bookmarkedFacts" :key="fact.id" @click="goToFact(fact.id)">
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
			bookmarkedFacts: [],
			isLoading: true,
		}),
		methods: {
			getBookmarkedFacts() {
				const self = this;
				let bookmarks = localStorage.getItem("factchecker_bookmarks");
				if (bookmarks != null && bookmarks.length!=0) {
					bookmarks = bookmarks.split(',').filter((bookmark) => {
						return bookmark != '';
					});
					bookmarks.forEach((bookmark) => {
						let api = self.api_url + "/facts/" + bookmark;
						this.axios.get(api).then(res => {
							let fact = res.data;
							fact.moment = moment(parseInt(fact.createdAt)).fromNow();
							self.bookmarkedFacts.push(fact);
							self.isLoading = false;
						});
					});
				} else {
					self.isLoading = false;
				}
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
			this.getBookmarkedFacts();
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
