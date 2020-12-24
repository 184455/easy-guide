// 工具方法
import {
  ElementDataSetName,
  MODE, DeleteBtn, CloseButton, TemplateDragArea, ViewEasyGuideWrapId,
  EditBtn, GuideDragItem, EasyGuideWrapId, EasyGuideTemplateId
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
export function createGuideItem(EG, elementName, {
  top, left, width, height, id, content, orderNumber, templatePosition, fixFlag
}) {
  const { mode } = EG
  const tempFragment = document.createDocumentFragment()
  const topStep = utilsCreateElement('div', { class: 'e_top-step-number' })
  topStep.innerHTML = orderNumber || 1

  const guideContent = utilsCreateElement('div', { class: `e_guide-content ${templatePosition}` })
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
    class: 'e_guide-item',
    [ElementDataSetName]: GuideDragItem
  })
  temp.style.position = fixFlag === 'Y' ? 'fixed' : 'absolute'
  temp.appendChild(tempFragment)

  editElementStyle(temp, { top: `${top}px`, left: `${left}px`, width: `${width}px`, height: `${height}px` })
  getEasyGuideWrap().appendChild(temp)
}

// 获取模板元素
export function getEasyGuideTemplate () {
  return document.getElementById(EasyGuideTemplateId)
}

// 是否有维护模式的根节点元素
export function hasMaintainGuideRoot () {
  return !!document.getElementById(EasyGuideWrapId)
}

// 获取最外层元素
export function getEasyGuideWrap () {
  return document.getElementById(EasyGuideWrapId)
}

// 创建维护模式的根节点元素
export function createEasyGuideWrap () {
  document.body.appendChild(utilsCreateElement('div', { id: EasyGuideWrapId }))
}

// 是否有查看模式的根节点元素
export function hasViewGuideRoot () {
  return !!document.getElementById(ViewEasyGuideWrapId)
}

// 获取查看模式的最外层元素
export function getViewGuideRoot () {
  return document.getElementById(ViewEasyGuideWrapId)
}

// 创建查看模式的根节点元素
export function createViewGuideRoot () {
  return utilsCreateElement('div', { style: 'height: 1px; width: 1px;', id: ViewEasyGuideWrapId })
}

// 插入查看模式的根节点元素
export function insertViewGuideRoot (ele) {
  document.body.insertBefore(ele, document.body.childNodes[0])
}

// 创建指导模板
export function createTemplateElement () {
  const tempFragment = document.createDocumentFragment()

  // 生成气泡模版
  const EasyGuideTemplate = utilsCreateElement('div', { id: EasyGuideTemplateId })
  const templateCloseBtn = utilsCreateElement('div', {
    class: 'e_template-close-btn',
    [ElementDataSetName]: CloseButton
  })
  templateCloseBtn.innerHTML = 'x'
  EasyGuideTemplate.appendChild(templateCloseBtn)
  const templateTopText = utilsCreateElement('div', {
    class: 'e_template-top-text',
    title: '按下拖动',
    [ElementDataSetName]: TemplateDragArea
  })
  templateTopText.innerHTML = '点击以下组件添加指导'
  EasyGuideTemplate.appendChild(templateTopText)
  const templateList = utilsCreateElement('div', { class: 'e_template-list' })
  const templateElement = ['top', 'right', 'bottom', 'left']
  templateElement.forEach(item => {
    const temp = utilsCreateElement('div', {
      class: `e_template-item-${item}`,
      [ElementDataSetName]: `template-item-${item}`
    })
    temp.innerHTML = item
    templateList.appendChild(temp)
  })
  EasyGuideTemplate.appendChild(templateList)

  // 把元素插入
  tempFragment.appendChild(EasyGuideTemplate)
  getEasyGuideWrap().appendChild(tempFragment)
}

// Dom 界面移除子元素
export function removeChild(rootEle, child) {
  rootEle.removeChild(child)
}
