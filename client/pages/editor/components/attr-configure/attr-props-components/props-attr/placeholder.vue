<template>
  <el-form-item label="占位提示文字：">
    <div>
      <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入占位提示文字"
              v-model="tempText">
      </el-input>
    </div>
  </el-form-item>
</template>

<script>
	export default {
		name: "attr-qk-placeholder",
		props: {
			placeholder: String
		},
		data() {
			return {
				tempText: ''
			}
		},
		mounted() {
			this.tempText = this.placeholder;
		},
		watch: {
			placeholder(val) {
				this.tempText = val;
			},
			tempText() {
				this.$emit('update:placeholder', this.tempText)
			}
		}
	}
</script>

<style scoped>

</style>
