/**
 * Mouse Dot
 * dot 拖拽
 * @author Abner <xiaocao1602@qq.com>
 * @date 2021/01/01
 */
import Constant from '@/config/constant'
import { getElement } from '@/utils/dom'
import { assign, getWindowWidthHeight, isFixed } from '@/utils/index'

const { tagX, tagY, getDataSet } = Constant

export function handleDotDown(_this, e) {
  const guideElement = _this.mouseEventTarget.parentElement
  const { id, offsetLeft, offsetTop, clientWidth, clientHeight } = guideElement
  const popElement = getElement(guideElement, '_eG_guide-content')
  const editItem = _this.getGuideItemById(id)
  const deltaX = e[tagX]
  const deltaY = e[tagY]

  _this.mouseEventTempData = {
    editItem,
    popElement,
    moveFlag: false, // 标记是否移动过
    el: guideElement,
    elementName: getDataSet(e.target),
    startPointer: [deltaX, deltaY],
    childLTWH: [offsetLeft, offsetTop, clientWidth, clientHeight],
    containHW: getWindowWidthHeight(isFixed(editItem.fixFlag))
  }
}

export function handleDotMove(_this, e) {
  _this.dispatch('onMouseMoving', assign(_this.mouseEventTempData, {
    moveFlag: true,
    type: 'dotMoving',
    dropPointer: [e[tagX], e[tagY]]
  }))
}

export function handleDotUp(_this, e) {
  if (!_this.mouseEventTempData || _this.mouseEventTempData.moveFlag !== true) { return }

  const { changeData, editItem } = _this.mouseEventTempData
  _this.dispatch('modify', assign({}, editItem, changeData))
  _this.mouseEventTempData = null
}
