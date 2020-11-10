<template>
  <div class="change-password inline-block">
    <div class="inline-block" @click="show">
      <slot></slot>
    </div>
    <el-dialog class="page-dialog-wrapper" v-if="dialogleVisible" title="修改密码" width="480px"
               :visible.sync="dialogleVisible" append-to-body @close="closePop">
      <el-form ref="ruleForm" :model="form" label-width="110px" :rules="rules">
        <el-form-item label="输入旧密码：" prop="oldPassword">
          <el-input v-model="form.oldPassword" placeholder="请输入旧密码" type="password"></el-input>
        </el-form-item>
        <el-form-item label="输入新密码：" prop="newPass">
          <el-input v-model="form.newPass" placeholder="最少输入6位数字/字母，不可输入特殊字符" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码：" prop="newPassword">
          <el-input v-model="form.newPassword" placeholder="最少输入6位数字/字母，不可输入特殊字符" type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closePop">取消</el-button>
        <el-button type="primary" @click="savePassword" :loading="loading">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
	import {
		Form,
		FormItem,
		Dialog,
		Button,
		Input
	} from 'element-ui'
  import userModel from '@/libs/userModel'
	export default {
		components: {
			[Form.name]: Form,
			[FormItem.name]: FormItem,
			[Dialog.name]: Dialog,
			[Button.name]: Button,
			[Input.name]: Input
		},
		data() {
			var validatePass2 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.form.newPass) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				loading: false,
				dialogleVisible: false,
				form: {
					newPass: "", //新密码
					oldPassword: "", //旧密码
					newPassword: "" //确认密码
				},
				rules: {
					oldPassword: [{
						required: true,
						message: "请输入旧密码",
						trigger: "blur"
					},
						{
							required: true,
							pattern: /^[A-Za-z0-9]\w{5,15}$/,
							message: "输入6-16位数字或字母，不可输入特殊字符",
							trigger: "blur"
						}
					],
					newPass: [{
						required: true,
						message: "请输入新密码",
						trigger: "blur"
					},
						{
							required: true,
							pattern: /^[A-Za-z0-9]\w{5,15}$/,
							message: "输入6-16位数字或字母，不可输入特殊字符",
							trigger: "blur"
						}
					],
					newPassword: [
						{required: true, validator: validatePass2, trigger: 'blur'}
					]
				}
			};
		},
		methods: {
			show() {
				this.dialogleVisible = true;
			},
			//保存
			savePassword() {
				this.$refs["ruleForm"].validate(valid => {
					if (valid) {
						this.loading = true;
						// 修改密码
						this.$API.updateUserPass({oldPass: this.form.oldPassword, newPass: this.form.newPass}).then(() => {
							this.loading = false;
							this.$alert('已修改密码，请重新登录', '提示', {
								confirmButtonText: '确定',
								showClose: false,
								closeOnClickModal: false,
								closeOnPressEscape: false,
								center: true,
							}).then(() => {
								userModel.doLogout();
              });
						}).catch(() => {
							this.loading = false;
            })
					} else {
						return false;
					}
				});
			},
			/**
			 * 关闭弹窗
			 */
			closePop() {
				this.dialogleVisible = false;
				this.$emit("close");
			}
		}
	};

</script>
<style lang="scss">
  .change-password {
    .el-dialog__header {
      padding: 20px;
      padding-bottom: 10px;
      background: #f5f6f9;
      border-bottom: 1px #ccc solid;
    }

    .err {
      position: relative;

      .el-input__inner {
        border-color: #f56c6c;
      }

      .err_text {
        position: absolute;
        top: 30px;
        left: 0;
        font-size: 12px;
        color: #f56c6c;
      }
    }

    .is-error {
      .err_text {
        display: none;
      }
    }

    .is-success {
      .err_text {
        display: block;
      }
    }
  }
</style>
