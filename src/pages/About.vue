<template>
	<v-content>
		<v-container grid-list-xl class="mt-3">
			<v-layout justify-center wrap v-if="!isLoading" class="animated fadeIn">
				<v-flex xs12 sm8 md6>
					<h3 class="display-1 mb-3 grey--text">What is Fact Checking?</h3>
					<p class="body-1">Fact checking is the act of checking factual assertions in non-fictional text in order to determine the veracity and correctness of the factual statements in the text. This may be done either before (ante hoc) or after (post hoc) the text has been
						published or otherwise disseminated.</p>
					<v-divider class="my-5"></v-divider>
					<h3 class="display-1 mb-3 grey--text">Fact Checker</h3>
					<v-layout wrap>
						<v-flex xs12 sm4>
							<v-layout align-center justify-center column>
								<v-icon size="80" class="my-3 pink--text">contacts</v-icon>
								<span class="title">Anonymous</span>
							</v-layout>
						</v-flex>
						<v-flex xs12 sm4>
							<v-layout align-center justify-center column>
								<v-icon size="80" class="my-3 pink--text">how_to_vote</v-icon>
								<span class="title">All we vote</span>
							</v-layout>
						</v-flex>
						<v-flex xs12 sm4>
							<v-layout align-center justify-center column>
								<v-icon size="80" class="my-3 pink--text">style</v-icon>
								<span class="title">Any topic</span>
							</v-layout>
						</v-flex>
					</v-layout>
					<v-divider class="my-5"></v-divider>
					<h3 class="display-1 mb-3 grey--text">Creator</h3>
					<v-layout align-center justify-center column>
						<v-avatar size="150" color="grey lighten-4" class="mb-2">
							<img src="../assets/avatar.png" alt="avatar">
						</v-avatar>
						<span class="title">TonyWW@HK</span>
						<v-flex>
							<v-btn icon flat large href="https://www.linkedin.com/in/tony-wong-siu-fai-28186761/" target="_blank"><i class="fab fa-linkedin fa-3x"></i></v-btn>
							<v-btn icon flat large href="https://github.com/tonywong1p" target="_blank"><i class="fab fa-github fa-3x"></i></v-btn>
						</v-flex>
					</v-layout>
				</v-flex>
			</v-layout>
		</v-container>
	</v-content>
</template>

<script>
	export default {
		components: {},
		props: {
			isAdmin: Boolean
		},
		data: () => ({}),
		methods: {},
		mounted() {}
	};
</script>

<style>
	.truncate {
		display: block;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
