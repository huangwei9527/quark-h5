<template>
  <div class="clearfix my-page-list">
    <div class="page-search-wrapper">
      <el-tabs v-model="searchParams.pageMode" @tab-click="handlePageModeClick">
        <el-tab-pane :name="item.value" :disabled="item.disabled" v-for="(item, index) in pageModeList" :key="index">
          <div slot="label"><span class="nav-tabs-label">{{item.label}}</span></div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="page-content">
      <div class="my-page-nav-list">
        <div class="my-page-nav-item" @click="doSearch('my')" :class="{active: searchParams.type === 'my'}">我的作品({{myCount}})</div>
        <div class="my-page-nav-item" @click="doSearch('share')" :class="{active: searchParams.type === 'share'}">
          参与作品({{shareCount}})
        </div>
      </div>

      <ul class="page-item-wrapper">
        <li class="page-item create" @click="createNewPage">
          <div class="temp-create">
            <i class="el-icon-plus"></i>
            <p class="paddingT10">创建{{searchParams.pageMode | getLabelText(pageModeList)}}</p>
          </div>
        </li>
        <li class="page-item" v-for="(item, index) in pageList" :key="index">
          <span class="unpublish" v-if="!item.isPublish">未发布</span>
          <div class="header-mask">
            <div class="details-btn" @click="showPreviewFn(item._id)">预览</div>
          </div>
          <div class="cover">
            <img :src="item.coverImage || defaultCoverImage" alt="">
          </div>
          <div class="page-item-title border-T">
            <span class="item-title-i">{{item.title}}</span>
          </div>
          <div class="page-item-data-pv border-T">
            <div class="btn-wrapper">
              <el-button type="text" size="mini" @click="editPage(item._id)">编辑</el-button>
            </div>
            <div class="btn-wrapper">
              <el-button type="text" size="mini" @click="copyPage(item._id)">复制</el-button>
            </div>
            <div class="btn-wrapper">

              <el-dropdown placement="top-start">
              <span class="el-dropdown-link">
                <el-button type="text" size="mini">更多 <i class="el-icon-more-outline"></i></el-button>
              </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="!item.isPublish && searchParams.type === 'my'">
                    <div @click="publishPage(item._id, index)">发布</div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div @click="setAsTemplate(item._id)">复制为模板</div>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <div @click="showPageData(item._id)">页面数据</div>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="searchParams.type === 'my'">
                    <div @click="showAddUser(item._id)">添加成员</div>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="searchParams.type === 'my'">
                    <div @click="deletePage(item._id, index)">删除</div>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="searchParams.type === 'share'">
                    <div @click="deleteShareUserPage(item._id, index)">移出我的参与</div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div class="custom-dialog">
      <el-dialog
              title="添加成员"
              :visible.sync="dialogVisible"
              width="500px">
        <el-form class="" label-width="120px">
          <el-form-item label="用户名/姓名:">
            <el-select
                    class="full-input-w"
                    v-model="addUserForm.userIds"
                    multiple
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入用户名/姓名搜索"
                    :remote-method="remoteMethod"
                    :loading="addUserloading">
              <el-option
                      v-for="item in userDataList"
                      :key="item._id"
                      :label="item.username"
                      :value="item._id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="submitAddUser" size="small">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <!--预览-->
    <previewPage v-if="showPreview" :pageId="previewId" @closePreview="showPreview = false"></previewPage>
  </div>
</template>

