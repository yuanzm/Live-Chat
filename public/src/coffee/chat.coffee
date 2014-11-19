Date.prototype.Format = (fmt) ->
	o = 
		"M+" : this.getMonth() + 1
		"d+" : this.getDate()
		"h+" : this.getHours()
		"m+" : this.getMinutes()
		"s+" : this.getSeconds()
		"q+" : Math.floor((this.getMonth() + 3) / 3)
		"S"  : this.getMilliseconds()
	if /(y+)/.test(fmt)
		fmt = fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length))
	for k of o
		if new RegExp("("+k+")").test(fmt)
			fmt = fmt.replace(RegExp.$1, flag = if RegExp.$1.length==1 then (o[k]) else (("00"+ o[k]).substr((""+ o[k]).length)))
	return fmt

chat=
	showMessage: (node, data)->
		$chatList = $('<li class="a-chat">test</li>')
		node.append($chatList)

	getTime: ->
		time = new Date().Format("yyyy-MM-dd hh:mm:ss")

module.exports = chat











