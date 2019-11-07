<template>
  <div class="components-attr-edit components-attr-animate-edit">
    <el-scrollbar class="components-attr-edit">
      <div class="attr-edit-inner" v-if="activeElementUUID">
        <div class="animate-edit-btn-wrapper">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="addAnimate">添加动画</el-button>
          <el-button icon="el-icon-caret-right" size="small" @click="runAnimate(undefined)">预览动画</el-button>
        </div>
        <div class="el-animate-list-wrapper paddingT20" v-show="activeElement.animations.length">
          <el-collapse accordion>
            <el-collapse-item v-for="(item, index) in activeElement.animations" :key="index">
              <template slot="title">
                <span class="el-animate-title-name">动画 {{index}}</span>
                <div class="el-animate-title-type-wrapper">
                  <span class="el-animate-title-type" @click.stop.prevent="handleShowChooseAnimatePanel(index)">{{item.type}}  <i
                          class="el-icon-caret-right size-mini"></i> </span>
                </div>
                <span class="el-animate-title-btn" @click.stop.prevent="runAnimate(index)"><i
                        class="el-icon-caret-right"></i></span>
                <span class="el-animate-title-btn" @click.stop.prevent="handleDeleteAnimate"><i
                        class="el-icon-delete"></i></span>
              </template>
              <div class="el-animate-item">
                <div class="attr-item-edit-wrapper">
                  <p class="attr-item-title">动画时长：</p>
                  <div class="col-2 attr-item-edit-input">
                    <el-input-number size="mini" v-model="item.duration" controls-position="right" :min="0"
                                     :step="0.1"/>
                  </div>
                </div>
                <div class="attr-item-edit-wrapper">
                  <p class="attr-item-title">动画延迟：</p>
                  <div class="col-2  attr-item-edit-input">
                    <el-input-number size="mini" v-model="item.delay" controls-position="right" :min="0" :step="0.1"/>
                  </div>
                </div>
                <div class="attr-item-edit-wrapper">
                  <p class="attr-item-title">循环次数：</p>
                  <div class="col-2 attr-item-edit-input">
                    <el-input-number size="mini" v-model="item.interationCount" controls-position="right"/>
                    <div class="attr-item-edit-input-des">次数</div>
                  </div>
                  <div class="col-2 attr-item-edit-input">
                    <el-checkbox v-model="item.infinite" label="infinite" border size="small">循环播放</el-checkbox>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <div v-else>
        <p class="gray paddingT30 text-center">请在画板上选择需要编辑得元素</p>
      </div>
    </el-scrollbar>

    <div class="components-attr-edit animate-choose-list-wrapper"
         :class="{fadeInUp: showAnimatePanel, fadeInDown: !showAnimatePanel, animate: showAnimatePanel}">
      <el-tabs v-model="activeName">
        <el-tab-pane v-for="item in animateCssDatas" :key="item.label" :label="item.label" :name="item.label">
          <el-scrollbar class="animate-choose-item">
            <div
                    class="animate-choose-item-inner"
                    v-for="(animate, index) in item.children"
                    :key="index"
                    @mouseover="hoverPreviewAnimate = animate.value"
                    @mouseleave="hoverPreviewAnimate = ''"
                    @click="handleChooseAnimate(animate)">
              <span class="animate-choose-image"
                    :style="{backgroundPosition: `${item.bg_X}px ${item.bg_Y}px`}"
                    :class="[hoverPreviewAnimate === animate.value && animate.value + ' animated']"></span>
              <p>{{animate.label}}</p>
            </div>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
	import animateCssData from '@client/common/animateCssData'
	import {mapState, mapGetters} from 'vuex'
	import Bus from '@client/eventBus'

	export default {
		data() {
			return {
				animateCssDatas: animateCssData,
				activeName: '进入',
				showAnimatePanel: false,
				reSelectAnimateIndex: undefined,
				hoverPreviewAnimate: ''
			}
		},
		computed: {
			...mapState({
				projectData: state => state.editor.projectData,
				activePageUUID: state => state.editor.activePageUUID,
				activeElementUUID: state => state.editor.activeElementUUID
			}),
			...mapGetters([
				'currentPageIndex',
				'activeElementIndex',
				'activeElement'
			])
		},
		watch: {
			activePageUUID() {
				// 关闭选择动画弹窗
				this.addAnimate(false);
			},
			activeElementUUID() {
				// 关闭选择动画弹窗
				this.addAnimate(false);
			}
		},
		methods: {
			/**
			 * 选取animate
			 * @param item
			 */
			handleChooseAnimate(item) {
				this.showAnimatePanel = false;
				if (this.reSelectAnimateIndex === undefined) {
					this.$store.dispatch('addElementAnimate', item.value)
				} else {
					this.activeElement.animations[this.reSelectAnimateIndex].type = item.value;
					this.$store.dispatch('addHistoryCache')
				}
			},
			/**
			 * 删除动画
			 * @param index
			 */
			handleDeleteAnimate(index) {
				this.$store.dispatch('deleteElementAnimate', index)
			},
			addAnimate(showAnimatePanel = true) {
				this.showAnimatePanel = showAnimatePanel;
				this.reSelectAnimateIndex = undefined;
			},
			handleShowChooseAnimatePanel(index) {
				this.reSelectAnimateIndex = index;
				this.showAnimatePanel = true;
			},
			/**
			 * 执行此条动画效果
			 */
			runAnimate(index) {
				let animationData = index === undefined ? this.activeElement.animations : [this.activeElement.animations[index]]
				Bus.$emit('RUN_ANIMATIONS', this.activeElement.uuid, animationData)
			}
		}
	}
