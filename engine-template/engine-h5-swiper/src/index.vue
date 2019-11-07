<template>
  <div class="engine-template-wrapper">
    <!--swiper-->
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide flat relative hidden"  v-for="(page, i) in pageData.pages" :key="i" :style="getCommonStyle(page.commonStyle)">
          <!--页面内容区域-->
          <div class="quark-page-wrapper" :style="getCommonStyle({...page.commonStyle, top: pageTop, height: pageData.height, width: pageData.width, position: 'relative'}, scalingRatio)">
            <componentsTemplate
                    v-for="(item, index) in page.elements"
                    :key="index"
                    :element="item"
                    :style="getCommonStyle(item.commonStyle, scalingRatio)">
            </componentsTemplate>
          </div>
        </div>
      </div>

      <div class="swiper-pagination"></div><!--分页器。如果放置在swiper-container外面，需要自定义样式。-->
    </div>
  </div>
</template>

<script>
	import editorProjectConfig from '@client/pages/editor/DataModel'
	import componentsTemplate from './components-template'
	import $config from '@client/config'

	export default {
		name: 'engineH5Swiper',
		components: {
			componentsTemplate
		},
		data() {
			return {
				getCommonStyle: editorProjectConfig.getCommonStyle,
				scalingRatio: 1,
				pageData: {
					pages: []
				},
				pageTop: 0
			}
		},
		created() {
			this.pageData = window._pageData;
			this.scalingRatio = document.body.clientWidth / $config.canvasH5Width
			this.pageTop = (document.documentElement.clientHeight - this.pageData.height * this.scalingRatio) / 2
			this.pageTop = Math.max(this.pageTop, 0);
		},
		methods: {}
	}
</script>

<style scoped>
  .engine-template-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .relative{
    position: relative;
  }
  .hidden{
    overflow: hidden;
  }
</style>
