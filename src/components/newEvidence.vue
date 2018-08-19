<template>
	<v-dialog v-model="dialog" width="800px">
		<v-card>
			<v-card-title>
				<h3 class="headline">New Evidence</h3>
				<v-spacer></v-spacer>
				<v-btn color="primary" dark @click="addEvidence()">Create
					<v-icon right dark>send</v-icon>
				</v-btn>
			</v-card-title>
			<v-container>
				<v-layout row wrap>
					<v-flex xs12>					            
						<v-radio-group v-model="newEvidence.support" row class="mt-0">
              <v-radio
                label="Support"
                color="success"
                value="1"
              ></v-radio>
              <v-radio
                label="Against"
                color="error"
                value="0"
              ></v-radio>
            </v-radio-group>
						<vue-dropzone id="coverImage" :options="dropzoneOptions" class="mb-4" @vdropzone-success="finishUpload"></vue-dropzone>
						<v-textarea box name="input-7-4" label="Description" v-model="newEvidence.text"></v-textarea>
					</v-flex>
				</v-layout>
				<v-layout row wrap>
					<v-flex xs10>
						<v-text-field box label="Reference URL" append-icon="link" v-for="link in newEvidence.ref_url" :key="link.id" v-model="link.value"></v-text-field>
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
				{{newEvidence}}
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
			factId: Number
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
			newEvidence: {
				image_url: "",
				text: "",
				ref_url: [{
					value: ""
				}],
				support: 1,
			},
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
			}
		},
		methods: {
			finishUpload(file, res) {
				this.newEvidence.image_url = img_server_domain + res;
			},
			addEvidence() {
				const self = this;
				let evidence = {
					fact_id: this.factId,
					text: this.newEvidence.text,
					image_url: this.newEvidence.image_url,
					ref_url: this.urlArray.toString(),
					support: this.newEvidence.support,
				};
				// eslint-disable-next-line
				console.log(evidence);
				let api = api_domain + "/facts/" + this.factId + "/evidences";
				self.axios.post(api, evidence).then(res => {
					// eslint-disable-next-line
					console.log("Added ID:" + res.data);
				});
			},
			addRef() {
				this.newEvidence.ref_url.push({
					value: ''
				});
			},
			removeRef() {
				this.newEvidence.ref_url.pop();
			}
		},
		mounted() {
		}
	}
</script>

