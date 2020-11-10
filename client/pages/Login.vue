<template>
  <div class="page page-login">
    <div class="login-page-inner">
      <p class="title">Quark H5</p>
      <el-form :model="formData" :rules="formRules" ref="loginForm" label-width="0px">
        <el-form-item prop="username">
          <el-input v-model="formData.username" name="userName" placeholder="请输入用户名" @keyup.enter.native="doLogin">
            <i slot="prefix" class="iconfont icon-zhanghao"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="email" v-if="type === 'register'">
          <el-input v-model="formData.email" autocomplete="off" placeholder="请输入邮箱" @keyup.enter.native="doLogin">
            <span slot="prefix" class="iconfont icon-mail-copy"></span>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="formData.password" name="password" placeholder="请输入密码" :type="inputType" @keyup.enter.native="doLogin"
                    v-if="inputType==='password'">
            <i slot="prefix" class="iconfont icon-mima"></i>
            <span slot="suffix" class="cursor-pointer" @mousedown="mousedownPassword">
              <i class="iconfont icon-yincangmima"></i>
            </span>
          </el-input>
          <el-input v-model="formData.password" name="password" placeholder="请输入密码" :type="inputType" @keyup.enter.native="doLogin"
                    v-else>
            <i slot="prefix" class="iconfont icon-mima"></i>
            <span slot="suffix" class="cursor-pointer" @mousedown="mousedownText">
              <i class="iconfont icon-xianshimima"></i>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item>
          <div class="btn-hover" @click="doSubmit">{{type === 'login' ? '登录' : '注册'}}</div>
        </el-form-item>
      </el-form>
      <div class="switch-do-type marginB20">
        <p class="" @click="switchType">
          <i class="iconfont icon-iconfontzhizuobiaozhun47"></i>
          <span>{{type === 'login' ? '立即注册' : '马上登录'}}</span>
        </p>
      </div>
      <p class="login-page-bottom">Copyright © 2020 <span class="primary">Quark H5版权所有</span></p>
    </div>
    <div class="login-background">
      <loginBackground />
    </div>
  </div>
</template>

<script>
	import userModel from '@/libs/userModel'
  import loginBackground from '@/components/login-background/index'
	import {
		Form,
		FormItem,
		Input
	} from 'element-ui'

	export default {
		components: {
			[Form.name]: Form,
			[FormItem.name]: FormItem,
			[Input.name]: Input,
			loginBackground
		},
		data() {
			return {
				loading: false,
				loadingVerify: false,
				inputType: 'password',
				type: 'login',
				formData: {
					email: '',
					username: '',
					password: ''
				},
				formRules: {
					username: [
						{required: true, message: '用户名不能为空', trigger: 'blur'}
					],
					password: [
						{required: true, message: '密码不能为空', trigger: 'blur'}
					]
				}
			}
		},
		created() {
			// 进入登录页面先清空个人信息
			this.fromUrl = this.$route.query.from ? window.decodeURIComponent(this.$route.query.from) : ''
		},
		methods: {
			/**
			 登陆
			 */
			doSubmit() {
				// 验证成功
				this.$refs.loginForm.validate((valid) => {
					let fnName = this.type === 'login' ? 'doLogin' : 'doRegister'
					if (valid) {
						this[fnName]();
					} else {
						this.$store.dispatch('showMassage', {type: 'error', message: '请正确填写表单！'})
						return false;
					}
				});
			},
			doLogin() {
				let formData = {...this.formData}
				// 登录操作
				userModel.doLogin(formData).then(() => {
					if(this.fromUrl){
						this.$router.push(this.fromUrl)
					}else{
						userModel.goBeforeLoginUrl()
					}
				})
			},
			doRegister() {
				let formData = {...this.formData}
				// 登录操作
				userModel.doRegister(formData).then(() => {
					if(this.fromUrl){
						this.$router.push(this.fromUrl)
					}else{
						userModel.goBeforeLoginUrl()
					}
				})
			},
			switchType(){
				if(this.type === 'login'){
					this.type = 'register'
				}else{
					this.type = 'login'
				}
			},
			mousedownPassword() {
				this.inputType = 'text'
			},
			mousedownText() {
				this.inputType = 'password'
			},
			mouseup() {
				this.inputType = 'password'
			},
		}
	}
</script>

<style lang="scss" scoped>
  .page-login {
    position: relative;
    width: 100%;
    height: 100%;
    background: #fbfbfb;

  }

  .login-background {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 1;
  }

  .page-login {
    height: 100%;
    width: 100%;
    padding: 1px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 10;
  }

  .login-page-inner {
    position: relative;
    z-index: 10;
    width: 360px;
    padding: 20px 40px;
    margin-top: -120px;
    background: white;
    box-shadow: 0px 0px 0px rgba(58, 127, 158, 0.35);
    border-radius: 4px;
    background: white;
    box-shadow: 1px 1px 10px 10px #dedede;
    .title {
      padding: 10px 0 30px;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      color: $primary;
    }
    /**
    鼠标悬浮渐变
    */
    .btn-hover {
      margin-top: 20px;
      text-align: center;
      color: white;
      background: $color-gradient;
      transition: all 3s;
      border-radius: 4px;
      cursor: pointer;
    }
    .login-page-bottom {
      font-size: 12px;
      color: #666;
      text-align: center;
    }
    .forgot-password {
      text-align: right;
      font-size: 12px;
      margin-bottom: 20px;
      cursor: pointer;
      color: #333;
    }
  }
  .switch-do-type{
    font-size: 14px;
    text-underline: #000;
    text-align: right;
    color: #333;
    cursor: pointer;
    p{
      display: inline-block;
    }
    i{
      font-size: 16px;
      font-weight: 600;
    }
    &:hover{
      color: #000;
    }
  }

</style>
