import { MODE } from '../../config/constant'
import { mergeCustomOptions } from '../../utils/index'
import { getRootElement, removeChild, getViewRoot } from '../../utils/dom'
import {
  handleBodyClassName,
  handleRemoveBodyClassName,
  showGuideMainTain,
  showGuideView,
  initDefaultData,
  initWindowWidthAndHeight
} from './core-utils'

export default function InitMixin (EG) {
  EG.prototype.init = function (options) {
    this.Options = mergeCustomOptions(options)
    initDefaultData(this)
    initWindowWidthAndHeight(this)
  }

  EG.prototype.show = function () {
    handleBodyClassName()
    initWindowWidthAndHeight(this)
    console.log(this)

    const { mode } = this
    if (mode === MODE.MAINTAIN) {
      showGuideMainTain(this)
    } else if (mode === MODE.READ) {
      showGuideView(this)
    }

    // 初始化事件
    this.initEvents()
  }

  EG.prototype.setMode = function (newMode) {
    this.mode = newMode
  }

  EG.prototype.destroy = function () {
    this.eventsDestroy()
    handleRemoveBodyClassName()
    removeChild(document.body, getViewRoot())
    removeChild(document.body, getRootElement())
  }
};
