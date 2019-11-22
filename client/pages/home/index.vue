<template>
  <div class="page-home">
    <div class="home-side-bar">
      <el-menu default-active="/page-list" router>
        <el-menu-item index="/page-list">
          <i class="el-icon-mobile"></i>
          <span slot="title">我的作品</span>
        </el-menu-item>
        <el-menu-item index="/my-template">
          <i class="el-icon-document"></i>
          <span slot="title">我的模板</span>
        </el-menu-item>
        <el-menu-item index="/page-data">
          <i class="el-icon-menu"></i>
          <span slot="title">我的数据</span>
        </el-menu-item>
        <el-menu-item index="/template-list">
          <i class="el-icon-s-shop"></i>
          <span slot="title">创意模板</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="clearfix my-page-list">
      <router-view class="sub-page"/>
    </div>
  </div>
</template>

<script>

	export default {

	}
</script>

<style lang="scss" scoped>
  .page-home {
    display: flex;
    width: 100%;
    height: 100%;
    background: rgb(240, 243, 244);
    .home-side-bar{
      width: 200px;
      background-color: #fff;
      border-right: 1px solid #e6ebed;
      padding-top: 8px;
      z-index: 2;
    }
    .my-page-list{
      flex: 1;
      height: 100%;
      .sub-page{
        height: 100%;
      }
    }
  }

</style>
