// 工具方法
import {
  DataSetName,
  DeleteBtn, CloseButton, TemplateDragArea, ViewRootId,
  EditBtn, GuideDragItem, RootId, DragTemplate,
  TemplateItemTop, TemplateItemRight, TemplateItemBottom, TemplateItemLeft
} from '../config/constant'

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
 * 向元素中写入一个dataset 属性
 * @param {dom} el 写入的元素
 * @param {string} key dataset 的 key
 * @param {string} value dataset 的 value
 */
export function setDataSet (el, key, value) {
  if (el.dataset) {
    el.dataset[key] = value
  } else {
    el.setAttribute(`data-${key}`, value)
  }
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

// 创建一项为维护的指导内容
export function createGuideItem(renderData) {
  const { top, left, width, height, id, content, orderNumber, contentPosition, fixFlag } = renderData
  const dots = (['top', 'right', 'bottom', 'left'])
    .map(item => `<div class="e_dot-${item} e_dot-common" ${DataSetName}="e_dot-${item}"></div>`)
    .join('')

  const stringDom = `
    ${dots}
    <div class="e_top-step-number">${orderNumber || 1}</div>
    <div class="e_guide-content ${contentPosition}">
      <div class="e_guide-content-text">${content || '请维护用户指导内容！'}</div>
      <div class="e_guide-content-btn">
        <button class="e_delete-btn" ${DataSetName}="${DeleteBtn}">删除</button>
        <button class="e_edit-btn" ${DataSetName}="${EditBtn}">编辑</button>
      </div>
    </div>
  `

  const guideItemDom = ele('div', { id, class: 'e_guide-item', [DataSetName]: GuideDragItem })
  setStyles(guideItemDom, {
    position: fixFlag === 'Y' ? 'fixed' : 'absolute',
    top: `${top}px`,
    left: `${left}px`,
    width: `${width}px`,
    height: `${height}px`
  })

  guideItemDom.innerHTML = stringDom
  getRootElement().appendChild(guideItemDom)
}

// 获取模板元素
export function getEasyGuideTemplate () {
  return getElementById(DragTemplate)
}

// 是否有维护模式的根节点元素
export function hasRootElement () {
  return !!getRootElement()
}

// 获取最外层元素
export function getRootElement () {
  return getElementById(RootId)
}

// 创建维护模式的根节点元素
export function createRootElement () {
  document.body.appendChild(ele('div', { id: RootId }))
}

// 获取查看模式的最外层元素
export function getViewRoot () {
  return getElementById(ViewRootId)
}

// 是否有查看模式的根节点元素
export function hasViewRoot () {
  return !!getViewRoot()
}

// 创建查看模式的根节点元素
export function createViewRoot () {
  return ele('div', { style: 'height: 1px; width: 1px;', id: ViewRootId })
}

// 插入查看模式的根节点元素
export function insertViewRoot (el) {
  document.body.insertBefore(el, document.body.childNodes[0])
}

// 创建指导模板
export function createTemplateElement () {
  const templateList = (['top', 'right', 'bottom', 'left'])
    .map(i => `<div class="e_template-item-${i}" ${DataSetName}="template-item-${i}">top</div>`)
    .join('')

  const templateDomText = `
    <div class="e_template-close-btn" ${DataSetName}="${CloseButton}">x</div>
    <div class="e_template-top-text" title="按下拖动" ${DataSetName}="${TemplateDragArea}">
      点击以下组件添加指导
    </div>
    <div class="e_template-list">${templateList}</div>
  `

  const template = ele('div', { id: DragTemplate })
  template.innerHTML = templateDomText
  getRootElement().appendChild(template)
}

// Dom 界面移除子元素
export function removeChild(rootEle, child) {
  if (!isElement(rootEle) || !isElement(child)) {
    return
  }
  rootEle.removeChild(child)
}

export function setBarLibPosition(barList, { top, left, width, height, fixFlag }) {
  const position = `position:${fixFlag === 'Y' ? 'fixed' : 'absolute'};`
  const temp = [
    `height:${top}px;`,
    `height:${height}px; width:${left}px; top:${top}px;`,
    `height:${height}px; left:${left + width}px; top:${top}px;`,
    `top: ${top + height}px;`
  ]
  temp.forEach((item, index) => {
    barList[index].setAttribute('style', item + position)
  })
}

export function getBarElementList (rootEle) {
  return Array.from(rootEle.getElementsByClassName('bar-lib-common'))
}
export function getElementsByClassName (rootEle, className) {
  return rootEle.getElementsByClassName(className)[0]
}

function calcGuidePosition ({ top, left, height, width, fixFlag, contentPosition }) {
  const styleJoin = (top, left, transform = 'none') => {
    return {
      position: fixFlag === 'Y' ? 'fixed' : 'absolute',
      top: `${top}px`,
      left: `${left}px`,
      transform
    }
  }

  switch (contentPosition) {
    case TemplateItemTop:
      return styleJoin(top - 20, left, 'translateY(-100%)')
    case TemplateItemRight:
      return styleJoin(top, left + width + 20)
    case TemplateItemBottom:
      return styleJoin(top + height + 20, left)
    case TemplateItemLeft:
      return styleJoin(top, left - 20, 'translateX(-100%)')
    default:
  }
}

// 更新上一步下一步 dom 内容
export function refreshDom(showItemData, rootEle) {
  if (!rootEle) {
    rootEle = getViewRoot()
  }

  const barElementList = getBarElementList(rootEle)
  const contentWrap = getElementsByClassName(rootEle, 'e_step-content-box')
  const prevBtn = getElementsByClassName(rootEle, 'box-pre-btn')
  const nextBtn = getElementsByClassName(rootEle, 'box-next-btn')
  const content = getElementsByClassName(rootEle, 'box-content')
  content.innerHTML = showItemData.content

  setBarLibPosition(barElementList, showItemData)

  // 生成内容框
  setStyles(contentWrap, calcGuidePosition(showItemData))

  const { finalFlag, firstFlag } = showItemData
  if (finalFlag) {
    nextBtn.innerHTML = '关闭'
  } else {
    nextBtn.innerHTML = '下一步'
  }

  if (firstFlag) {
    prevBtn.style.visibility = 'hidden'
  } else {
    prevBtn.style.visibility = 'unset'
  }
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
 * 通过ID 获取元素
 * @param {string} id 元素ID
 */
export function getElementById (id) {
  return document.getElementById(id)
}
