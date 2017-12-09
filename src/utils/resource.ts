import swal from 'sweetalert2'
import Axios, {AxiosResponse, AxiosError} from 'axios'
import { prototype } from 'vue-router';


class Storage {
  constructor() {
    this.cache = new Map()
  }
  cache: Map<string, string>
  getKey(url: string, param: any) {
    let paramStr = (param ? Object.keys(param).map(key => `${key}=${param[key]}`).join('&') : '')
    return `${url}?${paramStr}`
  }
  get(url: string, param: any) {
    let key = this.getKey(url, param)
    return this.cache.has(key) ? JSON.parse(this.cache.get(key) || '') : {success: false}
  }
  set(url: string, param: any, data: any) {
    let key = this.getKey(url, param)
    this.cache.set(key, JSON.stringify(data))
    return this
  }
}

let storage = new Storage()

function doGet(url: string, param?: Object) {
  return new Promise((resolve, reject) => {
    Axios.get(url, {params: param})
      .then(response => {
        let data = JSON.parse(response.data)
        if (data) {
          storage.set(url, param, data)
          let cachedRes = storage.get(url, param)
          resolve(cachedRes)
        } else {
          let cachedRes = storage.get(url, param)
          if (cachedRes.success) {
            resolve(cachedRes)
          } else {
            reject(data)
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
function doPost(url: string, data?: any) {
  return new Promise((resolve, reject) => {
    Axios.post(url, data)
      .then(response => {
        let json = JSON.parse(response.data)
        if (json) {
          resolve(json)
        } else {
          reject(json)
        }
      })
  })
}

class Resource {
  constructor(url: string) {
    this.url = url
  }
  url: string
  doOperation(request: Function) {
    return new Promise((resolve, reject) => {
      request().then((response: AxiosResponse) => {
        let json = JSON.parse(response.data)
        if (json) {
          resolve(json)
        } else {
          swal('操作失败', '信息：' + json.message, 'error')
          reject(json)
        }
      }).catch((error: AxiosError) => {
        swal('操作失败', error.message, 'error')
        reject(error)
      })
    })
  }
  get(params: any) {
    return this.doOperation(() => Axios.get(this.url, {params: params}))
  }
  update(data: any) {
    return this.doOperation(() => Axios.put(this.url, data))
  }
  save(data: any) {
    return this.doOperation(() => Axios.post(this.url, data))
  }
  delete(id: number, target = '') {
    return swal({
      title: `确定要删除${target}吗？`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: '删除',
      cancelButtonText: '取消'
    }).then(() => {
      return this.doOperation(() => Axios.delete(`${this.url}/${id}`))
    })
  }
}

export {doGet, doPost}
export default Resource
