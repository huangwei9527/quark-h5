const fs = require('fs');

class File {
	save(file, filePath){
		// 创建可读流
		const reader = fs.createReadStream(file.path);
		//创建可写流
		const upStream = fs.createWriteStream(filePath);
		// 可读流通过管道写入可写流
		reader.pipe(upStream);
	}

	/**
	 * 上传文件到oss
	 */
	uploadToOss(){
		// todo 待完善
	}

}

module.exports = new File()
