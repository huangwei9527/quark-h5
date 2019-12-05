<template>
  <div class="clearfix my-page-list">
    <div class="page-search-wrapper">
      <el-tabs v-model="searchParams.pageMode" @tab-click="handlePageModeClick">
        <el-tab-pane name="h5"><div slot="label"><span class="nav-tabs-label">H5</span></div></el-tab-pane>
        <el-tab-pane name="longPage"><div slot="label"><span class="nav-tabs-label">长页H5</span></div></el-tab-pane>
        <el-tab-pane name="relative"><div slot="label"><span class="nav-tabs-label">排版图文</span></div></el-tab-pane>
        <el-tab-pane name="pc"><div slot="label"><span class="nav-tabs-label">PC页面</span></div></el-tab-pane>
      </el-tabs>
    </div>
    <div class="page-content">
      <ul class="page-item-wrapper">
        <li class="page-item" v-for="(item, index) in pageList" :key="index">
          <div class="header-mask">
            <div class="details-btn" @click="showPreviewFn(item._id)">预览</div>
          </div>
          <div class="cover">
            <img :src="item.coverImage || defaultCoverImage" alt="">
          </div>
          <div class="page-item-title border-T">
            <span class="item-title-i">未命名页面</span>
          </div>
          <div class="page-item-data-pv border-T">
            <div class="btn-wrapper">
              <el-button type="text" size="mini" @click="copyPage(item._id)">使用模板</el-button>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <notFundData v-if="!pageList.length" />
    <!--预览-->
    <previewPage v-if="showPreview" :pageId="previewId" @closePreview="showPreview = false"></previewPage>
  </div>
</template>

<script>
	import editorProjectConfig from '../editor/DataModel'
	import previewPage from './components/preview'
	import notFundData from '@client/components/notFundData'
	export default {
		components: {
			previewPage,
			notFundData
		},
		data() {
			return {
				loading: false,
				defaultCoverImage: require('@client/common/images/quark--pagecover-image.jpg'),
				pageList: [],
				previewId: '',
				showPreview: false,
				searchParams: {
					pageMode: 'h5'
				}
			}
		},
		created() {
			this.getPageList();
			this.previewId = this.$route.query.previewId || ''
			if (this.previewId) {
				this.showPreview = true;
			}
		},
		methods: {
			/**
			 * 获取所有页面
			 */
			getPageList() {
				this.$axios.get('/page/templateShop/list', this.searchParams).then(res => {
					this.pageList = res.body || []
				})
			},
			/**
			 * 编辑页面
			 * @param id
			 */
			editPage(id) {
				this.$router.push({path: 'editor', query: {id: id, isTemplate: true}})
			},
			/**
			 * 复制页面
			 */
			copyPage(id) {
				this.loading = true;
				this.$axios.post('/page/copy/' + id).then(res => {
					this.loading = false;
					this.$confirm('已添加至"我的作品"中?', '提示', {
						confirmButtonText: '立即编辑',
						cancelButtonText: '再逛逛',
						type: 'success'
					}).then(() => {
						this.$router.push({path: 'editor', query: {id: res.body._id}})
					}).catch(() => {})
				}).catch(() => {
					this.loading = false;
				})
			},
			/**
			 * 删除页
			 * @param id
			 * @param index
			 */
			deletePage(id, index) {
				this.$confirm('此操作将永久删除该页面, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.loading = true;
					this.$axios.delete('/page/delete/' + id).then(() => {
						this.loading = false;
						// 从页面删除
						this.pageList.splice(index, 1)
					}).catch(() => {
						this.loading = false;
					})
				})
			},
			showPreviewFn(id) {
				this.previewId = id
				this.showPreview = true;
			},
			/**
			 * 添加成员
			 */
			showAddUser(){

			},
			/**
			 * 设为模板
			 * @param id
			 */
			setAsTemplate(id){
				this.loading = true;
				this.$axios.post('/page/setTemplate/' + id).then(() => {
					this.loading = false;
					this.$alert('已添加到我的模板库', '操作提示', {
						confirmButtonText: '确定'
					});
				}).catch(() => {
					this.loading = false;
				})
			},
			/**
			 * 切换页面类型搜索添加
			 * @param data
			 */
			handlePageModeClick(){
				this.getPageList()
			}
		}
	}
</script>

<style lang="scss" scoped>
  .my-page-list {
  }

  .page-item {
    width: 224px;
    height: 296px;
    border-radius: 4px;
    overflow: hidden;
    float: left;
    margin-bottom: 24px;
    background: white;
    position: relative;
    transition: all 0.28s;
    &:hover {
      box-shadow: 0 0 16px 0 rgba(0, 0, 0, .16);
      transform: translate3d(0, -2px, 0);
      .header-mask {
        opacity: 1;
      }
    }
    .header-mask {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      background-color: rgba(0, 0, 0, .8);
      width: 224px;
      height: 224px;
      border-radius: 4px 4px 0 0;
      padding-top: 92px;
      text-align: center;
      transition: top .28s ease, opacity .28s ease, height .28s ease;
      .details-btn {
        display: inline-block;
        width: 120px;
        height: 44px;
        font-size: 18px;
        line-height: 44px;
        border-radius: 22px;
        border: 1px solid #fff;
        color: #fff;
        cursor: pointer;
      }
    }
    .cover {
      width: 224px;
      height: 224px;
      background-size: cover;
      justify-content: center;
      align-items: center;
      display: flex;
      img {
        display: inline-block;
        max-width: 100%;
        max-height: 100%;
      }
    }
    .page-item-title {
      .item-title-i {
        display: inline-block;
        width: 85%;
        font-size: 14px;
        height: 36px;
        line-height: 36px;
        color: #111;
        transition: transform .2s ease;
        background-color: #fff;
        padding: 0 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        float: left;
      }
    }
    .page-item-data-pv {
      width: 100%;
      display: flex;
      .btn-wrapper {
        flex: 1;
        text-align: center;
      }
    }
  }

  .page-item:not(:nth-child(4n+1)) {
    margin-left: calc((100% - 224px * 4) / 3);
  }

  .page-item.create {
    padding: 16px;
    text-align: center;
    .temp-create {
      display: inline-block;
      width: 192px;
      height: 204px;
      border: 1px solid #e6ebed;
      border-radius: 3px;
      margin-bottom: 18px;
      padding-top: 70px;
      transition: all 0.28s;
      cursor: pointer;
      &:hover {
        color: $primary;
        border-color: $primary;
      }
    }
    .null-create {
      display: inline-block;
      width: 192px;
      height: 42px;
      line-height: 42px;
      border: 1px solid #e6ebed;
      transition: all 0.28s;
      cursor: pointer;
      &:hover {
        color: $primary;
        border-color: $primary;
      }
    }
  }

  .nav-tabs-label{
    display: inline-block;
    padding: 0 16px;
    height: 60px;
    line-height: 60px;
  }
  .page-search-wrapper{
    padding: 0;
  }
</style>

<style lang="scss">
  .my-page-list{
    .page-search-wrapper{
      .el-tabs__header{
        margin: 0;
      }
      .el-tabs__nav-wrap{
        padding: 0 30px;
      }
    }
  }
</style>
