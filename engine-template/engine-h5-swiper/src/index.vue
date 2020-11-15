<template>
  <div class="engine-template-wrapper hidden">
    <!--swiper-->
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide flat relative hidden" v-for="(page, i) in pageData.pages" :key="i"
             :style="getCommonStyle(page.commonStyle)">
          <!--页面内容区域-->
          <div class="quark-page-wrapper"
               :style="getCommonStyle({...page.commonStyle, top: pageTop, height: pageData.height, width: pageData.width, position: 'relative'}, scalingRatio)">
            <componentsTemplate
                    v-for="(item, index) in page.elements"
                    :key="index"
                    :loaded="item._loaded"
                    @handleElementClick="handleElementClick"
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
				pageTop: 0,
				activeIndex: 0,
			}
		},
		created() {
			let pageData = window._pageData;
			this.scalingRatio = document.body.clientWidth / $config.canvasH5Width;
			this.pageTop = (document.documentElement.clientHeight - pageData.height * this.scalingRatio) / 2
			this.pageTop = Math.max(this.pageTop, 0);

			// 将组件加个状态标识
			pageData.pages.forEach((page, index) => {
				page.elements.forEach(e => {
					e._loaded = (index === 0);
        })
      })
      this.pageData = pageData;
		},
		mounted() {
			let that =this;
			// 判断翻页类型
			var direction = this.pageData.flipType === 0 ? 'vertical' : 'horizontal'
			var showSlideNumber = !!this.pageData.slideNumber
			new window.Swiper('.swiper-container', {
				direction: direction,
				loop: false,
				pagination: showSlideNumber ? { el: '.swiper-pagination'} : {},
				scrollbar: {
					el: '.swiper-scrollbar',
				},
				on:{
					slideChange: function(){
						that.onSwipe(this.activeIndex);
					},
				},
			});
		},
		methods: {
			onSwipe(index) {
				this.activeIndex = index;
				this.pageData.pages[this.activeIndex].elements.forEach(e => {
					e._loaded = true;
        })
			}
    }
	}
</script>

<style scoped>
  .engine-template-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }


  .relative {
    position: relative;
  }
  .hidden {
    overflow: hidden;
  }
</style>
