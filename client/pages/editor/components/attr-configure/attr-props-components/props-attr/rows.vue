<template>
  <el-form-item label="占行数：">
    <el-input-number size="mini" v-model="temp" controls-position="right" :min="1" />
  </el-form-item>
</template>

<script>
	export default {
		name: "attr-qk-rows",
		props: {
			rows: Number
		},
		data() {
			return {
				temp: 3
			}
		},
		mounted() {
			this.temp = this.rows;
		},
		watch: {
			rows(val) {
				this.temp = val;
			},
			tempText() {
				this.$emit('update:rows', this.temp)
			}
		}
	}
</script>

<style scoped>

</style>
