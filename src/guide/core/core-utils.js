// core 模块的工具方法
import Config from '../../config/index'
import { ElementDataSetName, PrevBtnName, NextBtnName } from '../../config/constant'
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
  insertViewGuideRoot,
  updateStepDom
} from '../../utils/dom'

export function handleBodyClassName () {
  addClass(document.body, 'e_disable-body-selected')
}
export function handleRemoveBodyClassName () {
  deleteClass(document.body, 'e_disable-body-selected')
}
export function createBar() {
  const barElement = document.createDocumentFragment();
  (['bar-lib-top', 'bar-lib-left', 'bar-lib-right', 'bar-lib-bottom']).map((item) => {
    const temp = utilsCreateElement('div', { class: `${item} bar-lib-common` })
    barElement.appendChild(temp)
  })

  return barElement
}
export function createContentBox() {
  const contentBox = utilsCreateElement('div', { class: 'e_step-content-box' })

  const content = utilsCreateElement('div', { class: 'box-content' })
  contentBox.appendChild(content)

  const footerBtn = utilsCreateElement('div', { class: 'content-footer' })
  contentBox.appendChild(content)

  const preBtn = utilsCreateElement('button', { class: 'box-pre-btn', [ElementDataSetName]: PrevBtnName })
  preBtn.textContent = '上一步'
  footerBtn.appendChild(preBtn)

  const nextBtn = utilsCreateElement('button', { class: 'box-next-btn', [ElementDataSetName]: NextBtnName })
  nextBtn.textContent = '下一步'
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

  // 创建指导模板
  createTemplateElement()
}
// 展示-只读模式
export function showGuide(_this) {
  let currentItem = _this.guideList[0]
  if (!currentItem || !Object.keys(currentItem).length) {
    return
  }

  currentItem = Object.assign({}, _this.guideList[0], {
    finalFlag: _this.guideList.length === 1,
    firstFlag: true
  })

  addClass(document.body, 'e_position-relative')
  const tempRootEle = createViewGuideRoot()
  tempRootEle.appendChild(createBar())
  tempRootEle.appendChild(createContentBox())
  updateStepDom(currentItem, tempRootEle)
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
