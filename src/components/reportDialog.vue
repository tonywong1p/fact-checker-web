<template>
	<v-dialog v-model="dialog" width="400px">
		<v-card>
			<v-card-title class="headline" dark>
				Report
			</v-card-title>
	
			<v-card-text>
				You are reporting this {{reportedItem.type}} with following result:
				<v-radio-group v-model="reportMessage" column>
					<v-radio label="Clear report" :value="null" v-if="isAdmin"></v-radio>
					<v-radio label="Violence" value="Violence"></v-radio>
					<v-radio label="Harassment" value="Harassment"></v-radio>
					<v-radio label="Spam" value="Spam"></v-radio>
					<v-radio label="Sexual Activity" value="Sexual Activity"></v-radio>
					<v-radio label="Irrelevant" value="Irrelevant"></v-radio>
					<v-radio label="Dead image" value="Dead image"></v-radio>
					<v-radio label="Others" value="Others">
					</v-radio>
					<v-text-field placeholder="Tell us what's going on" v-model="customMessage" v-if="reportMessage=='Others'"></v-text-field>
				</v-radio-group>
			</v-card-text>
	
			<v-divider></v-divider>
	
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="primary" flat @click="dialog = false">
					Cancel
				</v-btn>
				<v-btn color="primary" flat @click="reportItem(reportedItem)">
					Confirm
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
	export default {
		props: {
			dialog: Boolean,
			reportedItem: Object,
			isAdmin: Boolean,
			done: Function
		},
		data: () => ({
			reportMessage: 'Violence',
			customMessage: '',
		}),
		methods: {
			reportItem(reportedItem) {
				const self = this;
				let message = self.reportMessage;
				if (self.reportMessage == 'Others' && self.customMessage != '') {
					message = self.customMessage
				}
				let report = {
					reportMessage: message
				}
				let api = null;
				if (reportedItem.type == 'fact') {
					api = self.api_url + `/facts/${self.$route.params.id}/report`;
				} else if (reportedItem.type == 'evidence') {
					api = self.api_url + `/facts/${self.$route.params.id}/evidences/${reportedItem.id}/report`;
				}
				self.axios.post(api, report).then(res => {
					// eslint-disable-next-line
					console.log(res);
					self.dialog = false;
					self.done();
				});
			},
		},
		mounted() {
	
		}
	}
</script>

