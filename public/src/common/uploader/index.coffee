
###
调用方法 

behindUploader = new Uploader {
	domain: "http://7xj0sp.com1.z0.glb.clouddn.com/"	# bucket 域名，下载资源时用到，**必需**
	browse_button: 'negative-file',       # 上传选择的点选按钮，**必需**
	container: 'negative-wrapper',       # 上传选择的点选按钮，**必需**
}, {
	FileUploaded: (up, file, info)->
		info = $.parseJSON info
		domain = up.getOption('domain')

		$("#negative-wrapper").find(".content-img").removeClass("hidden").find("img").attr("src", domain + info.key)
		$("#negative-wrapper").find(".img-border").addClass("hidden")
}
	
构造函数的第一个参数对象包含了用来覆盖默认参数中除了init之外的各项属性的值
第二个参数对象包含了用来覆盖默认参数中init对象内方法的函数
未被指定的属性将以默认参数中的值进行传递	
###

###
默认参数
###
_defaultConfig = 
	runtimes: 'html5,flash,html4',    # 上传模式,依次退化
	browse_button: 'click-file',       # 上传选择的点选按钮，**必需**
	uptoken_url: '/uptoken',            # Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
	domain: "http://7te9k1.com1.z0.glb.clouddn.com/"	# bucket 域名，下载资源时用到，**必需**
	container: 'container',           # 上传区域DOM ID，默认是browser_button的父元素，
	max_file_size: '5mb',           # 最大文件体积限制
	flash_swf_url: '/lib/plupload/Moxie.swf',  # 引入flash,相对路径
	max_retries: 3,                   # 上传失败最大重试次数
	dragdrop: false,                   # 关闭可拖曳上传
	drop_element: 'container',        # 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
	chunk_size: '4mb',                # 分块上传时，每片的体积
	auto_start: true,                 # 选择文件后自动上传，若关闭需要自己绑定事件触发上传,
	unique_names: true,
	save_key: true,
	statusTip: '.image-upload-tips'		# 显示图片上传进度的标签的选择器
	init: {
		'Error': (up, err, errTip)->
			console.log errTip
			# 上传出错时,处理相关的事情

		'BeforeUpload': (up, file)->
			$(@getOption().statusTip).text('准备上传图片')
			# console.log up
			# 每个文件上传前,处理相关的事情
		'UploadProgress': (up, file)->
			$(@getOption().statusTip).text('正在上传图片')
		'FileUploaded': (up, file, info)->
			# 每个文件上传成功后,处理相关的事情
			# 其中 info 是文件上传成功后，服务端返回的json，形式如
			# {
			#   "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
			#   "key": "gogopher.jpg"
			# }
			info = $.parseJSON info
			domain = up.getOption('domain')
		'UploadComplete': ()->
			# console.log "UploadComplete"
			$(@getOption().statusTip).text('图片上传成功')
			# 队列文件处理完毕后,处理相关的事情
	}

class Uploader
	
	constructor: (options, handlers)->
		config = $.extend {}, _defaultConfig, options

		for name, callback of handlers
			config.init[name] = callback

		uploader = Qiniu.uploader config


module.exports = Uploader