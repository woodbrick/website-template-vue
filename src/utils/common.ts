class FormArray extends Array {
  constructor() {
    super()
    // this = [...arguments]
    Array.prototype.forEach.call(arguments, (element: number) => {
      this.push(element)
    });
    console.log(arguments, this)
  }
  /**
   * @param {function(Object=obj, Object=item, number=index)} fun
   * @returns {Object}
   */
  mapToObject(fun: Function): Object {
    let obj = {};
    this.forEach((item, index) => {
      fun(obj, item, index);
    });
    return obj;
  }
  /**
   * @param {string} key
   * @returns {Object}
   */
  mapToObjectByKey(key: string): object {
    return this.mapToObject((map: any, item: any) => (map[item[key]] = item));
  }
  /**
   *
   * @param {string} nodeKey
   * @param {string} parentNodeKey
   * @returns {Object}
   */
  mapToMultiWayTree(nodeKey: string, parentNodeKey: string): object {
    let tree: any = {};
    this.sort((a, b) => {
      return a[nodeKey].length - b[nodeKey].length;
    });
    let levelMap: any = {};
    this.forEach(item => {
      let parentCode = item[parentNodeKey];
      let itemCode = item[nodeKey];
      let parent = levelMap[parentCode];
      if (parent) {
        let children = parent.children || [];
        children.push(item);
        parent.children = children;
        levelMap[itemCode] = item;
      }
      else {
        tree[itemCode] = item;
        levelMap[itemCode] = item;
      }
    });
    return tree;
  }
  /**
   *
   * @param {string} nodeKey
   * @param {string} parentNodeKey
   * @returns {Object}
   */
  mapToMultiWayTreeNoSort(nodeKey: string, parentNodeKey: string): object {
    let tree: any = {};
    let levelMap: any = {};
    this.forEach(item => {
      let parentCode = item[parentNodeKey];
      let itemCode = item[nodeKey];
      let parent = levelMap[parentCode];
      if (parent) {
        let children = parent.children || [];
        children.push(item);
        parent.children = children;
        levelMap[itemCode] = item;
      }
      else {
        tree[itemCode] = item;
        levelMap[itemCode] = item;
      }
    });
    return tree;
  }
  /**
   *
   * @param {string} key
   * @param {string} value
   * @returns {Object}
   */
  searchByKey(key: string, value: string): object {
    let arr = this.filter(item => item[key] === value);
    return arr.length > 0 ? arr[0] : false;
  }
  /**
   * @param {Array} arr
   * @returns {FormArray}
   */
  static fromArray(arr: Array<any>): FormArray {
    return new FormArray(...arr);
  }
  /**
   * @param {any} object
   * @returns {FormArray}
   */
  static fromObject(object: any): FormArray {
    let arr = Object.keys(object).map(key => ({
      key: key,
      value: object[key]
    }));
    return new FormArray(...arr);
  }
}

let arr = FormArray.fromArray([1,2,3])
console.log(arr)


/**
 * @param {any} target
 * @returns {Object}
 */
function cloneWithoutEmptyValue(target: any): object {
  if (typeof target !== 'object')
    return {};
  let obj: any = {};
  Object.keys(target).forEach(key => {
    if (target[key]) {
      obj[key] = target[key];
    }
  });
  return obj;
}

/**
 * @param {Array} template
 * @param {any} data
 * @returns {Object}
 */
function fetchData(template: Array<any>, data: any): Object {
  return FormArray.fromArray(template)
    .mapToObject((obj: any, item: any) => {
      obj[item.prop] = data[item.prop];
    });
}

function mapCascader(item: any, func: Function) {
  if (item.children) {
    item.children = item.children.map((item: any) => mapCascader(item, func))
  }
  return func(item)
}

/**
 * convert Array to Map object by key
 * @param {*} arr 
 * @param {*} key 
 */
function arrayToMap(arr: any[], key: string): Map<string, any> {
  let map = new Map()
  arr.forEach(item => {
    map.set(item[key], item)
  })
  return map
}

export {FormArray, fetchData, cloneWithoutEmptyValue, mapCascader, arrayToMap}
