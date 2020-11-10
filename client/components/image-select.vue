/**
切换图片，提供图片选择，图片上传等功能
*/
<template>
  <div class="component-image-select" @click="handleClick">
    <img :src="url" alt="" v-if="url">
    <div class="image-preview-null" v-else>
      <i class="el-icon-plus"></i>
      <p>选择图片</p>
    </div>
  </div>
</template>

<script>
	import $bus from '@client/eventBus'

	export default {
		props: {
			url: String
		},
		data() {
			return {
				// 唯一得id用于选择图片后事件通知
				selectId: +new Date()
			}
		},
		created() {
			$bus.$on('select-image', this.changeIamge)
		},
		methods: {
			changeIamge(id, url) {
				if (id !== this.selectId) {
					return;
				}
				this.$emit('update:url', url)
				this.$emit('change', url)
			},
			/**
       * 点击弹出选择图片弹窗
			 */
			handleClick(){
				$bus.$emit('show-select-image', this.selectId)
      }
		}
	}
</script>

<style lang="scss" scoped>
  .component-image-select {
    width: 100px;
    height: 100px;
    border: 1px dashed $primary;
    border-radius: 3px;
    margin-bottom: 18px;
    text-align: center;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.28s;
    position: relative;
    background: #eee 50%/contain no-repeat;
    justify-content:center;
    align-items:center;
    display: flex;
    &:hover {
      color: $primary;
    }
    img{
      display: inline-block;
      max-width: 100%;
      max-height: 100%;
    }
  }

  .image-preview-null {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding-top: 35px;
    background: rgba(0, 0, 0, 0.2);
  }
</style>
