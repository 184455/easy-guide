/**
 * Utils
 * 系统工具方法
 * @author Abner <xiaocao1602@qq.com>
 * @date 2021/01/01
 */

import { isElement } from './dom'

/**
 * 创建一个 guide 所必须拥有的字段
 * @param {object} data 初始化数据
 */
export function createGuideItemData (initVal) {
  const temp = mergeObj({
    id: String((new Date()).getTime()),
    content: '',
    width: 300,
    widthUtil: '%',
    height: 120,
    heightUtil: '%',
    left: 500,
    leftUtil: '%',
    top: 200,
    topUtil: 'px',
    orderNumber: 1,
    fixFlag: 'N',
    contentPosition: '_eG_guide-1'
  }, initVal)

  return transformUtil(temp, window.innerWidth, window.innerHeight)
}

/**
 * 找到数据中最大的某项数据
 * @param {array} list 列表数据
 * @param {string} field 比较的字段
 * @return {number} 列表里面最大的数
 */
export function getMaxNumber(list, field) {
  let res = 0
  list.forEach(item => {
    if (Number(item[field]) > res) {
      res = Number(item[field])
    }
  })
  return res
}

/**
 * 检测是否是空数组
 * @param {array} arr - 检测数组
 * @returns {boolean}
 */
export function isEmptyArray(arr) {
  if (!Array.isArray(arr)) {
    return true
  }
  return arr.length === 0
}

/**
 * 检测是否是非空数组
 * @param {array} arr - 检测数组
 * @returns {boolean}
 */
export function isNotEmptyArray(arr) {
  return Array.isArray(arr) && arr.length > 0
}

/**
 * 对象合并
 */
export function mergeObj() {
  return Object.assign.apply(this, arguments)
}

/**
 * 给对象元素添加单位
 * @param {object} obj 添加单位数据
 * @param {*} util 单位
 */
export function addUtil (obj, util) {
  return Object.keys(obj).reduce((prev, current) => {
    return mergeObj(prev, { [current]: obj[current] + util })
  }, {})
}

/**
 * 把目标元素移动到可视区域
 * @param {dom} el 需要显示的元素
 */
export function scrollIntoToView (el, options = {}) {
  if (isElement(el)) {
    el.scrollIntoView(mergeObj({ behavior: 'smooth', block: 'center', inline: 'nearest' }, options))
  }
}

/**
 * 维护信息，转换数据单位
 * @param {*} data
 * @param {*} windowWidth
 * @param {*} windowHeight
 */
export function transformUtil (data, windowWidth, windowHeight) {
  const transformKeys = ['left', 'top', 'width', 'height']
  const dependOnHeightKeys = []

  return Object.keys(data).reduce((prev, key) => {
    const oleVal = data[key]
    let val = data[key]
    const denominator = dependOnHeightKeys.indexOf(key) > -1 ? windowHeight : windowWidth

    if (transformKeys.indexOf(key) > -1) {
      if (data[`${key}Util`] === '%') {
        val = oleVal > 1 ? Number((val / denominator).toFixed(2)) : oleVal
      } else {
        val = oleVal < 1 ? parseInt(val * denominator) : parseInt(oleVal)
      }
    }
    return mergeObj(prev, { [key]: val })
  }, {})
}

export function toPixel (data, windowWidth, windowHeight) {
  const transformKeys = ['left', 'top', 'width', 'height']
  const dependOnHeightKeys = []

  return Object.keys(data).reduce((prev, key) => {
    let val = data[key]
    const denominator = dependOnHeightKeys.indexOf(key) > -1 ? windowHeight : windowWidth
    if (transformKeys.indexOf(key) === -1) {
      return prev
    }

    if (data[`${key}Util`] === '%') {
      val = parseInt(val * denominator)
    }
    return mergeObj(prev, { [key]: val })
  }, { position: isFixedPosition(data.fixFlag) })
}

export function isFixedPosition (flag) {
  return flag !== 'N' ? 'fixed' : 'absolute'
}

export function getWindowWidthHeight (isViewPort) {
  const vw = document.body.scrollWidth
  const vh = isViewPort ? window.innerHeight : document.body.scrollHeight
  return [vw, vh]
}

export function PX (n) {
  return n + 'px'
}

export function isDot (name) {
  return name.indexOf('_eG_dot-') > -1
}

export function addUtils (obj, keys, util = 'px') {
  return Object.keys(obj).reduce((prev, current) => {
    if (keys.indexOf(current) > -1) {
      return mergeObj(prev, { [current]: obj[current] + util })
    } else {
      return mergeObj(prev, { [current]: obj[current] })
    }
  }, {})
}

export function selectPosition ({ left, top, height, width, fixFlag }) {
  const [vw, vh] = getWindowWidthHeight(true)
  const newLeft = vw - left - width
  const newTop = vh - top - height

  switch (fixFlag) {
    case 'leftTop':
      return { left, top }
    case 'rightTop':
      return { left: newLeft, top }
    case 'rightBottom':
      return { left: newLeft, top: newTop }
    case 'leftBottom':
      return { left, top: newTop }
    default:
      return { left, top }
  }
}

export function isFunction (fun) {
  return typeof fun === 'function'
}
