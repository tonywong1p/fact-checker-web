<template>
	<v-dialog v-model="dialog" width="800px" lazy persistent scrollable>
		<v-card>
			<v-card-title>
				<h3 class="headline">New Evidence</h3>
				<v-spacer></v-spacer>
				<v-btn color="primary" flat @click="done()">
					{{$t('form.cancel')}}
				</v-btn>
				<v-btn color="primary" dark @click="addEvidence()" :disabled="!valid || !newEvidence.support">
					{{$t('form.submit')}}
					<v-icon right dark>send</v-icon>
				</v-btn>
			</v-card-title>
			<v-card-text style="max-height:700px">
				<v-form ref="form" v-model="valid" lazy-validation>
					<v-layout row wrap>
						<v-flex xs12>
							<p class="grey--text">{{$t('form.standpoint')+$t('form.required')}}</p>
							<v-radio-group v-model="newEvidence.support" required row class="mt-0">
								<v-radio :label="$t('form.support')" color="success" value="1"></v-radio>
								<v-radio :label="$t('form.against')" color="error" value="0"></v-radio>
							</v-radio-group>
							<v-tabs dark slider-color="pink">
								<v-tab ripple key="0">
									{{$t('form.imageUpload')}}
								</v-tab>
								<v-tab ripple>
									{{$t('form.imageUrl')}}
								</v-tab>
								<v-tab-item>
									<vue-dropzone id="coverImage" :options="dropzoneOptions" class="mb-4" @vdropzone-success="finishUpload"></vue-dropzone>
								</v-tab-item>
								<v-tab-item>
									<v-text-field box :label="$t('form.imageUrlPlaceholder')+$t('form.optional')" v-model="newEvidence.image_url" maxlength="100"></v-text-field>
								</v-tab-item>
							</v-tabs>
							<v-textarea box name="input-7-4" :label="$t('form.description')" :counter="1000" maxlength="1000" v-model="newEvidence.text" :rules="descriptionRules" required></v-textarea>
						</v-flex>
					</v-layout>
					<v-layout row wrap>
						<v-flex xs10>
							<v-text-field box :label="$t('form.referenceUrl')+$t('form.optional')" append-icon="link" v-for="link in newEvidence.ref_url" :key="link.id" v-model="link.value"></v-text-field>
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
			</v-card-text>
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
			factId: Number,
			done: Function
		},
		data: () => ({
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
			valid: true,
		}),
		created() {
			this.dropzoneOptions.url = this.api_url + '/upload';
		},
		computed: {
			dropzoneOptions: function() {
				return ({
					paramName: "coverImage",
					thumbnailWidth: 200,
					maxFiles: 1,
					maxFilesize: 10,
					dictDefaultMessage: `<i class='material-icons' style='font-size:80px'>add_photo_alternate</i><br>${this.$t('form.dropzone')}${this.$t('form.optional')}`,
					addRemoveLinks: true,
					acceptedFiles: 'image/*'
				})
			},
			urlArray: function() {
				return this.newEvidence.ref_url.map((el) => {
					if (RegExp('^(http|https)://').test(el.value) || el.value == '') {
						return el.value
					} else {
						return 'http://' + el.value
					}
				});
			},
		},
		methods: {
			finishUpload(file, res) {
				this.newEvidence.image_url = this.media_server_url + '/' + res;
			},
			addEvidence() {
				const self = this;
				let evidence = {
					fact_id: self.factId,
					text: self.newEvidence.text,
					image_url: self.newEvidence.image_url,
					ref_url: self.urlArray,
					support: self.newEvidence.support,
				};
				evidence.ref_url = evidence.ref_url.filter((url) => {
					return url != '';
				})
				// eslint-disable-next-line
				console.log(evidence);
				let api = self.api_url + "/facts/" + self.factId + "/evidences";
				if (self.$refs.form.validate()) {
					self.axios.post(api, evidence).then(res => {
						// eslint-disable-next-line
						console.log("Added ID:" + res.data);
						self.done();
					});
				}
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

