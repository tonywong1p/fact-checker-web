<template>
	<v-dialog v-model="dialog" width="800px">
		<v-card>
			<v-card-title>
				<h3 class="headline">New Evidence</h3>
				<v-spacer></v-spacer>
				<v-btn color="primary" flat @click="done()">
					Cancel
				</v-btn>
				<v-btn color="primary" dark @click="addEvidence()" :disabled="!valid || newEvidence.image_url=='' || !newEvidence.support">Create
					<v-icon right dark>send</v-icon>
				</v-btn>
			</v-card-title>
			<v-container>
				<v-form ref="form" v-model="valid" lazy-validation>
					<v-layout row wrap>
						<v-flex xs12>
							<p class="grey--text">Standpoint (required)</p>
							<v-radio-group v-model="newEvidence.support" row class="mt-0">
								<v-radio label="Support" color="success" value="1"></v-radio>
								<v-radio label="Against" color="error" value="0"></v-radio>
							</v-radio-group>
							<vue-dropzone id="coverImage" :options="dropzoneOptions" class="mb-4" @vdropzone-success="finishUpload"></vue-dropzone>
							<v-textarea box name="input-7-4" label="Description" :counter="1000" maxlength="1000" v-model="newEvidence.text" :rules="descriptionRules" required></v-textarea>
						</v-flex>
					</v-layout>
					<v-layout row wrap>
						<v-flex xs10>
							<v-text-field box label="Reference URL (optional)" append-icon="link" v-for="link in newEvidence.ref_url" :key="link.id" v-model="link.value"></v-text-field>
						</v-flex>
						<v-flex xs1>
							<v-btn flat icon @click="addRef()">
								<v-icon>add</v-icon>
							</v-btn>
						</v-flex>
						<v-flex xs1 v-if="newEvidence.ref_url.length > 1">
							<v-btn flat icon @click="removeRef()">
								<v-icon>remove</v-icon>
							</v-btn>
						</v-flex>
					</v-layout>
				</v-form>
			</v-container>
		</v-card>
	</v-dialog>
</template>

<script>
	import vue2Dropzone from "vue2-dropzone";
	import "vue2-dropzone/dist/vue2Dropzone.min.css";
	const api_domain = 'http://localhost:3000/api';
	const img_server_domain = 'http://localhost:8080/uploads/';
	export default {
		components: {
			vueDropzone: vue2Dropzone,
		},
		props: {
			dialog: Boolean,
			factId: Number,
			done: Function
		},
		data: () => ({
			dropzoneOptions: {
				url: api_domain + '/upload',
				paramName: "coverImage",
				thumbnailWidth: 200,
				maxFiles: 1,
				maxFilesize: 10,
				dictDefaultMessage: "<i class='material-icons' style='font-size:80px'>add_photo_alternate</i><br>Drop to upload the cover image here (required) (max 10MB)",
				addRemoveLinks: true,
				acceptedFiles: 'image/*'
			},
			newEvidence: {
				image_url: "",
				text: "",
				ref_url: [{
					value: ""
				}],
				support: "1",
			},
			supportRules: [
				v => !!v || 'Selection is required',
			],
			descriptionRules: [
				v => !!v || 'Description is required',
			],
			valid: false,
		}),
		computed: {
			urlArray: function() {
				return this.newEvidence.ref_url.map((el) => {
					if (RegExp('^(http|https)://').test(el.value)) {
						return el.value
					} else {
						return 'http://' + el.value
					}
				});
			},
		},
		methods: {
			finishUpload(file, res) {
				this.newEvidence.image_url = img_server_domain + res;
			},
			addEvidence() {
				const self = this;
				let evidence = {
					fact_id: self.factId,
					text: self.newEvidence.text,
					image_url: self.newEvidence.image_url,
					ref_url: self.urlArray.toString(),
					support: self.newEvidence.support,
				};
				if (self.newEvidence.ref_url[0].value == '' && self.newEvidence.ref_url.length == 1) {
					evidence.ref_url = [].toString();
				}
				// eslint-disable-next-line
				console.log(evidence);
				let api = api_domain + "/facts/" + self.factId + "/evidences";
				self.axios.post(api, evidence).then(res => {
					// eslint-disable-next-line
					console.log("Added ID:" + res.data);
					location.reload();
				});
			},
			addRef() {
				this.newEvidence.ref_url.push({
					value: ''
				});
			},
			removeRef() {
				this.newEvidence.ref_url.pop();
			},
			goToFact(factId) {
				this.$router.push({
					name: "Fact",
					params: {
						id: factId
					}
				});
			}
		},
		mounted() {}
	}
</script>

<style>
	.dropzone .dz-message {
		margin: 0px
	}
</style>

