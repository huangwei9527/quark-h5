<template>
  <div class="upload-psd-btn-wrapper">
    <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            :before-upload="beforeUpload"
            accept=".psd"
            :show-file-list="false">
        <slot></slot>
    </el-upload>
  </div>
</template>

<script>
	export default {
		methods: {
			beforeUpload(file){
				if(file.size > 20 * 1024 * 1024){
					this.$message.error('psd文件不能超过20M！')
					return;
				}
				let temp1 = file.name.split('.')
				let temp = temp1[temp1.length - 1]
				if (!['psd'].includes(temp)) {
					this.$message.error('请上传psd文件')
					return false;
				}
        this.uploadPsd(file);
				return false;
      },
      uploadPsd(file){
				let params  = new FormData()
        params.append('file', file);
				this.$axios.post('/common/psdPpload' ,params).then(res => {
					this.$emit('upload-success', res.body || [])
        })
      }
    }
	}
</script>

<style lang="scss" scoped>
.upload-psd-btn-wrapper{
  display: inline-block;
}
</style>
