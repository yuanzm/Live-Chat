# 日期格式化函数
Date.prototype.Format = (fmt)->
    o =
        "M+": this.getMonth() + 1
        "d+": this.getDate()
        "h+": this.getHours()
        "m+": this.getMinutes()
        "s+": this.getSeconds()
        "q+": Math.floor((this.getMonth() + 3) / 3)
        "S": this.getMilliseconds()

    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))

    for key, value of o
        if (new RegExp("(" + key + ")").test(fmt))
            tempStr = if (RegExp.$1.length == 1) then (value) else (("00" + value).substr(("" + value).length))
            fmt = fmt.replace(RegExp.$1, tempStr)

    return fmt
