import Config from '../config/index'
import {
  MODE,
  EasyGuideWrapId,
  EasyGuideCanvasId,
  EasyGuideDivContainerId,
  EasyGuideTemplateId,
  ElementDataSetName,
  CanvasName,
  CloseButton,
  TemplateDragArea
} from '../config/constant'
import { utilsCreateElement, addClass, deleteClass, editElementStyle } from '../utils/dom'

function handleBodyClassName () {
  addClass(document.body, 'e_disable-body-selected')
}
function handleRemoveBodyClassName () {
  deleteClass(document.body, 'e_disable-body-selected')
}
const setBarLibPosition = (barList, { top, left, width, height }) => {
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

const createContentBox = (props, viewClose) => {
  const contentBox = utilsCreateElement('div', props)

  const content = utilsCreateElement('div', { class: 'box-content' })
  contentBox.appendChild(content)

  const footerBtn = utilsCreateElement('div', { class: 'content-footer' })
  contentBox.appendChild(content)

  const preBtn = utilsCreateElement('button', { class: 'box-pre-btn' })
  preBtn.textContent = '上一步'
  footerBtn.appendChild(preBtn)

  const nextBtn = utilsCreateElement('button', { class: 'box-next-btn' })
  nextBtn.onclick = viewClose
  nextBtn.textContent = '关闭'
  footerBtn.appendChild(nextBtn)

  contentBox.appendChild(footerBtn)

  return contentBox
}

/**
 * EasyGuide 初始化函数
 * -------------------------------------------------------------------------
 * 1、提供不同的模式，初始化不同的功能的能力；
 * 2、注入一些基本方法；
 *
 * @param {constructor} EasyGuide
 */
export default function initMixin (EasyGuide) {
  EasyGuide.prototype.init = function (_options) {
    // 处理 Options
    this.Options = Object.assign({}, Config, _options)
    const { scrollAble } = this.Options

    // 用户指导列表
    this.guideList = (this.Options.guideList || []).slice(0)

    // 创建最 EasyGuide 最外层容器
    this.EasyGuideWrap = utilsCreateElement('div', { id: EasyGuideWrapId })

    // EasyGuide 画板
    this.EasyGuideCanvasContext = null

    // EasyGuide 气泡模版
    this.EasyGuideTemplate = null

    // 查看模式下的根节点
    this.ViewGuideWrap = null

    // 查看模式下的遮罩元素
    this.BarList = null

    // 确定浏览器可视窗口的宽高
    this.windowWidth = scrollAble ? document.body.scrollWidth : window.innerWidth
    this.windowHeight = scrollAble ? document.body.scrollHeight : window.innerHeight

    // 把根节点插入文档
    document.body.insertBefore(this.EasyGuideWrap, document.body.childNodes[0])
  }

  // 展示-只读模式
  EasyGuide.prototype._showGuide = function () {
    // 生成上左右下四个遮罩元素
    const barElement = document.createDocumentFragment()
    this.BarList = ['bar-lib-top', 'bar-lib-left', 'bar-lib-right', 'bar-lib-bottom'].map((item) => {
      const temp = utilsCreateElement('div', { class: `${item} bar-lib-common` })
      barElement.appendChild(temp)
      return temp
    })

    const currentItem = this.guideList[0] || {}

    setBarLibPosition(this.BarList, currentItem)

    // 生成内容框
    const contentBox = createContentBox({ class: 'e_step-content-box' }, this.Options.viewClose)
    editElementStyle(contentBox, {
      top: `${currentItem.top + currentItem.height + 20}px`,
      left: `${currentItem.left}px`
    })

    this.ViewGuideWrap = utilsCreateElement('div', { style: 'height: 1px; width: 1px;' })
    this.ViewGuideWrap.appendChild(barElement)
    this.ViewGuideWrap.appendChild(contentBox)

    editElementStyle(this.EasyGuideWrap, { width: '1px', height: '1px' })
    addClass(document.body, 'e_position-relative')
    document.body.insertBefore(this.ViewGuideWrap, document.body.childNodes[0])
  }

  // 展示-编辑模式
  EasyGuide.prototype._showGuideMainTain = function () {
    const { windowWidth, windowHeight, Options } = this

    // 创建 Canvas 画板
    const tempFragment = document.createDocumentFragment()

    const tempCanvas = utilsCreateElement('canvas', {
      id: EasyGuideCanvasId,
      width: windowWidth,
      height: windowHeight,
      [ElementDataSetName]: CanvasName
    })
    this.EasyGuideCanvasContext = tempCanvas.getContext('2d')
    this.EasyGuideCanvasContext.fillStyle = Options.defaultFillStyle
    this.EasyGuideCanvasContext.fillRect(0, 0, windowWidth, windowHeight)
    this.EasyGuideCanvasContext.restore()

    // 创建容纳用户维护的指导数据的容器
    this.EasyGuideDivContainer = utilsCreateElement('div', { id: EasyGuideDivContainerId })

    // 生成气泡模版
    this.EasyGuideTemplate = utilsCreateElement('div', { id: EasyGuideTemplateId })
    const templateCloseBtn = utilsCreateElement('div', {
      class: 'e_template-close-btn',
      [ElementDataSetName]: CloseButton
    })
    templateCloseBtn.innerHTML = 'x'
    this.EasyGuideTemplate.appendChild(templateCloseBtn)
    const templateTopText = utilsCreateElement('div', {
      class: 'e_template-top-text',
      title: '按下拖动',
      [ElementDataSetName]: TemplateDragArea
    })
    templateTopText.innerHTML = '点击以下组件添加指导'
    this.EasyGuideTemplate.appendChild(templateTopText)
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
    this.EasyGuideTemplate.appendChild(templateList)

    // 把元素插入
    tempFragment.appendChild(tempCanvas)
    tempFragment.appendChild(this.EasyGuideDivContainer)
    tempFragment.appendChild(this.EasyGuideTemplate)
    this.EasyGuideWrap.appendChild(tempFragment)
  }

  // 展示
  EasyGuide.prototype.show = function () {
    const { mode } = this.Options

    // 处理 body 样式
    handleBodyClassName()

    editElementStyle(this.EasyGuideWrap, { width: `${this.windowWidth}px`, height: `${this.windowHeight}px` })

    const root = document.getElementById(EasyGuideWrapId)
    if (!root) {
      // 如果根节点不在，重新插入
      document.body.insertBefore(this.EasyGuideWrap, document.body.childNodes[0])
      return
    }

    // 给根节点插入元素
    if (mode === MODE.MAINTAIN) {
      // 维护模式
      this._showGuideMainTain()
    } else if (mode === MODE.READ) {
      // 查看模式
      this._showGuide()
    }
  }

  // 销毁指导，数据，事件清理
  EasyGuide.prototype.destroy = function () {
    if (this.Options.mode === MODE.READ) {
      handleRemoveBodyClassName()
      document.body.removeChild(this.ViewGuideWrap)
      return
    }

    this.eventsDestroy()
    handleRemoveBodyClassName()
    document.body.removeChild(this.EasyGuideWrap)
  }
};
