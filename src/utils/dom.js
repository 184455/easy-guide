/**
 * DOM utils
 * 操作 dom 工具方法
 * @author Abner <xiaocao1602@qq.com>
 * @date 2021/01/01
 */

import { mergeObj } from './index'

/**
 * 创建一个 div 元素
 * @param {object} props 能够被 setAttribute 识别的参数列表
 * @returns {Element} 返回 创建好的 div 元素
 */
export function ele(eleType = 'div', props = {}) {
  const el = document.createElement(eleType)
  Object.keys(props).forEach((propKey) => {
    el.setAttribute(propKey, props[propKey])
  })

  return el
}

/**
 * 判断一个元素是否有某个样式的名称
 * @param el {DOM}
 * @param className {String} class name
 * @return {Boolean}
 */
export function hasClass(el, className) {
  return el.className.indexOf(className) > -1
}

/**
 * 为某个元素添加样式
 * @param el {DOM} Must
 * @param className
 */
export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }

  const classNameList = el.className.trim().split(/\s+/)
  classNameList.push(className)
  el.className = classNameList.join(' ').trim()
}

/**
 * 删除某个元素的样式
 * @param el {DOM} Must
 * @param className
 */
export function deleteClass(el, className) {
  if (!hasClass(el, className)) {
    return
  }

  const classNameList = el.className.split(' ').filter(name => name !== className)
  el.className = classNameList.length ? classNameList.join(' ') : ''
}

/**
 * 设置dom元素的 style 属性
 * @param el {dom}
 * @param props {object} 设置的属性
 */
export function setStyles (el, props) {
  Object.keys(props).forEach(key => {
    el.style[key] = props[key]
  })
}

/**
 * 通过ID 获取元素
 * @param {string} id 元素ID
 */
export function getElementById (id) {
  return document.getElementById(id)
}

/**
 * 根据样式名称获取指定元素 - 只获取第一个
 * @param {dom} rootEle 目标元素根节点
 * @param {string} className 样式名称
 */
export function getElement (rootEle, className) {
  return rootEle.getElementsByClassName(className)[0]
}

/**
 * 移除子元素
 * @param {dom} rootEle 容器元素
 * @param {dom} child 需要移除的元素
 */
export function removeChild(rootEle, child) {
  if (!isElement(rootEle) || !isElement(child)) {
    return
  }
  rootEle.removeChild(child)
}

/**
 * 判断一个对象是否是 dom 元素
 * @param {*} obj 被检测对象
 */
export function isElement(obj) {
  try {
    return obj instanceof HTMLElement
  } catch (e) {
    return (typeof obj === 'object') &&
      (obj.nodeType === 1) && (typeof obj.style === 'object') &&
      (typeof obj.ownerDocument === 'object')
  }
}

/**
 * 获取元素的：左 上 宽 高
 * @param {dom} el 目标元素
 */
export function getPosition (el) {
  return (['top', 'left', 'width', 'height']).reduce((prev, current) => {
    return mergeObj({}, prev, { [current]: parseInt(el.style[current], 10) })
  }, {})
}

// --------------------------------------------- 分割线 -----------------------------------------------------

// 创建【维护模式】的根节点元素
export function createMaintainRoot () {
  document.body.appendChild(ele('div', { id: '_eG_root' }))
}

// 是否有【维护模式】的根节点元素
export function hasMaintainRoot () {
  return !!getMaintainRoot()
}

// 获取【维护模式】的最外层元素
export function getMaintainRoot () {
  return getElementById('_eG_root')
}

// 获取【查看模式】的最外层元素
export function getViewRoot () {
  return getElementById('_eG_viewRoot')
}

// 是否有【查看模式】的根节点元素
export function hasViewRoot () {
  return !!getViewRoot()
}

// 创建【查看模式】的根节点元素
export function createViewRoot () {
  return ele('div', { style: 'height: 1px; width: 1px;', id: '_eG_viewRoot' })
}

// 获取【操作条】根元素
export function getOperationBarEle () {
  return getElementById('_eG_operation-bar')
}
