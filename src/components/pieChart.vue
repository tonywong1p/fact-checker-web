<script>
	import {
		Pie
	} from 'vue-chartjs'
	
	export default {
		extends: Pie,
		props: ['data', 'options'],
		mounted() {
			this.renderChart(
				this.data, {
					responsive: true,
					maintainAspectRatio: false,
					legend: {
						display: true
					}
				})
		}
	}
</script>