import Config from '../config/index'
import {
  EasyGuideWrapId,
  EasyGuideCanvasId,
  EasyGuideDivContainerId,
  CanvasName
} from '../config/constant'
import { utilsCreateElement, addClass } from '../utils/dom'

function handleBodyClassName () {
  addClass(document.body, 'e_disable-body-selected')
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

    // EasyGuide 最外层 div 容器
    this.EasyGuideWrap = null

    // EasyGuide 画板
    this.EasyGuideCanvas = null

    // 确定浏览器可视窗口的宽高
    this.windowWidth = scrollAble ? document.body.scrollWidth : window.innerWidth
    this.windowHeight = scrollAble ? document.body.scrollHeight : window.innerHeight
  }

  // 展示-只读模式
  EasyGuide.prototype._showGuide = function () {}

  // 展示-编辑模式
  EasyGuide.prototype._showGuideMainTain = function () {
    const { windowWidth, windowHeight, Options } = this
    const tempFragment = document.createDocumentFragment()

    // 创建最 EasyGuide 最外层容器
    this.EasyGuideWrap = utilsCreateElement('div', { id: EasyGuideWrapId })

    // 创建 Canvas 画板
    this.EasyGuideCanvas = utilsCreateElement('canvas', {
      id: EasyGuideCanvasId,
      width: windowWidth,
      height: windowHeight
    })
    this.EasyGuideCanvas.dataset.elementName = CanvasName

    // 创建容纳用户维护的指导数据的容器
    this.EasyGuideDivContainer = utilsCreateElement('div', { id: EasyGuideDivContainerId })

    tempFragment.appendChild(this.EasyGuideCanvas)
    tempFragment.appendChild(this.EasyGuideDivContainer)
    this.EasyGuideWrap.appendChild(tempFragment)
    document.body.insertBefore(this.EasyGuideWrap, document.body.childNodes[0])

    // 处理 body 样式
    handleBodyClassName()

    this.EasyGuideCanvas = this.EasyGuideCanvas.getContext('2d')
    this.EasyGuideCanvas.fillStyle = Options.defaultFillStyle
    this.EasyGuideCanvas.fillRect(0, 0, windowWidth, windowHeight)
  }

  // 展示
  EasyGuide.prototype.show = function () {}

  // 销毁指导，数据，事件清理
  EasyGuide.prototype.destroy = function () {}
};
