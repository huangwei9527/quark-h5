/**
 * 上传相关
 */
import OSS from 'ali-oss';
import { mapState } from 'vuex'
export default {
	data(){
		return {

		}
	},
	computed: {
		...mapState({
			ossConfig: state => state.ossConfig
		})
	},
	created() {
		if(!this.ossConfig.stsToken){
			this.$store.dispatch('getOssToken')
		}
	},
	methods: {
		ossUpload(file){
			return new Promise((resolve, reject) => {
				this.$store.dispatch('getOssToken').then(() => {
					let client = new OSS({
						stsToken: this.ossConfig.stsToken,
						accessKeyId: this.ossConfig.accessKeyId,
						accessKeySecret: this.ossConfig.accessKeySecret,
						bucket: this.ossConfig.bucket,
						region: this.ossConfig.region,
					});
					let bojName = 'dwwb/portal/web_docs/' + new Date().getTime() + '/'
					async function putBlob () {
						try {
							let result = await client.put(bojName + file.name, file);
							resolve(result);
						} catch (e) {
							reject(e);
						}
					}
					putBlob();
				}).catch(err => {
					reject(err);
				})
			})
		}
	}
}
