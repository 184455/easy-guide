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

/*
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
