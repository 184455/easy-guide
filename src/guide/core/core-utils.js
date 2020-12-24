// core 模块的工具方法
import Config from '../../config/index'
import { createGuideItemData } from '../../utils/index'
import {
  addClass,
  deleteClass,
  editElementStyle,
  createGuideItem,
  getEasyGuideWrap,
  utilsCreateElement,
  hasMaintainGuideRoot,
  createEasyGuideWrap,
  createTemplateElement,
  createViewGuideRoot,
  insertViewGuideRoot
} from '../../utils/dom'

export function handleBodyClassName () {
  addClass(document.body, 'e_disable-body-selected')
}
export function handleRemoveBodyClassName () {
  deleteClass(document.body, 'e_disable-body-selected')
}
export function setBarLibPosition(barList, { top, left, width, height }) {
  const temp = [
    `height:${top}px`,
    `height:${height}px; width:${left}px; top:${top}px`,
    `height:${height}px; left:${left + width}px; top:${top}px`,
    `top: ${top + height}px`
  ]
  temp.forEach((item, index) => {
    barList[index].setAttribute('style', item)
  })
}
export function createContentBox(props, viewClose) {
  const contentBox = utilsCreateElement('div', props)

  const content = utilsCreateElement('div', { class: 'box-content' })
  contentBox.appendChild(content)

  const footerBtn = utilsCreateElement('div', { class: 'content-footer' })
  contentBox.appendChild(content)

  const preBtn = utilsCreateElement('button', { class: 'box-pre-btn' })
  preBtn.onclick = viewClose
  preBtn.textContent = '上一步'
  footerBtn.appendChild(preBtn)

  const nextBtn = utilsCreateElement('button', { class: 'box-next-btn' })
  nextBtn.onclick = viewClose
  nextBtn.textContent = '关闭'
  footerBtn.appendChild(nextBtn)

  contentBox.appendChild(footerBtn)

  return contentBox
}
export function renderGuideList(_this) {
  const { guideList } = _this
  if (Array.isArray(guideList)) {
    guideList.forEach((position) => {
      createGuideItem(_this, 'template-item-top', createGuideItemData(position))
    })
  }
}
// 展示-编辑模式
export function showGuideMainTain(_this) {
  const { windowWidth, windowHeight } = _this

  // 检查根结点
  if (!hasMaintainGuideRoot()) {
    createEasyGuideWrap()
  }

  // 设置蒙板宽高
  const EasyGuideWrap = getEasyGuideWrap()
  editElementStyle(EasyGuideWrap, { height: windowHeight + 'px', width: windowWidth + 'px' })

  // 渲染用户指导
  renderGuideList(_this)

  // 初始化事件
  _this.initEvents()

  // 创建指导模板
  createTemplateElement()
}
// 展示-只读模式
export function showGuide(_this) {
  const currentItem = _this.guideList[0]
  if (!currentItem || !Object.keys(currentItem).length) {
    return
  }

  // 生成上左右下四个遮罩元素
  const barElement = document.createDocumentFragment()
  const barElementList = (['bar-lib-top', 'bar-lib-left', 'bar-lib-right', 'bar-lib-bottom']).map((item) => {
    const temp = utilsCreateElement('div', { class: `${item} bar-lib-common` })
    barElement.appendChild(temp)
    return temp
  })

  setBarLibPosition(barElementList, currentItem)

  // 默认关闭函数
  let viewCloseFun = () => {
    _this.destroy()
  }
  if (typeof _this.Options.viewClose === 'function') {
    viewCloseFun = _this.Options.viewClose
  }

  // 生成内容框
  const contentBox = createContentBox({ class: 'e_step-content-box' }, viewCloseFun)
  editElementStyle(contentBox, {
    top: `${currentItem.top + currentItem.height + 20}px`,
    left: `${currentItem.left}px`
  })

  const tempRootEle = createViewGuideRoot()
  tempRootEle.appendChild(barElement)
  tempRootEle.appendChild(contentBox)

  if (hasMaintainGuideRoot()) {
    editElementStyle(getEasyGuideWrap(), { width: '1px', height: '1px' })
  }
  addClass(document.body, 'e_position-relative')
  insertViewGuideRoot(tempRootEle)
}

// 处理options
export function handleOptions(options) {
  return Object.assign({}, Config, options)
}

// 初始化面板的宽高
export function initWindowWidthAndHeight(_this) {
  const { scrollAble } = _this.Options
  _this.windowWidth = scrollAble ? document.body.scrollWidth : window.innerWidth
  _this.windowHeight = scrollAble ? document.body.scrollHeight : window.innerHeight
}
