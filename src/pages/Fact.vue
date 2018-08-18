<template>
	<v-content class="mt-5">
		<v-container grid-list-xl>
			<v-layout justify-center row>
				<v-flex xs6>
					<v-card>
						<v-card-media :src="fact.image_url" height="300px"></v-card-media>
						<v-card-title primary-title>
							<div>
								<h3 class="headline mb-0">{{fact.title}}</h3>
								<div>{{fact.description}}</div>
								<h3 class="subtitle mb-0 mt-3" v-if="fact.ref_url[0]!=''">Reference URL</h3>
								<a style="display:block" :href="url" target="_blank" v-for="url in fact.ref_url" :key="url.id">{{url}}</a>
							</div>
						</v-card-title>
						<v-card-actions>
							<v-btn flat color="orange">Share</v-btn>
							<v-btn flat color="orange">Explore</v-btn>
						</v-card-actions>
					</v-card>
				</v-flex>
				<v-flex xs6>
					<h3 class="display-1 mb-3 pl-3">Evidence</h3>
					<v-expansion-panel popout>
						<v-expansion-panel-content v-for="(item,i) in 5" :key="i">
							<div slot="header">Item</div>
							<v-card>
								<v-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</v-card-text>
							</v-card>
						</v-expansion-panel-content>
					</v-expansion-panel>
					{{fact}}
				</v-flex>
			</v-layout>
		</v-container>
	</v-content>
</template>

<script>
	const api_domain = 'http://localhost:3000/api';
	// const img_server_domain = 'http://localhost:8080/uploads/';
	
	export default {
		data: () => ({
			dialog: false,
			fact: {}
		}),
		methods: {
			getFact() {
				const self = this;
				let api = api_domain + "/fact/" + this.$route.params.id;
				this.axios.get(api).then(res => {
					self.fact = res.data;
					self.fact.ref_url = self.fact.ref_url.split(',');
					// eslint-disable-next-line
					console.log(self.fact);
				});
			},
			addView() {
				let api = api_domain + "/fact/" + this.$route.params.id + "/add_view";
				this.axios.get(api).then(() => {
          // eslint-disable-next-line
					console.log("Added view");
        });
			}
		},
		mounted() {
			this.getFact();
			this.addView();
		}
	};
</script>
