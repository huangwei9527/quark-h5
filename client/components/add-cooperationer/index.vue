<template>
  <el-dialog
          title="协作人管理"
          :visible.sync="visible"
          width="650px">
    <div>
      <div class="new-folder-wrapper paddingL30 padingR30">
        <div class="title">按人员搜索添加(多选):</div>
        <div class="search-wrapper">
          <div class="input-wrapper">
            <el-select
                    class="input-i"
                    v-model="userInput"
                    multiple
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入用户名|邮箱|昵称搜索"
                    :remote-method="remoteMethod_user"
                    :loading="loading_user">
              <el-option
                      v-for="item in userOptions"
                      :key="item._id"
                      :label="item.name"
                      :value="item._id">
              </el-option>
            </el-select>
          </div>
          <div class="tj-btn">
            <el-button type="primary" @click="addUser">添加</el-button>
          </div>
        </div>
      </div>
      <div class="user-list-wrapper">
        <div class="title">已加入成员:</div>
        <div class="user-list">
          <el-tag
                  class="user-item"
                  v-for="(tag, index) in cooperationUserList"
                  :key="index"
                  size="mini"
                  @close="delUser(tag._id, index)"
                  closable>
            <img class="userHeadImage" :src="tag.avatar || userHeadImage" alt="">
            {{tag.name}}
          </el-tag>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
	import {
		Form,
		FormItem,
		Dialog,
		Button,
		Select,
		Option,
		Tag
	} from 'element-ui'

	export default {
		components: {
			[Tag.name]: Tag,
			[Select.name]: Select,
			[Option.name]: Option,
			[Form.name]: Form,
			[FormItem.name]: FormItem,
			[Dialog.name]: Dialog,
			[Button.name]: Button,
		},
		data() {
			return {
				userHeadImage: require('@/common/images/headerImage.png'),
				pageId: '',
				visible: false,
				callback: null,
				loading_user: false,
				groupInput: '',
				groupOptions: [],
				userInput: [],
				userOptions: [],
				cooperationUserList: []
			}
		},
		created() {
			this.getCooperationList();
		},
		methods: {
			getCooperationList() {
				this.$API.getCooperationUserListByPageId({pageId: this.pageId}).then(res => {
					this.cooperationUserList = res.body || [];
				})
			},
			remoteMethod_user(str) {
				this.loading_user = true;
				this.$API.getUserListByKeywords({keywords: str}).then(res => {
					this.userOptions = res.body || [];
					this.loading_user = false;
				}).catch(() => {
					this.loading_user = true;
				})
			},
			addUser() {
				if (!this.userInput.length) return;
				this.$API.addCooperation({pageId: this.pageId, userIds: this.userInput}).then(res => {
					this.cooperationUserList = res.body || [];
					this.userInput = [];
				})
			},
			// 删除
			delUser(userId, index) {
				this.$API.delCooperation({pageId: this.pageId, userId: userId}).then(() => {
					this.cooperationUserList.splice(index, 1);
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
  .title {
    display: block;
    font-weight: 600;
    padding-bottom: 20px;
  }

  .search-wrapper {
    display: flex;
    .input-wrapper {
      flex: 1;
      padding-right: 20px;
      .input-i {
        width: 100%;
      }
    }
    .tj-btn {
      width: 80px;
    }
  }

  /*人员列表*/
  .user-list-wrapper {
    background: #fafafa;
    min-height: 200px;
    margin-top: 20px;
    padding: 20px;
    .title {
      font-weight: 600;
      padding-bottom: 20px;
    }
  }

  .userHeadImage {
    width: 14px;
    height: 14px;
    display: inline-block;
    vertical-align: middle;
    border-radius: 50%;
  }

  .user-item {
    margin-right: 5px;
    margin-bottom: 5px;
  }
</style>
