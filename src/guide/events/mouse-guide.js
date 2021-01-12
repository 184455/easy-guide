/**
 * Mouse Guide
 * 指导 拖拽
 * @author Abner <xiaocao1602@qq.com>
 * @date 2021/01/01
 */

import Constant from '../../config/constant'
import { getElement, setStyles } from '../../utils/dom'
import { mergeObj, transformUtil, getWindowWidthHeight, selectPosition } from '../../utils/index'
import commonBorderCheck, { calcContentPosition } from '../border-check/check-common'

const { tagX, tagY } = Constant

export function handleGuideDown(_this, e) {
  const { mouseEventTarget, guideList } = _this
  const {
    id, offsetLeft, offsetTop,
    clientWidth: selectBoxWidth, clientHeight: selectBoxHeight
  } = mouseEventTarget
  const editItem = guideList.find(o => o.id === id)
  const fixFlag = editItem.fixFlag

  const contentElement = getElement(mouseEventTarget, 'e_guide-content')
  const { clientWidth: contentWidth, clientHeight: contentHeight } = contentElement

  _this.mouseEventTempData = {
    id,
    fixFlag,
    moveFlag: false,
    deltaX: e[tagX] - offsetLeft,
    deltaY: e[tagY] - offsetTop,
    outerContain: getWindowWidthHeight(fixFlag !== 'N'),
    contentWidth, contentHeight,
    selectBoxWidth, selectBoxHeight,
    contentElement
  }
}

export function handleGuideMove(_this, e) {
  const { mouseEventTempData, mouseEventTarget } = _this
  const {
    deltaX, deltaY,
    selectBoxWidth, selectBoxHeight,
    contentElement, outerContain
  } = mouseEventTempData

  const { newLeft, newTop } = commonBorderCheck(
    outerContain,
    [selectBoxWidth, selectBoxHeight],
    [e[tagX], e[tagY]],
    [deltaX, deltaY]
  )
  const contentPosition = calcContentPosition(outerContain, [newLeft, newTop, selectBoxWidth, selectBoxHeight])
  setStyles(mouseEventTarget, { left: `${newLeft}px`, top: `${newTop}px` })
  contentElement.className = `e_guide-content ${contentPosition}`

  mergeObj(mouseEventTempData, {
    contentPosition,
    left: newLeft,
    top: newTop,
    width: selectBoxWidth,
    height: selectBoxHeight,
    moveFlag: true
  })
}

export function handleGuideUp(_this) {
  if (!_this.mouseEventTempData || !_this.mouseEventTempData.moveFlag) {
    return
  }

  const { mouseEventTempData, guideList } = _this
  const { left, top, width, height, id, contentPosition } = mouseEventTempData
  const editItem = guideList.find(i => i.id === id) || {}
  const patchData = { left, top, width, height, id, contentPosition }
  const checkPosition = selectPosition(mergeObj({}, patchData, { fixFlag: editItem.fixFlag }))
  const patchData2 = mergeObj({}, editItem, patchData, checkPosition)

  _this.dispatch('modify', transformUtil(patchData2, _this.windowWidth))
  _this.mouseEventTempData = null
}
