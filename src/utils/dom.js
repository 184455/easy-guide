// 工具方法

/**
 * 创建一个 div 元素
 * @param {object} props 能够被 setAttribute 识别的参数列表
 * @returns {Element} 返回 创建好的 div 元素
 */
export function utilsCreateElement(eleType = 'div', props = {}) {
  const ele = document.createElement(eleType)
  Object.keys(props).forEach((propKey) => {
    ele.setAttribute(propKey, props[propKey])
  })

  return ele
}

/**
 * 判断一个元素是否有某个样式的名称
 * @param el {DOM}
 * @param className {String} class name
 * @return {Boolean}
 */
export function hasClass(el, className) {
  const reg = new RegExp(`(^|\\s)${className}(\\s|$)`)
  return reg.test(el.className)
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

  const classNameList = el.className.split(' ')
  classNameList.push(className)
  el.className = classNameList.join(' ')
}

/**
 * 向元素中写入一个dataset 属性
 * @param {dom} el 写入的元素
 * @param {string} key dataset 的 key
 * @param {string} value dataset 的 value
 */
export function writeElementDataSet (el, key, value) {
  if (el.dataset) {
    el.dataset[key] = value
  } else {
    el.setAttribute(`data-${key}`, value)
  }
}

/**
 * 设置dom元素绝对定位的左和上边距
 * @param ele {dom}
 * @param left {number}
 * @param top {number}
 */
export function utilsMoveDiv (ele, left, top) {
  ele.style.left = left + 'px'
  ele.style.top = top + 'px'
}

/**
 * 设置dom元素的 style 属性
 * @param ele {dom}
 * @param props {object} 设置的属性
 */
export function editElementStyle (ele, props) {
  Object.keys(props).forEach(key => {
    ele.style[key] = props[key]
  })
}
