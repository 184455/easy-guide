// 工具方法
import {
  DataSetName, PrevBtnName, NextBtnName, ViewCloseBtn,
  DeleteBtn, CloseButton, TemplateDragArea, ViewRootId,
  EditBtn, GuideDragItem, RootId, DragTemplate,
  TemplateItemTop, TemplateItemRight, TemplateItemBottom, TemplateItemLeft, MODE
} from '../config/constant'
import { mergeObj } from './index'

const POS = ['top', 'right', 'bottom', 'left']

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
export function createRootElement () {
  document.body.appendChild(ele('div', { id: RootId }))
}

// 是否有【维护模式】的根节点元素
export function hasRootElement () {
  return !!getRootElement()
}

// 获取【维护模式】的最外层元素
export function getRootElement () {
  return getElementById(RootId)
}

// 获取【查看模式】的最外层元素
export function getViewRoot () {
  return getElementById(ViewRootId)
}

// 是否有【查看模式】的根节点元素
export function hasViewRoot () {
  return !!getViewRoot()
}

// 创建【查看模式】的根节点元素
export function createViewRoot () {
  return ele('div', { style: 'height: 1px; width: 1px;', id: ViewRootId })
}

// 插入【查看模式】的根节点元素
export function insertViewRoot (el) {
  document.body.insertBefore(el, document.body.childNodes[0])
}

// 获取【模板】根元素
export function getEasyGuideTemplate () {
  return getElementById(DragTemplate)
}

// 指导内容框
export function guideContentBox ({ contentPosition, orderNumber, content }, mode) {
  let buttonStr
  if (mode === MODE.READ) {
    buttonStr = `
      <button class="e_prev-btn" ${DataSetName}="${PrevBtnName}">上一步</button>
      <button class="e_next-btn" ${DataSetName}="${NextBtnName}">关闭</button>
    `
  } else {
    buttonStr = `
      <button class="e_prev-btn" ${DataSetName}="${DeleteBtn}">删除</button>
      <button class="e_next-btn" ${DataSetName}="${EditBtn}">编辑</button>
    `
  }

  return `
    <div class="e_guide-content ${contentPosition}">
      <div class="e_guide-content-title">
        <div class="e_guide-title-text">步骤${orderNumber}</div>
        <div class="e_guide-close" ${DataSetName}="${ViewCloseBtn}">&#10005;</div>
      </div>
      <div class="e_guide-content-text">${content || '请维护用户指导内容！'}</div>
      <div class="e_guide-content-btn">${buttonStr}</div>
    </div>
  `
}

// 创建一项为维护的指导内容
export function createGuideItem(renderData) {
  const { top, left, width, height, id, fixFlag } = renderData
  const dots = POS
    .map(item => `<div class="e_dot-${item} e_dot-common" ${DataSetName}="e_dot-${item}"></div>`)
    .join('')

  const guideItemDom = ele('div', { id, class: 'e_guide-item', [DataSetName]: GuideDragItem })
  setStyles(guideItemDom, {
    position: fixFlag === 'Y' ? 'fixed' : 'absolute',
    top: `${top}px`,
    left: `${left}px`,
    width: `${width}px`,
    height: `${height}px`
  })

  guideItemDom.innerHTML = dots + guideContentBox(renderData)
  getRootElement().appendChild(guideItemDom)
}

