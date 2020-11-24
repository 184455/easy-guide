// 工具方法
import {
  DefaultFillStyle,
  ElementDataSetName,
  MODE, DeleteBtn,
  EditBtn, GuideDragItem
} from '../config/constant'

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

// canvas 画布
export function canvasPainting (ctx, next, windowArea, guideList = [], _DefaultFillStyle = DefaultFillStyle) {
  const { windowWidth, windowHeight } = windowArea

  ctx.save()
  ctx.clearRect(0, 0, windowWidth, windowHeight)
  ctx.fillStyle = _DefaultFillStyle
  ctx.fillRect(0, 0, windowWidth, windowHeight)
  if (Array.isArray(guideList) && guideList.length) {
    guideList.forEach(item => {
      ctx.clearRect(item.left, item.top, item.width, item.height)
    })
  }
  if (typeof next === 'object') {
    const { left, top, width, height } = next
    ctx.clearRect(left, top, width, height)
  }
  ctx.restore()
}

/**
 * 获取元素的：左 上 宽 高
 * @param {dom} el 目标元素
 */
export function getPosition (el) {
  const res = {};
  (['top', 'left', 'width', 'height']).map(item => {
    res[item] = parseInt(el.style[item], 10)
  })
  return res
}

// 创建指导的小框
export function createGuideItem(EG, elementName, { top, left, width, height, id, content, orderNumber }) {
  const { mode } = EG
  const tempFragment = document.createDocumentFragment()
  const topStep = utilsCreateElement('div', { class: 'e_top-step-number' })
  topStep.innerHTML = orderNumber || 1

  const guideContent = utilsCreateElement('div', { class: 'e_guide-content' })
  // editElementStyle(guideContent, { bottom: `${height + 12}px` })
  const contentText = utilsCreateElement('div', { class: 'e_guide-content-text' })
  contentText.innerHTML = content || '请输入指导内容！'
  guideContent.appendChild(contentText)
  const guideContentBtn = utilsCreateElement('div', { class: 'e_guide-content-btn' })

  if (mode === MODE.READ) {
    // 只读模式
    const closeBtn = utilsCreateElement('button', { class: 'e_close-btn' })
    closeBtn.innerHTML = '关闭'
    const prevBtn = utilsCreateElement('button', { class: 'e_prev-btn' })
    prevBtn.innerHTML = '上一步'
    const nextBtn = utilsCreateElement('button', { class: 'e_next-btn' })
    nextBtn.innerHTML = '下一步'

    guideContentBtn.appendChild(closeBtn)
    guideContentBtn.appendChild(prevBtn)
    guideContentBtn.appendChild(nextBtn)
  } else if (mode === MODE.MAINTAIN) {
    // 维护编辑模式
    const deleteBtn = utilsCreateElement('button', {
      class: 'e_delete-btn',
      [ElementDataSetName]: DeleteBtn
    })
    deleteBtn.innerHTML = '删除'
    const editBtn = utilsCreateElement('button', {
      class: 'e_edit-btn',
      [ElementDataSetName]: EditBtn
    })
    editBtn.innerHTML = '编辑'

    guideContentBtn.appendChild(deleteBtn)
    guideContentBtn.appendChild(editBtn)
  }

  //  创建 dot 拖动调整宽度的元素
  const dotFrag = document.createDocumentFragment();
  (['top', 'right', 'bottom', 'left']).map(item => {
    dotFrag.appendChild(utilsCreateElement('div', {
      class: `e_dot-${item} e_dot-common`,
      [ElementDataSetName]: `e_dot-${item}`
    }))
  })

  guideContent.appendChild(guideContentBtn)

  tempFragment.appendChild(dotFrag)
  tempFragment.appendChild(topStep)
  tempFragment.appendChild(guideContent)
  const temp = utilsCreateElement('div', {
    id,
    class: `e_guide-item ${elementName}`,
    [ElementDataSetName]: GuideDragItem
  })
  temp.appendChild(tempFragment)

  editElementStyle(temp, { top: `${top}px`, left: `${left}px`, width: `${width}px`, height: `${height}px` })
  EG.EasyGuideDivContainer.appendChild(temp)
}
