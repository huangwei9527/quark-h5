/*
* image 图片库
**/
import $axios from "@/service/httpServer";

// 获取我的图片列表
export const getMyImages = p => $axios.get('/quark/imageLib/myImages', p);
// 上传图片
export const uploadImage = p => $axios.post('/quark/imageLib/upload', p)
