// 拖拽用户指导Item
import { tagX, tagY } from '../../config/constant'
import { getElement, setStyles } from '../../utils/dom'
import { mergeObj } from '../../utils/index'
import checkGuide from '../border-check/check-guide'

function editContentClassName (el, className) {
  el.className = `e_guide-content ${className}`
}

export function handleGuideDown(_this, event) {
  const { currentTarget, guideList } = _this
  const { offsetLeft, offsetTop, clientWidth, clientHeight, id } = currentTarget // 从父元素取距离屏幕的位置

  const guideItem = guideList.find(o => o.id === id) || {}

  const contentElement = getElement(currentTarget, 'e_guide-content')
  const { clientWidth: contentWidth, clientHeight: contentHeight } = contentElement
  _this.onMouseDownPositionImage = {
    deltaX: event[tagX] - offsetLeft,
    deltaY: event[tagY] - offsetTop,
    isActive: false, // 标记是否移动过距离
    contentElement, fixFlag: guideItem.fixFlag,
    contentWidth, contentHeight,
    clientWidth, clientHeight,
    id
  }
}
export function handleGuideMove(_this, event) {
  if (!_this.onMouseDownPositionImage) {
    return
  }

  const { onMouseDownPositionImage, currentTarget } = _this
  const {
    deltaX, deltaY,
    clientWidth: width, clientHeight: height,
    contentElement,
    fixFlag
  } = onMouseDownPositionImage // 鼠标落点和元素的边距，需要减去，保持移动前不抖动
  const left = event[tagX] - deltaX
  const top = event[tagY] - deltaY

  const { newLeft, newTop, missMouse, contentPosition } = checkGuide(
    _this, event,
    deltaX, deltaY,
    width, height,
    fixFlag
  )
  if (contentPosition) {
    editContentClassName(contentElement, contentPosition)
  }
  setStyles(currentTarget, { left: `${newLeft}px`, top: `${newTop}px` })
  mergeObj(onMouseDownPositionImage, { left, top, width, height, contentPosition, isActive: true })

  if (missMouse) {
    handleGuideUp(_this)
  }
}
export function handleGuideUp(_this) {
  if (!_this.onMouseDownPositionImage) {
    return
  }

  const { left, top, width, height, id, contentPosition, isActive } = _this.onMouseDownPositionImage
  if (!isActive) {
    return
  }

  const patchData = { left, top, width, height, id }
  if (contentPosition) {
    mergeObj(patchData, { contentPosition })
  }

  _this.dispatch('modify', patchData)
  _this.onMouseDownPositionImage = null
}