// 创建指导模板
export function createTemplateElement () {
  const templateDomText = `
    <div ${DataSetName}="_eg-guide-1">
      <svg ${DataSetName}="_eg-guide-1" t="1609496176603" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16149" width="200" height="200"><path d="M93.0816 69.8368a23.296 23.296 0 0 0-23.2448 23.2448v837.8368c0 12.8 10.3936 23.2448 23.2448 23.2448h837.8368a23.296 23.296 0 0 0 23.2448-23.2448V93.0816a23.296 23.296 0 0 0-23.2448-23.2448H93.0816zM930.9184 0C982.3232 0 1024 41.6768 1024 93.0816v837.8368A93.0816 93.0816 0 0 1 930.9184 1024H93.0816A93.0816 93.0816 0 0 1 0 930.9184V93.0816C0 41.6768 41.6768 0 93.0816 0h837.8368z m-403.6608 251.392a34.9184 34.9184 0 0 0-34.9184 34.9184L492.288 476.16H302.5408a34.9184 34.9184 0 0 0-34.5088 29.7472l-0.4096 5.12c0 19.3536 15.6672 34.9696 34.9184 34.9696l189.7472-0.0512v189.7984c0 17.5616 12.9536 32.0512 29.7984 34.56l5.12 0.3584a34.9184 34.9184 0 0 0 34.9184-34.9184v-189.7984h189.7984a34.9184 34.9184 0 0 0 34.56-29.696l0.3584-5.1712a34.9184 34.9184 0 0 0-34.9184-34.9184H562.176V286.3104a34.9184 34.9184 0 0 0-29.696-34.5088z" fill="#ff8a2b" p-id="16150"></path></svg>
      <span ${DataSetName}="_eg-guide-1">添加指导</span>
    </div>
    <div>
      <svg t="1609495864673" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7298" width="200" height="200"><path d="M703.956003 63.996a31.998 31.998 0 1 1 0-63.996h186.932316C964.419724 0 1023.936004 59.51628 1023.936004 133.047685V319.980001a31.998 31.998 0 1 1-63.996 0V133.047685C959.940004 94.906068 929.029936 63.996 890.888319 63.996H703.956003z m255.984001 624.792951a31.998 31.998 0 1 1 63.996 0v202.099368C1023.936004 964.419724 964.419724 1023.936004 890.888319 1023.936004h-126.328104a31.998 31.998 0 1 1 0-63.996h126.328104c38.141616 0 69.051684-30.910068 69.051685-69.051685v-202.099368zM335.147053 959.940004a31.998 31.998 0 1 1 0 63.996H133.047685A133.047685 133.047685 0 0 1 0 890.888319V703.956003a31.998 31.998 0 1 1 63.996 0v186.932316C63.996 929.029936 94.906068 959.940004 133.047685 959.940004h202.099368zM63.996 319.980001a31.998 31.998 0 0 1-63.996 0V133.047685C0 59.51628 59.51628 0 133.047685 0H319.980001a31.998 31.998 0 0 1 0 63.996H133.047685C94.906068 63.996 63.996 94.906068 63.996 133.047685V319.980001zM511.968002 671.958003c109.625148 0 211.634773-56.892444 308.332729-175.989001C723.602775 376.872445 621.59315 319.980001 511.968002 319.980001c-109.625148 0-211.634773 56.892444-308.332729 175.989001C300.333229 615.065558 402.342854 671.958003 511.968002 671.958003z m0 63.996c-130.615837 0-249.968377-66.55584-357.993625-199.667521a63.996 63.996 0 0 1 0-80.63496C261.999625 322.539841 381.352165 255.984001 511.968002 255.984001c130.615837 0 249.968377 66.55584 357.993625 199.667521a63.996 63.996 0 0 1 0 80.63496C761.936379 669.398163 642.583839 735.954003 511.968002 735.954003z" fill="#ff8a2b" p-id="7299"></path><path d="M511.968002 575.964002a79.995 79.995 0 1 0 0-159.99A79.995 79.995 0 0 0 511.968002 575.964002z m0 63.996a143.991001 143.991001 0 1 1 0-287.982001A143.991001 143.991001 0 0 1 511.968002 639.960002z" fill="#ff8a2b" p-id="7300"></path></svg>
      <span>预览指导</span>
    </div>
    <div ${DataSetName}="${TemplateDragArea}">
      <svg ${DataSetName}="${TemplateDragArea}" t="1609496451507" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18379" width="200" height="200"><path d="M887.466667 0m34.133333 0l0 0q34.133333 0 34.133333 34.133333l0 136.533334q0 34.133333-34.133333 34.133333l0 0q-34.133333 0-34.133333-34.133333l0-136.533334q0-34.133333 34.133333-34.133333Z" p-id="18380" fill="#ff8a2b"></path><path d="M477.866667 819.2m34.133333 0l0 0q34.133333 0 34.133333 34.133333l0 136.533334q0 34.133333-34.133333 34.133333l0 0q-34.133333 0-34.133333-34.133333l0-136.533334q0-34.133333 34.133333-34.133333Z" p-id="18381" fill="#ff8a2b"></path><path d="M68.266667 682.666667m34.133333 0l0 0q34.133333 0 34.133333 34.133333l0 273.066667q0 34.133333-34.133333 34.133333l0 0q-34.133333 0-34.133333-34.133333l0-273.066667q0-34.133333 34.133333-34.133333Z" p-id="18382" fill="#ff8a2b"></path><path d="M887.466667 546.133333m34.133333 0l0 0q34.133333 0 34.133333 34.133334l0 409.6q0 34.133333-34.133333 34.133333l0 0q-34.133333 0-34.133333-34.133333l0-409.6q0-34.133333 34.133333-34.133334Z" p-id="18383" fill="#ff8a2b"></path><path d="M477.866667 0m34.133333 0l0 0q34.133333 0 34.133333 34.133333l0 409.6q0 34.133333-34.133333 34.133334l0 0q-34.133333 0-34.133333-34.133334l0-409.6q0-34.133333 34.133333-34.133333Z" p-id="18384" fill="#ff8a2b"></path><path d="M68.266667 0m34.133333 0l0 0q34.133333 0 34.133333 34.133333l0 273.066667q0 34.133333-34.133333 34.133333l0 0q-34.133333 0-34.133333-34.133333l0-273.066667q0-34.133333 34.133333-34.133333Z" p-id="18385" fill="#ff8a2b"></path><path d="M512 750.933333a102.4 102.4 0 1 1 0-204.8 102.4 102.4 0 0 1 0 204.8zM102.4 614.4a102.4 102.4 0 1 1 0-204.8 102.4 102.4 0 0 1 0 204.8z" p-id="18386" fill="#ff8a2b"></path><path d="M921.6 375.466667m-102.4 0a102.4 102.4 0 1 0 204.8 0 102.4 102.4 0 1 0-204.8 0Z" p-id="18387" fill="#ff8a2b"></path></svg>
      <span ${DataSetName}="${TemplateDragArea}">调整位置</span>
    </div>
    <div ${DataSetName}="${CloseButton}">关闭</div>
  `

  const template = ele('div', { id: DragTemplate })
  template.innerHTML = templateDomText
  getRootElement().appendChild(template)
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

function calcGuidePosition ({ top, left, height, width, fixFlag, contentPosition, windowWidth, windowHeight }) {
  const styleJoin = (top, left, obj = {}) => {
    return mergeObj({
      position: fixFlag === 'Y' ? 'fixed' : 'absolute',
      top: `${top}px`,
      left: `${left}px`
    }, obj)
  }

  const offset = 12
  const Height = fixFlag === 'Y' ? window.innerHeight : windowHeight
  switch (contentPosition) {
    case '_eg-guide-1':
      return styleJoin(top - offset, left, {
        right: 'unset',
        bottom: 'unset',
        transform: 'translateY(-100%)'
      })
    case '_eg-guide-2':
      return styleJoin(top - offset, left, {
        left: 'unset',
        right: `${windowWidth - (left + width)}px`,
        transform: 'translateY(-100%)'
      })
    case '_eg-guide-3':
      return styleJoin(top, left + width + offset, {
        right: 'unset',
        bottom: 'unset',
        transform: 'none'
      })
    case '_eg-guide-4':
      return styleJoin(top, left + width + offset, {
        top: 'unset',
        bottom: `${Height - (top + height)}px`,
        transform: 'none'
      })
    case '_eg-guide-5':
      return styleJoin(top + height + offset, left, {
        left: 'unset',
        right: `${windowWidth - (left + width)}px`,
        transform: 'none'
      })
    case '_eg-guide-6':
      return styleJoin(top + height + offset, left, {
        right: 'unset',
        bottom: 'unset',
        transform: 'none'
      })
    case '_eg-guide-7':
      return styleJoin(top, left - offset, {
        top: 'unset',
        bottom: `${Height - (top + height)}px`,
        transform: 'translateX(-100%)'
      })
    case '_eg-guide-8':
      return styleJoin(top, left - offset, {
        transform: 'translateX(-100%)',
        right: 'unset',
        bottom: 'unset'
      })
    default:
  }
}

// 更新上一步下一步 dom 内容
export function refreshDom(_this, showItemData, rootEle) {
  if (!rootEle) {
    rootEle = getViewRoot()
  }

  const barElementList = Array.from(rootEle.getElementsByClassName('bar-lib-common'))
  const contentWrap = getElement(rootEle, 'e_guide-content')
  const content = getElement(rootEle, 'e_guide-content-text')
  const closeTitle = getElement(rootEle, 'e_guide-title-text')
  const closeBtn = getElement(rootEle, 'e_guide-close')
  const prevBtn = getElement(rootEle, 'e_prev-btn')
  const nextBtn = getElement(rootEle, 'e_next-btn')
  content.innerHTML = showItemData.content
  const { windowWidth, windowHeight } = _this
  mergeObj(showItemData, { windowWidth, windowHeight })

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

  setBarLibPosition(barElementList, showItemData)

  const { contentPosition, orderNumber } = showItemData
  closeTitle.innerHTML = `步骤${orderNumber}`
  setStyles(closeBtn, { display: 'inline-block' })
  contentWrap.className = `e_guide-content ${contentPosition}`
  setStyles(contentWrap, calcGuidePosition(showItemData))
}
