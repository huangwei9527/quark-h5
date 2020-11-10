<template>
  <div class="clearfix my-page-list">
    <div class="page-search-wrapper bg-white">
      <el-tabs v-model="searchParams.pageMode" @tab-click="handlePageModeClick">
        <el-tab-pane :name="item.value" :disabled="item.disabled" v-for="(item, index) in pageModeList" :key="index">
          <div slot="label"><span class="nav-tabs-label">{{item.label}}</span></div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-scrollbar class="scroll-wrapper page-list-wrapper">
      <div class="page-content">
        <div class="my-page-nav-list">
          <div class="my-page-nav-item" @click="doSearch('my')" :class="{active: searchParams.type === 'my'}">
            我的作品({{myCount}})
          </div>
          <div class="my-page-nav-item" @click="doSearch('cooperation')" :class="{active: searchParams.type === 'cooperation'}">
            参与作品({{shareCount}})
          </div>
        </div>
        <!--页面列表-->
        <div class="page-item-wrapper" v-loading="loading">
          <div class="page-item">
            <thumbnailPanel :pageType="searchParams.pageMode" />
          </div>
          <div class="page-item" v-for="(item, index) in pageList" :key="index">
            <thumbnailPanel
                    @refresh="getPageList"
                    @showPreview="showPreviewFn"
                    :pageData="item"
                    :btnList="operationBtn(item.isPublish)"/>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <!--预览-->
    <previewPage v-if="showPreview" :pageId="previewId" @closePreview="showPreview = false"></previewPage>
  </div>
</template>

<script>
	import thumbnailPanel from '@/components/thumbnail-panel'
	import previewPage from './components/preview'

	export default {
		components: {
			thumbnailPanel,
			previewPage
		},
		data() {
			return {
				loading: false,
				pageList: [],
				myCount: 0,
				shareCount: 0,
				pageModeList: [],
				searchParams: {
					type: 'my',
					pageMode: 'h5'
				},
				previewId: '',
				showPreview: false,
			}
		},
		computed: {},
		created() {
			this.pageModeList = this.$config.pageModeList;
			this.getPageList();
		},
		methods: {
			// 操作按钮类型，分为我的，我的协作，和已发布的三种状态
			operationBtn(isPublished) {
				let baseBtn = ['edit', 'copyTemplate', 'setTemplate'];
				if (this.searchParams.type === 'my') {
					baseBtn = [...baseBtn, 'cooperation', 'delete']
				}
				if (this.searchParams.type === 'cooperation') {
					baseBtn = [...baseBtn, 'unCooperation']
				}
				if (isPublished) {
					baseBtn = [...baseBtn, 'copyUrl', 'viewPageData']
				} else {
					baseBtn = [...baseBtn, 'publish']
				}
				return baseBtn;
			},
			/**
			 * 搜索我的页面，type: my时搜索我的作品， type: share搜索我参与的作品
			 */
			doSearch(type) {
				this.searchParams.type = type;
				this.getPageList()
			},
			/**
			 * 切换页面类型
			 * */
			handlePageModeClick(val) {
				this.searchParams.pageMode = val.name;
				this.getPageList()
			},
			/**
			 * 获取所有页面
			 */
			getPageList() {
				this.$API.getMyPages(this.searchParams).then(res => {
					this.pageList = res.body.pages || []
          this.myCount = res.body.myPageCount;
          this.shareCount = res.body.myCooperationPageCount;
				})
			},
			showPreviewFn(id) {
				this.previewId = id;
				this.showPreview = true;
			}
		}
	}
</script>

<style lang="scss" scoped>
  .my-page-list {
    height: 100%;
  }

  .page-list-wrapper {
    height: calc(100% - 48px);
  }

  .my-page-nav-list {
    height: 40px;
    line-height: 40px;
    z-index: 2;
    margin-bottom: 20px;
    .my-page-nav-item {
      float: left;
      padding-right: 32px;
      text-align: center;
      cursor: pointer;
      &.active {
        color: $primary;
      }
      &:hover {
        color: $primary;
      }
    }
  }

  .full-input-w {
    width: 100%;
  }

  .nav-tabs-label {
    display: inline-block;
    padding: 0 16px;
    height: 60px;
    line-height: 60px;
  }

  .page-search-wrapper {
    padding: 0;
  }

  .page-item-wrapper {
    .page-item {
      float: left;
      margin-right: 20px;
      margin-bottom: 40px;
    }
  }
</style>
<style lang="scss">
  .my-page-list {
    .page-search-wrapper {
      .el-tabs__header {
        margin: 0;
      }
      .el-tabs__nav-wrap {
        padding: 0 30px;
      }
    }
  }
</style>
