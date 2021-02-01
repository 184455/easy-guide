/**
 * Mouse Guide
 * 指导 拖拽
 * @author Abner <xiaocao1602@qq.com>
 * @date 2021/01/01
 */
import Constant from '@/config/constant'
import { getElement } from '@/utils/dom'
import { assign, getWindowWidthHeight, isFixed } from '@/utils/index'

const { tagX, tagY } = Constant

export function handleGuideDown(_this, e) {
  const { mouseEventTarget } = _this
  const { id, offsetLeft, offsetTop, clientWidth, clientHeight } = mouseEventTarget
  const editItem = _this.getGuideItemById(id)
  const popElement = getElement(mouseEventTarget, '_eG_guide-content')
  const deltaX = e[tagX] - offsetLeft
  const deltaY = e[tagY] - offsetTop

  _this.mouseEventTempData = {
    editItem,
    popElement,
    moveFlag: false, // 标记是否移动过
    el: mouseEventTarget,
    mouseChildOffset: [deltaX, deltaY],
    popContentHW: [popElement.clientWidth, popElement.clientHeight],
    childHW: [clientWidth, clientHeight],
    containHW: getWindowWidthHeight(isFixed(editItem.fixFlag))
  }
}

export function handleGuideMove(_this, e) {
  _this.dispatch('onMouseMoving', assign(_this.mouseEventTempData, {
    moveFlag: true,
    type: 'guideMoving',
    mouseContainOffset: [e[tagX], e[tagY]]
  }))
}

export function handleGuideUp(_this) {
  if (!_this.mouseEventTempData || _this.mouseEventTempData.moveFlag !== true) { return }

  const { changeData, editItem } = _this.mouseEventTempData
  _this.dispatch('modify', assign({}, editItem, changeData))
  _this.mouseEventTempData = null
}
