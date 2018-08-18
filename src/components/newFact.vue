<template>
	<v-dialog v-model="dialog" width="800px">
		<v-card>
			<v-card-title>
				<h3 class="headline">New Case</h3>
				<v-spacer></v-spacer>
				<v-btn color="primary" dark @click="addFact()">Submit
					<v-icon right dark>send</v-icon>
				</v-btn>
			</v-card-title>
			<v-container>
				<v-layout row wrap>
					<v-flex xs12>
						<vue-dropzone id="coverImage" :options="dropzoneOptions" class="mb-4" @vdropzone-success="finishUpload"></vue-dropzone>
						<v-text-field box label="Title" v-model="newFact.title"></v-text-field>
						<v-textarea box name="input-7-4" label="Description" v-model="newFact.description"></v-textarea>
					</v-flex>
				</v-layout>
			</v-container>
			<v-divider></v-divider>
			<div style="max-height:350px;overflow:scroll">
				<v-container>
					<v-layout row wrap>
						<v-flex xs10>
							<v-text-field box label="Reference URL" append-icon="link" v-for="link in newFact.ref_url" :key="link.id" v-model="link.value"></v-text-field>
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
				</v-container>
				{{urlArray}}
			</div>
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
				dictDefaultMessage: "Drop to upload the cover image here",
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
		}),
		computed: {
			urlArray: function() {
				return this.newFact.ref_url.map((el)=>{
					return el.value
				});
			}
		},
		methods: {
			finishUpload(file, res) {
				this.newFact.image_url = img_server_domain + res;
			},
			addFact() {
				const self = this;
				// eslint-disable-next-line
				self.newFact.ref_url.forEach((el) => {
					el = el.value;
				});
				let fact = {
					title: this.newFact.title,
					description: this.newFact.description,
					ref_url: this.urlArray.toString(),
					image_url: this.newFact.image_url,
				};
				let api = api_domain + "/facts";
				self.axios.post(api, fact).then(res => {
					// eslint-disable-next-line
					console.log("Added:" + res.data);
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
		}
	}
</script>

