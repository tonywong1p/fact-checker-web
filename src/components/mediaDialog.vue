<template>
	<v-dialog v-model="dialog" :fullscreen="true">
		<div style="height:100%;width:100%; background: rgba(0, 0, 0, 0.5);position:absolute"></div>
		<v-card-media :src="media.image_url" :contain="true" height="100%">
			<v-layout row>
				<v-spacer></v-spacer>
				<v-btn icon color="grey" @click="done()" class="ma-4">
					<v-icon>clear</v-icon>
				</v-btn>
			</v-layout>
		</v-card-media>
	</v-dialog>
</template>

<script>
	export default {
		props: {
			dialog: Boolean,
			media: Object,
			done: Function
		},
		data: () => ({}),
		methods: {},
		mounted() {}
	}
</script>

