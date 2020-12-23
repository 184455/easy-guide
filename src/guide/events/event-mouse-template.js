// 拖动模版框
import { tagX, tagY } from '../../config/constant'
import { utilsMoveDiv } from '../../utils/dom'

export function handleTemplateDown(_this, event) {
  const { offsetLeft, offsetTop } = _this.currentTarget.parentElement // 从父元素取距离屏幕的位置
  _this.onMouseDownPositionImage = {
    deltaX: event[tagX] - offsetLeft,
    deltaY: event[tagY] - offsetTop
  }
}
export function handleTemplateMove(_this, event) {
  const { deltaX, deltaY } = _this.onMouseDownPositionImage // 鼠标落点和元素的边距，需要减去，保持移动前不抖动
  utilsMoveDiv(_this.currentTarget.parentElement, event[tagX] - deltaX, event[tagY] - deltaY)
}
export function handleTemplateUp(_this, event) {
  _this.onMouseDownPositionImage = null
}