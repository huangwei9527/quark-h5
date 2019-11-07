const CryptoJS = require('crypto-js');  //引用AES源码js

const keyStr = "icklsdufidsakdfa";  //十六位十六进制数作为密钥
const ivStr = ''; // 偏移量

function Encrypt(data){
	var key  = CryptoJS.enc.Utf8.parse(keyStr);
	var iv   = CryptoJS.enc.Utf8.parse(ivStr);
	var encrypted =CryptoJS.AES.encrypt(data,key,{
		iv:iv,
		mode:CryptoJS.mode.ECB,
		padding:CryptoJS.pad.Pkcs7
	});
	//返回的是base64格式的密文
	return encrypted.ciphertext.toString();
}

// encrypted 为是base64格式的密文
function Decrypt(encrypted){
	var encryptedHexStr = CryptoJS.enc.Hex.parse(encrypted);
	var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
	var key  = CryptoJS.enc.Utf8.parse(keyStr);
	var iv   = CryptoJS.enc.Utf8.parse(ivStr);
	var decrypted =CryptoJS.AES.decrypt(srcs,key,{
		iv:iv,
		mode:CryptoJS.mode.CBC,
		padding:CryptoJS.pad.Pkcs7
	});
	return decrypted.toString(CryptoJS.enc.Utf8);
}

// 测试加、解密
function testAES(){
	var data = "1234567890123456"; // 明文

	console.log("加密前：" + data);

	// 测试加密
	var encrypted = Encrypt(data); // 密文
	console.log("加密后: " + encrypted);

	// var decryptedStr = Decrypt(encrypted);
	// console.log("解密后: " + decryptedStr);
}
// testAES()
export default {
	Decrypt ,
	Encrypt
}
