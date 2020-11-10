<template>
  <div class="clearfix my-page-list">
    <div class="page-search-wrapper bg-white">
      <el-tabs v-model="searchParams.pageMode" @tab-click="handlePageModeClick">
        <el-tab-pane :name="item.value" :disabled="item.disabled" v-for="(item, index) in pageModeList" :key="index">
          <div slot="label"><span class="nav-tabs-label">{{item.label}}</span></div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="scroll-wrapper page-list-wrapper">
      <el-scrollbar style="height: 100%;" v-if="pageList.length">
        <div class="page-content" v-loading="loading">
          <!--页面列表-->
          <div class="page-item-wrapper">
            <div class="page-item" v-for="(item, index) in pageList" :key="index">
              <thumbnailPanel
                      @refresh="getPageList"
                      @showPreview="showPreviewFn"
                      :pageData="item"
                      :btnList="['edit', 'useTemplate', 'publishTemplate', 'delete']"
                      :showPublishState="false" />
            </div>
          </div>
        </div>
      </el-scrollbar>
      <notFundData v-else />
    </div>
    <!--预览-->
    <previewPage v-if="showPreview" :pageId="previewId" @closePreview="showPreview = false"></previewPage>
  </div>
</template>

<script>
	import notFundData from '@client/components/notFundData'
	import thumbnailPanel from '@/components/thumbnail-panel'
	import previewPage from './components/preview-template'
	export default {
		components: {
			notFundData,
			thumbnailPanel,
			previewPage
		},
		data() {
			return {
				loading: false,
				pageList: [],
				pageModeList: [],
				searchParams: {
					pageMode: 'h5'
				},
				previewId: '',
				showPreview: false,
			}
		},
		created() {
			this.pageModeList = this.$config.pageModeList;
			this.previewId = this.$route.query.previewId || ''
			if (this.previewId) {
				this.showPreview = true;
			}
			this.getPageList();
		},
		methods: {
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
				this.$API.getMyTemplates(this.searchParams).then(res => {
					this.pageList = res.body || [];
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
    height: 100%;
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