<script>
	import editorProjectConfig from '../editor/DataModel'
	import previewPage from './components/preview'


	export default {
		components: {
			previewPage
		},
		data() {
			return {
				loading: false,
				defaultCoverImage: require('@client/common/images/quark--pagecover-image.jpg'),
				pageList: [],
        myCount: 0,
        shareCount: 0,
				previewId: '',
				showPreview: false,
				dialogVisible: false,
				addUserloading: false,
				userDataList: [],
				pageModeList: [{
          value: 'h5',
          label: 'H5',
          disabled: false
        }, {
					value: 'longPage',
					label: '长页H5',
					disabled: false
				}, {
					name: 'relativePage',
					label: '排版图文',
					disabled: true
				}, {
					value: 'pc',
					label: 'PC页面',
					disabled: true
				}],
				addUserForm: {
					id: "",
					userIds: []
				},
				searchParams: {
					type: 'my',
          pageMode: 'h5'
				}
			}
		},
		created() {
			this.getPageList();
			this.getPagesCount();
			this.previewId = this.$route.query.previewId || ''
			if (this.previewId) {
				this.showPreview = true;
			}
		},
		methods: {
			/**
			 * 搜索我的页面，type: my时搜索我的作品， type: share搜索我参与的作品
			 */
			doSearch(type) {
        this.searchParams.type = type;
        this.getPageList()
			},
			getPagesCount() {
				this.$axios.get('/page/myPages/count', this.searchParams).then(res => {
          this.myCount =  res.body.my
          this.shareCount =  res.body.share
				})
			},
			/**
			 * 获取所有页面
			 */
			getPageList() {
				this.$axios.get('/page/myPages', this.searchParams).then(res => {
					this.pageList = res.body || []
				})
			},
			/**
			 * 创建页面,初始化数据提交接口,然后把id拿到后跳转到编辑器页面
			 */
			createNewPage() {
				let newPageData = editorProjectConfig.getProjectConfig()
				this.loading = true;
				this.$axios.post('/page/add', {...newPageData, pageMode: this.searchParams.pageMode, author: this.$store.state.user.userId}).then(res => {
					this.loading = false;
					if (res.body) {
						this.$router.push({path: 'editor', query: {id: res.body._id}})
					}
				}).catch(() => {
					this.loading = false;
				})
			},
			/**
			 * 编辑页面
			 * @param id
			 */
			editPage(id) {
				this.$router.push({path: 'editor', query: {id: id}})
			},
			/**
			 * 复制页面
			 */
			copyPage(id) {
				this.loading = true;
				this.$axios.post('/page/copy/' + id).then(res => {
					this.loading = false;
					if (res.body) {
						this.$router.push({path: 'editor', query: {id: res.body._id}})
					}
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
						this.getPagesCount();
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
			 * 显示添加成员弹窗
			 */
			showAddUser(id) {
				this.addUserForm.id = id
				this.dialogVisible = true;
			},
			/**
			 * 搜索成员
			 */
			remoteMethod(query) {
				if (query !== '') {
					this.addUserloading = true;
					this.$axios.get('/user/list/search', {keywords: query}).then(res => {
						this.addUserloading = false;
						this.userDataList = res.body || []
					}).catch(() => {
						this.addUserloading = false;
					})
				} else {
					this.options = [];
				}
			},
			/**
			 * 提交添加的用户
			 * */
			submitAddUser() {
				this.loading = true;
				this.$axios.post('/page/shareToUser/' + this.addUserForm.id, {userIds: this.addUserForm.userIds}).then(() => {
					this.loading = false;
					this.dialogVisible = false;
					this.$message.success('已添加！')
				}).catch(() => {
					this.loading = false;
				})
			},
			/**
			 * 从我的参与作品中移出
			 * */
			deleteShareUserPage(id, index){
				this.$confirm('确认从我的参与作品中删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.loading = true;
					this.$axios.post('/page/deleteShareToUser/' + id).then(() => {
						this.loading = false;
						// 从页面删除
						this.pageList.splice(index, 1)
						this.getPagesCount();
					}).catch(() => {
						this.loading = false;
					})
				})
      },
			/**
			 * 跳转到数据统计页面
			 */
			showPageData(id) {
				this.$router.push({name: 'pageDataDetail', query: {id: id}})
			},
			/**
			 * 设为模板
			 * @param id
			 */
			setAsTemplate(id) {
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
			 * 发布页面
			 */
			publishPage(id, index) {
				this.loading = true;
				this.$axios.post('/page/publish/' + id).then(() => {
					this.loading = false;
					this.$alert('页面发布成功！', '操作提示', {
						confirmButtonText: '确定'
					});
					this.pageList[index].isPublish = true;
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
        this.getPagesCount()
      }
		}
	}
</script>

<style lang="scss" scoped>
  .my-page-list {
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
    .unpublish {
      position: absolute;
      top: 0;
      left: 0;
      font-size: 12px;
      display: block;
      padding: 0 10px;
      height: 30px;
      line-height: 30px;
      background-color: #76838f;
      color: #fff;
      border-top-left-radius: 4px;
      border-bottom-right-radius: 12px;
      z-index: 10;
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
      height: 100%;
      border: 1px solid #e6ebed;
      border-radius: 3px;
      margin-bottom: 18px;
      padding-top: 104px;
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

  .full-input-w {
    width: 100%;
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
