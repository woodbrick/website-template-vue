const cookieUtil = {
  // 设置cookie
  setCookie: function(name, value, expiremMinutes = 1445 * 3) {
    let exdate = new Date()
    exdate.setTime(exdate.getTime() + expiremMinutes * 60 * 1000)
    document.cookie = name + '=' + escape(value) + ((expiremMinutes == null) ? '' : ';expires=' + exdate.toGMTString())
  },

// 读取cookie
  getCookie: function(name) {
    if (document.cookie.length > 0) {
      let cStart = document.cookie.indexOf(name + '=')
      if (cStart !== -1) {
        cStart = cStart + name.length + 1
        let cEnd = document.cookie.indexOf(';', cStart)
        if (cEnd === -1) {
          cEnd = document.cookie.length
        }
        return unescape(document.cookie.substring(cStart, cEnd))
      }
    }
    return ''
  },

// 删除cookie
  delCookie: function(name) {
    let exp = new Date()
    exp.setTime(exp.getTime() - 1)
    let cval = this.getCookie(name)
    if (cval !== null) {
      document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
    }
  }
}

export default cookieUtil
