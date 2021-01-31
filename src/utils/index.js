/**
 * Utils
 * 系统工具方法
 * @author Abner <xiaocao1602@qq.com>
 * @date 2021/01/01
 */

import { isElement } from './dom'

export function isEmptyArray(arr) {
  if (!Array.isArray(arr)) {
    return true
  }
  return arr.length === 0
}

export function isDot (name) {
  return name.indexOf('_eG_dot-') > -1
}

export function isFixed (flag) {
  return flag !== 'N'
}

export function isFixedPosition (flag) {
  return isFixed(flag) ? 'fixed' : 'absolute'
}

export function isFunction (fun) {
  return typeof fun === 'function'
}

export function isNotEmptyArray(arr) {
  return Array.isArray(arr) && arr.length > 0
}

export function assign() {
  return Object.assign.apply(this, arguments)
}

export function getMaxNumber(list, field) {
  return list.reduce((acc, current) => {
    return Number(current[field]) > acc ? Number(current[field]) : acc
  }, 0)
}

/**
 * 创建一个 guide 所必须拥有的字段
 * @param {object} data 初始化数据
 */
export function createGuideItemData (initVal) {
  const guideItem = assign({
    id: String((new Date()).getTime()),
    content: '',
    width: 300,
    widthUtil: '%',
    height: 120,
    heightUtil: 'px',
    left: 500,
    leftUtil: '%',
    top: 200,
    topUtil: 'px',
    orderNumber: 1,
    fixFlag: 'N',
    contentPosition: '_eG_guide-1'
  }, initVal)

  return transformUtilToSave(guideItem, window.innerWidth, window.innerHeight)
}

/**
 * 转换成根据某个角定位
 * @param {object} guideItem
 */
export function selectCorner (guideItem) {
  const { left, top, height, width, fixFlag } = guideItem
  const [vw, vh] = getWindowWidthHeight(true)
  const newLeft = vw - left - width
  const newTop = vh - top - height
  let res = { left, top }

  switch (fixFlag) {
    case 'leftTop':
      res = { left, top }
      break
    case 'rightTop':
      res = { left: newLeft, top }
      break
    case 'rightBottom':
      res = { left: newLeft, top: newTop }
      break
    case 'leftBottom':
      res = { left, top: newTop }
      break
    default:
  }

  return assign({}, guideItem, res)
}

/**
 * 单位转换
 * @param {*} guideItem
 * @param {*} windowWidth
 */
export function transformUtilToSave (guideItem, windowWidth) {
  const transformData = (['left', 'top', 'width', 'height']).reduce((acc, field) => {
    const util = guideItem[field + 'Util']
    const oleVal = guideItem[field]
    let val = guideItem[field]

    if (util === '%') {
      val = oleVal > 1 ? getUtilValue(val, '%', windowWidth) : oleVal
    } else {
      val = oleVal < 1 ? getUtilValue(val, 'px', windowWidth) : parseInt(oleVal)
    }
    return assign(acc, { [field]: val })
  }, {})

  return assign({}, guideItem, transformData)
}

/**
 * 把目标元素移动到可视区域
 * @param {dom} el 需要显示的元素
 */
export function scrollIntoToView (el, options = {}) {
  if (isElement(el)) {
    el.scrollIntoView(assign({ behavior: 'smooth', block: 'center', inline: 'nearest' }, options))
  }
}

/**
 * 获取窗口的宽高
 * @param {*} isFixed 是否是 fixed 定位
 */
export function getWindowWidthHeight (isFixed) {
  const vw = document.body.scrollWidth
  const vh = isFixed ? window.innerHeight : document.body.scrollHeight
  return [vw, vh]
}

export function px (n) {
  return n + 'px'
}

export function addUtils (obj, keys, util = 'px') {
  return Object.keys(obj).reduce((prev, current) => {
    if (keys.indexOf(current) > -1) {
      return assign(prev, { [current]: obj[current] + util })
    } else {
      return prev
    }
  }, {})
}

export function getUtilValue (val, util, width) {
  width = width || getWindowWidthHeight()[0]
  return util === '%' ? Number((val / width).toFixed(2)) : parseInt(val * width)
}
