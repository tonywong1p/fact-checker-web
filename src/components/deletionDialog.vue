<template>
	<v-dialog v-model="dialog" width="400px">
		<v-card>
			<v-card-title class="headline" dark>
				Warning
			</v-card-title>
	
			<v-card-text>
				Are you sure to delete this {{deletedItem.type}} ? </v-card-text>
	
			<v-divider></v-divider>
	
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="primary" flat @click="done()">
					Cancel
				</v-btn>
				<v-btn color="primary" flat @click="deleteItem(deletedItem)">
					Yes
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
	export default {
		props: {
			dialog: Boolean,
			deletedItem: Object,
			done: Function
		},
		data: () => ({}),
		methods: {
			deleteItem(item) {
				const self = this;
				let api = null;
				if (item.type == 'fact') {
					api = self.api_url + `/facts/${item.id}`;
				}
				if (item.type == 'evidence') {
					api = self.api_url + `/facts/${self.$route.params.id}/evidences/${item.id}`;
				}
				if (item.type == 'notification') {
					api = self.api_url + `/notifications/${item.id}`;
				}
				// let api = self.api_url + `/facts/${id}`;
				this.axios.delete(api).then(res => {
					// eslint-disable-next-line
					console.log(res);
					self.done();
				});
			},
		},
		mounted() {
		}
	}
</script>

