/**
 * http请求封装
 * @param opt
 */
/*-------------------Ajax start--------------------*/

function ajax(options) {
	return new Promise((resolve, reject) => {
		options = options || {};
		options.type = (options.type || "GET").toUpperCase();
		options.dataType = options.dataType || "json";
		var params = formatParams(options.data);
		var xhr;

		//创建 - 第一步
		xhr = new XMLHttpRequest();

		//连接 和 发送 - 第二步
		if (options.type == "GET") {
			xhr.open("GET", options.url + "?" + params, true);
			xhr.send(null);
		} else if (options.type == "POST") {
			xhr.open("POST", options.url, true);
			//设置表单提交时的内容类型
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.send(params);
		}

		//接收 - 第三步
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				var status = xhr.status;
				if (status >= 200 && status < 300 || status == 304) {
					resolve(xhr.responseText, xhr.responseXML)
				} else {
					reject(status)
				}
			}
		}
	})
}

//格式化参数
function formatParams(data){
	var arr = [];
	for (var name in data) {
		arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
	}
	arr.push(("v=" + Math.random()).replace(".",""));
	return arr.join("&");
}

/*-------------------Ajax end-------------------*/

export default ajax
