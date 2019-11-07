<template>
  <el-scrollbar class="components-attr-edit">
    <div class="attr-edit-inner" v-if="activeElementUUID">
      <div class="props-attr-style">
        <propsAttr></propsAttr>
      </div>
      <div class="common-attr-style">
        <baseAttr></baseAttr>
      </div>
    </div>
    <div v-else>
      <p class="gray paddingT30 text-center">请在画板上选择需要编辑得元素</p>
    </div>
  </el-scrollbar>
</template>

<script>
	import baseAttr from './attr-props-components/base-attr'
	import propsAttr from './attr-props-components/props-attr/index.vue'
	import {mapState, mapGetters} from 'vuex'

	export default {
		props: {},
		components: {
			baseAttr,
			propsAttr
		},
		computed: {
			...mapState({
				projectData: state => state.editor.projectData,
				activePageUUID: state => state.editor.activePageUUID,
				activeElementUUID: state => state.editor.activeElementUUID
			}),
			...mapGetters([
				'currentPageIndex',
				'activeElementIndex'
			])
		}
	}
</script>

<style scoped>
  .components-attr-edit {
    height: 100%;
  }

  .attr-title {
    font-weight: bold;
  }

  .sizeAndPosition-wrapper {
    display: flex;
    width: 100%;
  }
</style>
<style lang="scss">
  .common-attr-style {
    .el-form-item {
      margin-bottom: 0;
    }
  }
</style>
