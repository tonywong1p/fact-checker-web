<template>
	<v-dialog v-model="dialog" width="800px">
		<v-card>
			<v-card-title>
				<h3 class="headline">New Case</h3>
				<v-spacer></v-spacer>
				<v-btn color="primary" dark @click="addFact()" :disabled="!valid || newFact.image_url==''">Create
					<v-icon right dark>send</v-icon>
				</v-btn>
			</v-card-title>
			<v-container>
				<v-form ref="form" v-model="valid" lazy-validation>
					<v-layout row wrap>
						<v-flex xs12>
							<vue-dropzone id="coverImage" :options="dropzoneOptions" class="mb-4" @vdropzone-success="finishUpload"></vue-dropzone>
							<v-text-field box label="Title" :rules="titleRules" v-model="newFact.title" maxlength="100"></v-text-field>
							<v-textarea box name="input-7-4" label="Description" :rules="descriptionRules" :counter="1000" maxlength="1000" v-model="newFact.description"></v-textarea>
						</v-flex>
					</v-layout>
					<v-layout row wrap>
						<v-flex xs10>
							<v-text-field box label="Reference URL (optional)" append-icon="link" v-for="link in newFact.ref_url" :key="link.id" v-model="link.value"></v-text-field>
						</v-flex>
						<v-flex xs1>
							<v-btn flat icon @click="addRef()">
								<v-icon>add</v-icon>
							</v-btn>
						</v-flex>
						<v-flex xs1 v-if="newFact.ref_url.length > 1">
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
		},
		data: () => ({
			dropzoneOptions: {
				url: api_domain + '/upload',
				paramName: "coverImage",
				thumbnailWidth: 200,
				maxFiles: 1,
				maxFilesize: 5,
				dictDefaultMessage: "Drop to upload the cover image here (required)",
				addRemoveLinks: true,
			},
			newFact: {
				title: "",
				description: "",
				ref_url: [{
					value: ""
				}],
				image_url: ""
			},
			titleRules: [
				v => !!v || 'Title is required',
			],
			descriptionRules: [
				v => !!v || 'Description is required',
			],
			valid: false,
		}),
		computed: {
			urlArray: function() {
				return this.newFact.ref_url.map((el) => {
					if (RegExp('^(http|https)://').test(el.value)) {
						return el.value
					} else {
						return 'http://' + el.value
					}
				});
			}
		},
		methods: {
			finishUpload(file, res) {
				this.newFact.image_url = img_server_domain + res;
			},
			addFact() {
				const self = this;
				let fact = {
					title: self.newFact.title,
					description: self.newFact.description,
					ref_url: self.urlArray.toString(),
					image_url: self.newFact.image_url,
				};
				let api = api_domain + "/facts";
				self.axios.post(api, fact).then(res => {
					// eslint-disable-next-line
					console.log("Added ID:" + res.data);
					self.goToFact(res.data);
				});
			},
			addRef() {
				this.newFact.ref_url.push({
					value: ''
				});
			},
			removeRef() {
				this.newFact.ref_url.pop();
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
		mounted() {
			this.clearNewFact()
		}
	}
</script>

