function FormArray() {
  let arr = [ ]
  arr.push.apply(arr, arguments)
  return arr
}
FormArray.prototype = Object(Array.prototype)
/**
 * @param {Array} arr
 * @returns {FormArray}
 */
FormArray.fromArray = function(arr) {
  return new FormArray(...arr)
}
/**
 * @param {Object} object
 * @returns {FormArray}
 */
FormArray.fromObject = function(object) {
  let arr = Object.keys(object).map(key => ({
    key: key,
    value: object[key]
  }))
  return new FormArray(...arr)
}
/**
 * @param {function(Object=obj, Object=item, number=index)} fun
 * @returns {{}}
 */
FormArray.prototype.mapToObject = function(fun) { // 将数组转化为对象
  let obj = {}
  this.forEach((item, index) => {
    fun(obj, item, index)
  })
  return obj
}

/**
 * @param {string} key
 * @returns {{}}
 */
FormArray.prototype.mapToObjectByKey = function(key) { // 将对象数组根据指定key转化为对象
  return this.mapToObject((map, item) => (map[item[key]] = item))
}

/**
 *
 * @param {string} nodeKey
 * @param {string} parentNodeKey
 * @returns {Object}
 */
FormArray.prototype.mapToMultiWayTree = function(nodeKey, parentNodeKey) {
  let tree = {}
  this.sort((a, b) => {
    return a[nodeKey].length - b[nodeKey].length
  })
  let levelMap = {}
  this.forEach(item => {
    let parentCode = item[parentNodeKey]
    let itemCode = item[nodeKey]
    let parent = levelMap[parentCode]
    if (parent) {
      let children = parent.children || []
      children.push(item)
      parent.children = children
      levelMap[itemCode] = item
    } else {
      tree[itemCode] = item
      levelMap[itemCode] = item
    }
  })
  return tree
}

/**
 *
 * @param {string} nodeKey
 * @param {string} parentNodeKey
 * @returns {Object}
 */
FormArray.prototype.mapToMultiWayTreeNoSort = function(nodeKey, parentNodeKey) {
  let tree = {}
  let levelMap = {}
  this.forEach(item => {
    let parentCode = item[parentNodeKey]
    let itemCode = item[nodeKey]
    let parent = levelMap[parentCode]
    if (parent) {
      let children = parent.children || []
      children.push(item)
      parent.children = children
      levelMap[itemCode] = item
    } else {
      tree[itemCode] = item
      levelMap[itemCode] = item
    }
  })
  return tree
}

/**
 *
 * @param {string} key
 * @param {string} value
 * @returns {{}}
 */
FormArray.prototype.searchByKey = function(key, value) {
  let arr = this.filter(item => item[key] === value)
  return arr.length > 0 ? arr[0] : false
}
/**
 * @param {Object} target
 * @returns {{}}
 */
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

/**
 * @param {Array} template
 * @param {object} data
 * @returns {{}}
 */
function fetchData(template, data) {
  return FormArray.fromArray(template)
    .mapToObject((obj, item) => {
      obj[item.prop] = data[item.prop]
    })
}

function mapCascader(item, func) {
  if (item.children) {
    item.children = item.children.map(item => mapCascader(item, func))
  }
  return func(item)
}
export {FormArray, fetchData, cloneWithoutEmptyValue, mapCascader}
