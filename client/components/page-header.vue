<template>
  <div class="components-page-header">
    <div class="page-header-inner" :class="{'layout-container': !fullWidth, fullWidth: fullWidth}">
      <div class="inline-block logo-wrapper">
        <img class="cursor-pointer" @click="goHome" src="../common/images/logo.jpg" alt="">
        <slot name="left-slot"></slot>
      </div>
      <div class="header-center-wrapper">
        <slot></slot>
      </div>
      <div class="user-wrapper">
        <slot name="right-slot"></slot>
        <userHeadBtn/>
      </div>
    </div>
  </div>
</template>

<script>
	import userHeadBtn from '@/components/user-head-btn'

	export default {
		props: {
			fullWidth: Boolean
		},
		components: {
			userHeadBtn
		},
		methods: {
			goHome() {
				// 已登录就去工作台，
				// 没登陆就去首页
				if (this.$store.state.user.access_token) {
					this.$router.push({name: 'Home'})
				} else {
					this.$router.push({name: 'Home'})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
  .components-page-header {
    height: 100%;
    background: white;
    box-shadow: 0 2px 3px 0 rgba(100, 100, 100, 0.06);
  }

  .page-header-inner {
    display: flex;
    &.fullWidth {
      padding: 0 18px;
    }
  }

  .logo-wrapper {
    width: 360px;
    font-size: 18px;
    line-height: 48px;
    img {
      display: inline-block;
      height: 30px;
      vertical-align: middle;
    }
    span {
      display: inline-block;
      vertical-align: middle;
    }
  }

  .header-center-wrapper {
    flex: 1;
    text-align: center;
  }

  .user-wrapper {
    width: 360px;
    text-align: right;
    padding-top: 6px;
  }
</style>
