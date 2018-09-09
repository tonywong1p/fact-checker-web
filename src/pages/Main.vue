<template>
	<v-content class="pa-0">
		<v-tabs v-model="tab" class="tab-bar" fixed-tabs centered icons-and-text>
			<v-tabs-slider color="yellow" class="bottom-tab-slider"></v-tabs-slider>
			<v-tab href="#tab-1" class="grey darken-3 bottom-tab" :class="{'darken-4':tab!='tab-1'}">
				Facts
				<v-icon>view_day</v-icon>
			</v-tab>
			<v-tab href="#tab-2" class="grey darken-3 bottom-tab" :class="{'darken-4':tab!='tab-2'}">
				Bookmarks
				<v-icon>bookmarks</v-icon>
			</v-tab>
		</v-tabs>
		<v-tabs-items v-model="tab">
			<v-tab-item id="tab-1">
				<facts :search="search" :tagFilter="tagFilter" :isAdmin="isAdmin"></facts>
			</v-tab-item>
			<v-tab-item id="tab-2">
				<bookmark></bookmark>
			</v-tab-item>
		</v-tabs-items>
	</v-content>
</template>

<script>
	import Facts from "@/pages/Facts.vue";
	import Bookmark from "@/pages/Bookmark.vue";
	
	export default {
		components: {
			Facts,
			Bookmark
		},
		props: {
			search: String,
			tagFilter: String,
			isAdmin: Boolean
		},
		data: () => ({
			tab: 'tab-1',
		}),
		methods: {},
		mounted() {}
	};
</script>

<style>
	.tab-bar {
		position: fixed;
		bottom: 0px;
		z-index: 1;
		width: 100%
	}

	.bottom-tab {
		width: 50%
	}

	.bottom-tab-slider {
		height:5px
	}
</style>