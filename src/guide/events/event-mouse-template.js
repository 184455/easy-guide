// 拖动模版框
import { tagX, tagY } from '../../config/constant'
import { setStyles } from '../../utils/dom'
import checkTemplate from '../border-check/check-template'

export function handleTemplateDown(_this, event) {
  const rootEle = document.getElementById('_eG_template')
  const { offsetLeft, offsetTop, clientHeight, clientWidth } = rootEle // 从父元素取距离屏幕的位置
  _this.onMouseDownPositionImage = {
    deltaX: event[tagX] - offsetLeft,
    deltaY: event[tagY] - offsetTop,
    clientHeight,
    clientWidth,
    rootEle
  }
}
export function handleTemplateMove(_this, event) {
  if (!_this.onMouseDownPositionImage) {
    return
  }

  const { deltaX, deltaY, rootEle, clientHeight, clientWidth } = _this.onMouseDownPositionImage // 鼠标落点和元素的边距，需要减去，保持移动前不抖动
  const { newLeft, newTop, missMouse } = checkTemplate(_this, event, deltaX, deltaY, clientWidth, clientHeight)
  setStyles(rootEle, { left: `${newLeft}px`, top: `${newTop}px` })
  if (missMouse) {
    _this.onMouseDownPositionImage = null
  }
}
export function handleTemplateUp(_this, event) {
  _this.onMouseDownPositionImage = null
}
