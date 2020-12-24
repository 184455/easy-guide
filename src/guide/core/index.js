import { MODE } from '../../config/constant'
import { getEasyGuideWrap, createEasyGuideWrap, removeChild, getViewGuideRoot } from '../../utils/dom'
import {
  handleBodyClassName,
  handleRemoveBodyClassName,
  showGuideMainTain,
  showGuide,
  handleOptions,
  initWindowWidthAndHeight
} from './core-utils'

/**
 * EasyGuide 初始化函数
 * -------------------------------------------------------------------------
 * 1、提供不同的模式，初始化不同的功能的能力；
 * 2、注入一些基本方法；
 *
 * @param {constructor} EasyGuide
 */
export default function InitMixin (EasyGuide) {
  // 初始化
  EasyGuide.prototype.init = function (options) {
    // 处理配置文件
    this.Options = handleOptions(options)
    const { mode, guideList } = this.Options

    // 用户指导列表
    this.guideList = (guideList || []).slice(0)

    // 模式
    this.mode = mode

    // 确定浏览器可视窗口的宽高
    initWindowWidthAndHeight(this)

    // 把根节点插入文档
    createEasyGuideWrap()

    // 初始化事件
    this.initEvents()
  }

  // 展示
  EasyGuide.prototype.show = function () {
    const { mode } = this

    // 处理 body 样式
    handleBodyClassName()

    if (mode === MODE.MAINTAIN) {
      // 维护模式
      showGuideMainTain(this)
    } else if (mode === MODE.READ) {
      // 查看模式
      showGuide(this)
    }
  }

  // 改变模式
  EasyGuide.prototype.setMode = function (newMode) {
    this.mode = newMode
  }

  // 销毁指导，数据，事件清理
  EasyGuide.prototype.destroy = function () {
    if (this.mode === MODE.READ) {
      handleRemoveBodyClassName()
      removeChild(document.body, getViewGuideRoot())
      return
    }

    this.eventsDestroy()
    handleRemoveBodyClassName()
    removeChild(document.body, getEasyGuideWrap())
  }
};
