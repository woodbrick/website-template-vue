import swal from 'sweetalert2'
import Vue from 'vue'

function parseResult(res) {
  if (res && res.ok) {
    let json = JSON.parse(res.bodyText)
    if (!json.success && json.status === 401) {
      console.error(res)
      getLogin()
    }
    if (json.msgs) {
      json.msgs = json.msgs[Object.keys(json.msgs)[0]]
    }
    return json
  } else {
    swal('未知错误，请重试', res.statusText, 'error')
    console.error(res.status, res.statusText, res.status)
  }
}

function getLogin() {
  doGet('/apollo/token')
    .then(res => {
      if (res.data.isLogin) {
        checkToken(res.data.token)
      } else {
        window.location.href = '/login'
      }
    })
}

function checkToken(token) {
  doPost('/thor/sso/checktoken?token=' + token)
    .then(res => {
      if (res.status === 200 && res.success) {
        doGet('/thor/userinfo')
          .then(response => {
            window.location.reload()
          })
          .catch(() => {
            swal({
              title: `当前登录状态有问题，是否前往登录页面`,
              type: 'warning',
              showCancelButton: true,
              confirmButtonText: '前往登录',
              cancelButtonText: '取消'
            }).then(() => {
              window.location.href = '/login'
            })
          })
      }
    })
    .catch(() => {
      window.location.href = '/login'
    })
}

function Storage() {
  this.cache = {}
  this.getKey = (url, param) => {
    let paramStr = (param ? Object.keys(param).map(key => `${key}=${param[key]}`).join('&') : '')
    return `${url}?${paramStr}`
  }
  this.get = (url, param) => {
    return this.cache.hasOwnProperty(this.getKey(url, param)) ? JSON.parse(this.cache[this.getKey(url, param)]) : {success: false}
  }
  this.set = (url, param, data) => {
    let key = this.getKey(url, param)
    this.cache[key] = JSON.stringify(data)
    return true
  }
}

let storage = new Storage()

function doGet(url, param) {
  return new Promise((resolve, reject) => {
    Vue.http.get(url, {params: param})
      .then(resStr => {
        let res = parseResult(resStr)
        if (res.success) {
          storage.set(url, param, res)
          let cachedRes = storage.get(url, param)
          resolve(cachedRes)
        } else {
          let cachedRes = storage.get(url, param)
          if (cachedRes.success) {
            resolve(cachedRes)
          } else {
            reject(res)
          }
        }
      })
      .catch(response => {
        if (response.status === 404) {
          swal('无法连接服务器!', '请联系管理员，检查服务器状态或配置', 'error')
        }
        console.error('request error', response)
        let cachedRes = storage.get(url, param)
        resolve(cachedRes)
      })
  })
}
function doPost(url, param) {
  return new Promise((resolve, reject) => {
    Vue.http.post(url, param)
      .then(resStr => {
        let res = parseResult(resStr)
        if (res.success) {
          resolve(res)
        } else {
          reject(res)
        }
      })
  })
}

const Resource = function(vueResource) {
  this.doOperation = (request, needAlert = false) => {
    return new Promise((resolve, reject) => {
      request().then(resStr => {
        let json = parseResult(resStr)
        if (json.success) {
          resolve(json)
        } else {
          json.status !== 401 && swal('操作失败', '信息：' + json.msgs, 'error')
          reject(json)
        }
      }).catch(error => {
        swal('操作失败', '状态：' + error.statusText, 'error')
        reject(error)
      })
    })
  }
  this.get = params => this.doOperation(() => vueResource.get(params))
  this.update = params => this.doOperation(() => vueResource.update(params), true)
  this.save = params => this.doOperation(() => vueResource.save({}, params), true)
  this.delete = (data, target = '') => {
    return swal({
      title: `确定要删除${target}吗？`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: '删除',
      cancelButtonText: '取消'
    }).then(() => {
      let params = typeof data === 'number' ? {id: data} : data
      return this.doOperation(() => vueResource.delete({}, params), true)
    })
  }
}
function cloneWithoutEmptyValue(target) {
  if (typeof target !== 'object') return {}
  let obj = {}
  Object.keys(target).forEach(key => {
    if (target[key]) {
      obj[key] = target[key]
    }
  })
  return obj
}
function arrayToMap(arr, key) {
  let map = {}
  arr.forEach(item => {
    map[item[key]] = item
  })
  return map
}
export {cloneWithoutEmptyValue, doGet, doPost, parseResult, arrayToMap}
export default Resource
