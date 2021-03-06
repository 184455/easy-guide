/**
 * InitMixin
 * 初始化模块
 * @author Abner <xiaocao1602@qq.com>
 * @date 2021/01/01
 */
import { getMaintainRoot, removeChild, getViewRoot } from '@/utils/dom'
import {
  initMode,
  showFlag,
  initViewport,
  initDefaultData,
  mergeCustomOptions,
  handleBodyClassName,
  removeBodyClassName
} from './core-utils'

export default function InitMixin (EG) {
  EG.prototype.init = function (options) {
    mergeCustomOptions(this, options)
    initDefaultData(this)
  }

  EG.prototype.show = function (m) {
    if (!showFlag(this, m)) { return }

    handleBodyClassName()
    initViewport(this)
    initMode(this, m)
    this.initEvents()
  }

  EG.prototype.destroy = function () {
    this.status = 'none'
    removeBodyClassName()
    this.eventsDestroy()
    removeChild(document.body, getViewRoot())
    removeChild(document.body, getMaintainRoot())
  }

  EG.prototype.getConfig = function () {
    return this.Options
  }

  EG.prototype.setGuideList = function (list) {
    this.guideList = list
  }

  EG.prototype.setGuideItem = function (guideItem) {
    this.guideList = this.guideList.map(o => {
      return String(o.id) === String(guideItem.id) ? guideItem : o
    })
  }

  EG.prototype.getGuideList = function () {
    return this.guideList || []
  }

  EG.prototype.getGuideItemById = function (id) {
    return (this.guideList || []).find(o => String(o.id) === String(id)) || {}
  }

  EG.prototype.broadcast = function (action, data) {
    const { onGuideListChange = () => {} } = this.Options
    onGuideListChange(action, data, this.getGuideList())
  }
};
