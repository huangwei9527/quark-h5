<template>
  <div class="qk-bg-music" :class="{playing: playing}" @click="handleMusicPlay">
    <div class="video-play-audio" v-if="musicSrc">
      <audio ref="audioPlayer" id="video-play-audio" :src="musicSrc"
             style="opacity: 0;" controls autoplay loop preload></audio>
    </div>
    <img class="yinyue-img" :src="imageSrc" alt="bg">
  </div>
</template>

<script>
	export default {
		name: 'qkBgMusic',
		props: {
			musicSrc: {
				type: String,
				default: 'http://gaokao.newhope.cn/static/fly_new_hope.mp3'
			},
			imageSrc: {
				type: String,
				default: require('./music.png')
			}
		},
		data() {
			return {
				audioEl: undefined,
				playing: true
			}
		},
		created() {

		},
		mounted() {
			this.audioEl = document.getElementById('video-play-audio')
			this.audioEl.load();
			const audio = this.$refs.audioPlayer;
			audio.play().catch(() => {
				this.playError = true;
				let event = ["click", "WeixinJSBridgeReady"];// "touchstart"
				let pageClick = () => {
					if (this.playError) {
						this.playError = false;
						audio.load();
						audio.play().catch(() => {
							this.playError = true;
						});
						event.forEach((item) => {
							document.removeEventListener(item, pageClick);
						});
					}
				};
				event.forEach((item) => {
					document.addEventListener(item, pageClick);
				});
			})
		},
		methods: {
			handleMusicPlay() {
				if (!this.musicSrc) return;
				if (this.playing) {
					this.pause()
				} else {
					this.play();
				}
			},
			play() {
				this.playing = true;
				this.audioEl.play();
			}
			,
			pause() {
				this.playing = false;
				this.audioEl.pause();
			}
		}
	}
</script>

<style lang="scss" scoped>
  .video-play-audio {
    position: absolute;
    left: -9999px;
    top: -9999px;
    width: 0;
    height: 0;
    z-index: -1;
    opacity: 1;
    overflow: hidden;
  }

  .yinyue-img {
    position: relative;
    display: inline-block;
    width: 100%;
    height: 100%;
  }

  .qk-bg-music {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 10px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    &.playing {
      animation: spin 3s linear infinite;
    }
  }

  /* 无限旋转 */
  @keyframes spin {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
