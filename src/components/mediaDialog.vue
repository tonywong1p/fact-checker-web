<template>
	<v-dialog v-model="dialog" :fullscreen="true" >
		<v-card-media :src="media.image_url" :contain="true" height="100%">
			<v-layout row>
				<v-spacer></v-spacer>
				<v-btn flat icon @click="done" class="ma-4">
					<v-icon>clear</v-icon>
				</v-btn>
			</v-layout>
		</v-card-media>
	</v-dialog>
</template>

<script>
	const api_domain = 'http://localhost:3000/api';
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

