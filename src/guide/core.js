import Config from '../config/index'
import {
  EasyGuideWrapId,
  EasyGuideCanvasId,
  EasyGuideDivContainerId,
  EasyGuideTemplateId,
  ElementDataSetName,
  CanvasName,
  CloseButton,
  TemplateDragArea,
  DefaultFillStyle
} from '../config/constant'
import { utilsCreateElement, addClass, deleteClass } from '../utils/dom'

function handleBodyClassName () {
  addClass(document.body, 'e_disable-body-selected')
}
function handleRemoveBodyClassName () {
  deleteClass(document.body, 'e_disable-body-selected')
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
    this.guideList = []

    // 创建最 EasyGuide 最外层容器
    this.EasyGuideWrap = utilsCreateElement('div', { id: EasyGuideWrapId })

    // EasyGuide 画板
    this.EasyGuideCanvasContext = null

    // EasyGuide 气泡模版
    this.EasyGuideTemplate = null

    // 确定浏览器可视窗口的宽高
    this.windowWidth = scrollAble ? document.body.scrollWidth : window.innerWidth
    this.windowHeight = scrollAble ? document.body.scrollHeight : window.innerHeight

    // 把根节点插入文档
    document.body.insertBefore(this.EasyGuideWrap, document.body.childNodes[0])
  }

  // 展示-只读模式
  EasyGuide.prototype._showGuide = function () {}

  // 展示-编辑模式
  EasyGuide.prototype._showGuideMainTain = function () {
    const { windowWidth, windowHeight, Options } = this

    // 处理 body 样式
    handleBodyClassName()

    const root = document.getElementById(EasyGuideWrapId)
    if (!root) {
      // 如果根节点不在，重新插入
      document.body.insertBefore(this.EasyGuideWrap, document.body.childNodes[0])
      return
    }

    // 创建 Canvas 画板
    const tempFragment = document.createDocumentFragment()

    const tempCanvas = utilsCreateElement('canvas', {
      id: EasyGuideCanvasId,
      width: windowWidth,
      height: windowHeight,
      [ElementDataSetName]: CanvasName
    })
    this.EasyGuideCanvasContext = tempCanvas.getContext('2d')

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

    // 把元素插在 body 的第一个元素的位置
    tempFragment.appendChild(tempCanvas)
    tempFragment.appendChild(this.EasyGuideDivContainer)
    tempFragment.appendChild(this.EasyGuideTemplate)
    this.EasyGuideWrap.appendChild(tempFragment)

    // 生成画板
    this.EasyGuideCanvasContext.fillStyle = Options.defaultFillStyle
    this.EasyGuideCanvasContext.fillRect(0, 0, windowWidth, windowHeight)
    this.EasyGuideCanvasContext.restore()
  }

  // 展示
  EasyGuide.prototype.show = function () {}

  // 销毁指导，数据，事件清理
  EasyGuide.prototype.destroy = function () {
    this.eventsDestroy()
    handleRemoveBodyClassName()
    document.body.removeChild(this.EasyGuideWrap)
  }
};
