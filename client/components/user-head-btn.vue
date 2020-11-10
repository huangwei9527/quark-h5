<template>
  <div class="user-head-btn-components">
    <el-dropdown v-if="isLogined">
      <div class="inline-block">
        <div class="user-head-btn-img">
          <img :src="userData.avatar || userHeadImage" alt="">
        </div>
        <span class="user-head-btn-name">{{userData.name}}</span>
      </div>
      <el-dropdown-menu v-if="isLogined">
        <el-dropdown-item>
          <userInfo :userData="userData" :showEdit="true">
            <i class="el-icon-user"></i> 个人资料
          </userInfo>
        </el-dropdown-item>
        <el-dropdown-item>
          <resetPassword>
            <i class="el-icon-edit"></i> 修改密码
          </resetPassword>
        </el-dropdown-item>
        <el-dropdown-item>
          <div @click="doLogout">
            <i class="el-icon-switch-button"></i> 退出登录
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="inline-block" v-else>
      <span class="login-btn" @click="goLogin">登录/注册</span>
    </div>
  </div>
</template>

<script>
	import {
		Button,
		Dropdown,
		DropdownMenu,
		DropdownItem,
	} from 'element-ui'
  import resetPassword from '@/components/reset-password'
  import userInfo from '@/components/user-info'
  import userModel from '@/libs/userModel'

	export default {
		name: "user-head-btn",
		components: {
			[Button.name]: Button,
			[Dropdown.name]: Dropdown,
			[DropdownMenu.name]: DropdownMenu,
			[DropdownItem.name]: DropdownItem,
      resetPassword,
      userInfo
		},
		data() {
			return {
				userHeadImage: require('@/common/images/headerImage.png')
			}
		},
		computed: {
			isLogined(){
				return this.$store.state.user.access_token
      },
			userData() {
				return this.$store.state.user.userInfo || {}
			}
		},
		methods: {
			doLogout() {
				userModel.doLogout()
			},
			goLogin(){
				userModel.goLogin()
      }
		}
	}
</script>

<style lang="scss" scoped>
  .user-head-btn-components {
    display: inline-block;
    vertical-align: middle;
    line-height: 28px;
    cursor: pointer;
    .user-head-btn-img {
      display: inline-block;
      vertical-align: middle;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      overflow: hidden;
      background: #eee;
      img{
        display: inline-block;
        width: 100%;
        height: 100%;
      }
    }
    .user-head-btn-name {
      font-size: 14px;
      margin-left: 8px;
    }
  }
  .login-btn{
    text-decoration:underline;
    text-underline: #999;
    cursor: pointer;
    &:hover{
      color: black;
      text-underline: #000;
    }
  }
</style>
