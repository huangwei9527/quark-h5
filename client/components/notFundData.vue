<template>
  <div class="components-default-style">
    <div>
      <img class="default-style-img" src="../common/images/nodata.png" alt=""  :style="{width: width, height: height}" />
      <p class="gray">暂无数据</p>
    </div>
  </div>
</template>

<script>
	export default {
		name: "notFundData",
		props: {
			width: {
				type: String,
				default: '128px'
			},
			height: {
				type: String,
				default: '86px'
			}
		},
	}
</script>

<style lang="scss" scoped>
  .components-default-style {
    width: 100%;
    height: 100%;
    text-align: center;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    & > div {
      display: inline-block;
    }
    .default-style-img {
      display: inline-block;
    }
  }
</style>
