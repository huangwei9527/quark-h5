<template>
  <el-form-item label="url地址：">
    <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入url地址"
            v-model="tempValue">
    </el-input>
  </el-form-item>
</template>

<script>
	export default {
		name: "attr-qk-url",
		props: {
			url: String
		},
		data() {
			return {
				tempValue: ''
			}
		},
		mounted() {
			this.tempValue = this.url;
		},
		watch: {
			url(val) {
				this.tempValue = val;
			},
			tempValue() {
				this.$emit('update:url', this.tempValue);
			}
		}
	}
</script>

<style scoped>

</style>
