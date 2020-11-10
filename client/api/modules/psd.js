/*
* psd
**/
import $axios from "@/service/httpServer";

// 上传psd解析
export const psdPpload = p => $axios.post('/quark/psd/upload', p)
