<template>
	<div>
		<span><span class="green--text">{{supportTrust}} trust<span v-if="supportTrust>1">s</span></span> vs <span class="red--text">{{againstTrust}} trust<span v-if="againstTrust>1">s</span></span>
		</span>
		<v-progress-linear style="border-radius:5px" background-color="error" color="success" :value="supportTrust/(supportTrust+againstTrust)*100"></v-progress-linear>
	</div>
</template>

<script>
	export default {
		props: ['supportTrust', 'againstTrust']
	}
</script>