<template>
  <div class="components-page-manage scrollbar-wrapper">
    <p class="page-title text-center">页面管理</p>
    <el-scrollbar style="height: 100%;" class="components-main-conten">
      <!--加载页面设置-->
      <!--<div class="page-item clearfix">-->
        <!--<div class="inline-block">-->
          <!--<span class="page-item-index"><i class="iconfont iconloading"></i></span>-->
          <!--加载页-->
        <!--</div>-->
        <!--<div class="pull-right custom-loading-btn">-->
          <!--<el-button size="mini">自定义设置</el-button>-->
        <!--</div>-->
      <!--</div>-->
      <div class="page-item clearfix"
           v-for="(item, index) in projectData.pages"
           :key="item.uuid"
           @click="changeActivePage(item)"
           :class="{active: activePageUUID === item.uuid}">
        <div class="inline-block">
          <span class="page-item-index">{{index + 1}}</span>
          第{{index + 1}}页
        </div>
        <div class="page-item-btn-wrapper pull-right width20">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-more-outline"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div class="btn-item" @click="copyPage(item)"><i class="el-icon-document-copy"></i> 复制页面</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div class="btn-item" @click="addPage(item)"><i class="el-icon-document-add"></i> 新增页面</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div class="btn-item" @click="deletePage(item)"><i class="el-icon-delete"></i> 删除页面</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-scrollbar>
    <div class="bottom-btn-wrapper">
      <el-button type="primary" size="small"  @click="addPage()">新增空页面</el-button>
    </div>
  </div>
</template>

<script>
	import {mapState} from 'vuex'

	export default {
		computed: {
			...mapState({
				projectData: state => state.editor.projectData,
				activePageUUID: state => state.editor.activePageUUID,
				activeElementUUID: state => state.editor.activeElementUUID
			})
		},
		methods: {
			/**
			 * 切换选中页面
			 * @param item
			 */
			changeActivePage(item) {
				this.$store.dispatch('setActivePageUUID', item.uuid)
			},
			copyPage(item) {
				this.$store.dispatch('copyPage', item.uuid)
			},
			addPage(item) {
				this.$store.dispatch('addPage', item ? item.uuid : '')
			},
			deletePage(item) {
				this.$store.dispatch('deletePage', item.uuid)
			}
		}
	}
</script>

<style lang="scss" scoped>
  .components-page-manage{
    height: 100%;
    padding-top: 60px;
    padding-bottom: 60px;
    position: relative;
  }
  .page-title{
    position: absolute;
    top: 16px;
    left: 0;
    width: 100%;
  }
  .page-item {
    height: 70px;
    line-height: 70px;
    width: 100%;
    cursor: pointer;
    transition: all 0.28s;
    border-bottom: 1px solid #e6ebed;
    background: white;
    color: #666666;
    padding: 0 10px;
    display: flex;
    &>.pull-right{
      width: 20px;
      &.custom-loading-btn{
        width: 84px;
      }
    }
    &>.inline-block{
      flex: 1;
    }
    &:hover {
      background-color: #eee;
      .page-item-btn-wrapper {
        display: block;
        opacity: 1;
      }
    }
    &.active {
      background-color: #eee;
      color: #111;
      .page-item-index{
        background: $primary;
        color: white;
      }
    }
    .page-item-index{
      display: inline-block;
      width: 24px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      border-radius: 12px;
      background-color: #ccc;
      color: #fff;
      margin-right: 8px;
    }
    .page-item-btn-wrapper {
      .btn-item {
        display: inline-block;
        padding: 4px 4px;
        font-size: 18px;
        transition: all 0.28s;
        &:hover {
          color: $primary;
          transform: scale(1.05);
        }
      }
    }
  }
  .bottom-btn-wrapper{
    position: absolute;
    left: 0;
    bottom: 0;
    height: 60px;
    text-align: center;
    width: 100%;
    padding-top: 12px;
  }
</style>
