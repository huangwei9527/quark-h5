<template>
  <div class="page-example">
    <engineTemplate></engineTemplate>
  </div>
</template>

<script>
  import engineTemplate from '../../../engine-template/engine-h5-swiper/index'
	export default {
		name: "swiper-h5",
    components: {
	    engineTemplate
    },
    data(){
			return {

      }
    },
	}
</script>

<style lang="scss" scoped>
.page-example{
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
