<template>
	<v-dialog v-model="dialog" width="400px">
		<v-card>
			<v-card-title class="headline" dark>
				Warning
			</v-card-title>
	
			<v-card-text>
				Are you sure to delete this {{reportedItem.type}} ? </v-card-text>
	
			<v-divider></v-divider>

			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="primary" flat @click="dialog = false">
					Cancel
				</v-btn>
				<v-btn color="primary" flat @click="reportItem(reportedItem.id)">
					Yes
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
	const api_domain = 'http://localhost:3000/api';
	export default {
		props: {
			dialog: Boolean,
			reportedItem: Object,
		},
		data: () => ({}),
		methods: {
			reportItem(id) {
				const self = this;
				let api = api_domain + `/facts/${id}`;
				this.axios.delete(api).then(res => {
					// eslint-disable-next-line
					console.log(res);
					self.dialog = false;
					location.reload();
				});
			},
		},
		mounted() {
			
		}
	}
</script>

