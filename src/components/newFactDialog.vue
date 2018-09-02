<template>
	<v-dialog v-model="dialog" width="800px" lazy>
		<v-card>
			<v-card-title>
				<h3 class="headline">New Case</h3>
				<v-spacer></v-spacer>
				<v-btn color="primary" flat @click="done()">
					Cancel
				</v-btn>
				<v-btn color="primary" dark @click="addFact()" :disabled="!valid">Create
					<v-icon right dark>send</v-icon>
				</v-btn>
			</v-card-title>
			<v-container>
				<v-form ref="form" v-model="valid" lazy-validation>
					<v-layout row wrap>
						<v-flex xs12>
							<v-tabs dark slider-color="pink">
								<v-tab ripple key="0">
									Upload
								</v-tab>
								<v-tab ripple>
									URL
								</v-tab>
								<v-tab-item>
									<vue-dropzone id="coverImage" :options="dropzoneOptions" class="mb-4" @vdropzone-success="finishUpload"></vue-dropzone>
								</v-tab-item>
								<v-tab-item>
									<v-text-field box label="Cover image URL" :rules="imageUrlRules" v-model="newFact.image_url" maxlength="100" required></v-text-field>
								</v-tab-item>
							</v-tabs>
							<v-text-field box label="Title" :rules="titleRules" v-model="newFact.title" maxlength="100" required></v-text-field>
							<v-flex xs12>
								<v-combobox v-model="selectedTags" :items="tags" label="I use chips" multiple chips></v-combobox>
							</v-flex>
							<v-textarea box name="input-7-4" label="Description" :rules="descriptionRules" :counter="1000" maxlength="1000" v-model="newFact.description" required></v-textarea>
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
	export default {
		components: {
			vueDropzone: vue2Dropzone,
		},
		props: {
			dialog: Boolean,
			done: Function
		},
		data: () => ({
			dropzoneOptions: {
				paramName: "coverImage",
				thumbnailWidth: 200,
				maxFiles: 1,
				maxFilesize: 10,
				dictDefaultMessage: "<i class='material-icons' style='font-size:80px'>add_photo_alternate</i><br>Drop to upload the cover image here (required) (max 10MB)",
				addRemoveLinks: true,
				acceptedFiles: 'image/*'
			},
			newFact: {
				title: "",
				description: "",
				ref_url: [{
					value: ""
				}],
				image_url: ""
			},
			imageUrlRules: [
				v => !!v || 'Cover image is required',
			],
			titleRules: [
				v => !!v || 'Title is required',
			],
			descriptionRules: [
				v => !!v || 'Description is required',
			],
			valid: true,
			tags: [],
			selectedTags: [],
		}),
		created() {
			this.dropzoneOptions.url = this.api_url + '/upload';
		},
		computed: {
			urlArray: function() {
				return this.newFact.ref_url.map((el) => {
					if (RegExp('^(http|https)://').test(el.value) || el.value=='') {
						return el.value
					} else {
						return 'http://' + el.value
					}
				});
			}
		},
		methods: {
			finishUpload(file, res) {
				this.newFact.image_url = this.media_server_url + '/' + res;
			},
			addFact() {
				const self = this;
				let fact = {
					title: self.newFact.title,
					description: self.newFact.description,
					ref_url: self.urlArray,
					image_url: self.newFact.image_url,
					tags: self.selectedTags,
				};
				fact.ref_url = fact.ref_url.filter((url)=>{
					return url != '';
				})
				let api = self.api_url + "/facts";
				if (self.$refs.form.validate()) {
					self.axios.post(api, fact).then(res => {
						// eslint-disable-next-line
						console.log("Added ID:" + res.data);
						self.goToFact(res.data.insertId);
					});
				}
			},
			getTags() {
				const self = this;
				let api = self.api_url + "/tags";
				self.axios.get(api).then((res)=>{
					self.tags = res.data.map((tag)=>{
						return tag.tag
					})
				})
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
			},
		},
		mounted() {
			this.getTags();
		}
	}
</script>

<style>
	.dropzone .dz-message {
		margin: 0px
	}
</style>