</script>

<style lang="scss" scoped>
  .components-attr-edit {
    height: 100%;
  }

  .components-attr-animate-edit {
    position: relative;
  }

  .attr-title {
    font-weight: bold;
  }

  .attr-item-edit-wrapper {
    padding-left: 4px;
    display: flex;
    width: 100%;
    text-align: center;
    padding-bottom: 10px;
    .attr-item-title {
      text-align: left;
      min-width: 60px;
      font-size: 12px;
      line-height: 28px;
    }
    .attr-item-edit-input {
      &.col-2 {
        width: 90px;
        margin-left: 10px;
      }
      &.col-1 {
        width: 250px;
      }
      &.col-3 {
        width: 60px;
        margin-left: 10px;
      }
      &.col-4 {
        width: 50px;
        margin-left: 10px;
      }
      .attr-item-edit-input-des {
        text-align: center;
        line-height: 1;
        margin-top: 2px;
        font-size: 12px;
        color: $gray;
      }
    }
  }

  .animate-choose-list-wrapper {
    position: fixed;
    top: 0;
    right: 0;
    width: 380px;
    height: calc(100% - 48px);
    background: white;
    z-index: 100;
    transition: all 0.28s;
    &.fadeInUp {
      top: 50px;
      opacity: 1;
    }
    &.fadeInDown {
      opacity: 0;
      top: 110%;
    }
  }

  .animate-choose-item {
    height: 100%;
    .animate-choose-item-inner {
      display: inline-block;
      width: 25%;
      height: 72px;
      color: rgb(118, 131, 143);
      text-align: center;
      cursor: pointer;
      & > .animate-choose-image {
        display: inline-block;
        width: 40px;
        height: 40px;
        margin-bottom: 6px;
        background-image: url(../../../../common/images/use-beb469.png)
      }
      p {
        font-size: 12px;
        line-height: 1;
      }
    }
  }

  .el-animate-list-wrapper {
    .el-animate-title-name {
      display: inline-block;
      vertical-align: middle;
      font-size: 14px;
      font-weight: bold;
      width: 55px;
    }
    .el-animate-title-type-wrapper {
      display: inline-block;
      width: 164px;
    }
    .el-animate-title-type {
      display: inline-block;
      vertical-align: middle;
      max-width: 140px;
      height: 24px;
      line-height: 1px;
      color: #333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      background: #fafafa;
      border-radius: 60px;
      padding: 4px 16px;
      border: none;
      cursor: pointer;
      margin: 0 20px 0 10px;
      &:hover {
        color: white;
        background: $primary;
      }
    }
    .el-animate-title-btn {
      display: inline-block;
      vertical-align: middle;
      text-align: center;
      line-height: 24px;
      font-size: 14px;
      color: #666;
      width: 24px;
      height: 24px;
      cursor: pointer;
      border-radius: 4px;
      background: rgba(37, 165, 137, 0.08);
      margin-left: 6px;
      &:hover {
        color: white;
        background: $primary;
      }
    }
  }
</style>
<style lang="scss">
  .components-attr-edit {
    .el-tabs {
      height: 100%;
      padding-left: 0px;
      padding-right: 0px;
      padding-bottom: 0px;
    }
  }

  .animate-choose-list-wrapper {

  }
</style>
