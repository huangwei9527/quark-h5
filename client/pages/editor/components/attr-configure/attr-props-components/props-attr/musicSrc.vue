<template>
  <el-form-item label="资源地址：">
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
		name: "attr-qk-musicSrc",
		props: {
			musicSrc: String
		},
		data() {
			return {
				tempValue: ''
			}
		},
		mounted() {
			this.tempValue = this.musicSrc;
		},
		watch: {
			musicSrc(val) {
				this.tempValue = val;
			},
			tempValue() {
				this.$emit('update:musicSrc', this.tempValue);
			}
		}
	}
</script>

<style scoped>

</style>
