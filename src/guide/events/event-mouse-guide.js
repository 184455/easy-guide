// 拖拽用户指导Item
import { tagX, tagY } from '../../config/constant'
import { setStyles } from '../../utils/dom'

export function handleGuideDown(_this, event) {
  const { offsetLeft, offsetTop, clientWidth, clientHeight, id } = _this.currentTarget // 从父元素取距离屏幕的位置
  _this.onMouseDownPositionImage = {
    deltaX: event[tagX] - offsetLeft,
    deltaY: event[tagY] - offsetTop,
    isActive: false, // 标记是否移动过距离
    clientWidth, clientHeight,
    id
  }
}
export function handleGuideMove(_this, event) {
  const { onMouseDownPositionImage, currentTarget } = _this
  const { deltaX, deltaY, clientWidth: width, clientHeight: height } = onMouseDownPositionImage // 鼠标落点和元素的边距，需要减去，保持移动前不抖动
  const left = event[tagX] - deltaX
  const top = event[tagY] - deltaY

  setStyles(currentTarget, { left: `${left}px`, top: `${top}px` })
  Object.assign(onMouseDownPositionImage, { left, top, width, height, isActive: true })
}
export function handleGuideUp(_this, event) {
  const { left, top, width, height, id, isActive } = _this.onMouseDownPositionImage
  if (!isActive) {
    return
  }

  _this.dispatch('modify', { left, top, width, height, id })
  _this.onMouseDownPositionImage = null
}
