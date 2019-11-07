<template>
  <div id="app" :class="{hideHeader: $route.meta.hideHeader}">
    <div class="page-header-wrapper" v-show="!$route.meta.hideHeader">
      <page-header></page-header>
    </div>
    <router-view class="sub-page"/>
  </div>
</template>
<script>
	import PageHeader from '@/components/page-header'
	export default {
		components: {
			[PageHeader.name]: PageHeader
		},
	}
</script>
<style lang="scss">
html,body{
  position: relative;
  height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  position: relative;
  height: 100%;
  padding-top: 48px;
  .page-header-wrapper{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
  }
  &.hideHeader{
    padding-top: 0;
  }
}
.sub-page{
  position: relative;
  height: 100%;
}

</style>
