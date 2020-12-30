// 拖拽 dot 调整选区宽高
import {
  tagX, tagY,
  DotTop,
  DotRight,
  DotBottom,
  DotLeft,
  MinHeight,
  MinWidth
} from '../../config/constant'
import { setStyles, getPosition } from '../../utils/dom'
import { mergeObj } from '../../utils/index'

export function handleDotDown(_this, event) {
  const elementName = event.target.dataset.eg
  const parentEle = _this.currentTarget.parentElement
  const { clientWidth, clientHeight, id } = parentEle
  _this.onMouseDownPositionImage = {
    id,
    clientWidth,
    clientHeight,
    elementName,
    startX: event[tagX],
    startY: event[tagY],
    position: getPosition(parentEle)
  }
}
export function handleDotMove(_this, event) {
  const { startX, startY, clientWidth, clientHeight, position, id, elementName } = _this.onMouseDownPositionImage
  const { currentTarget } = _this
  const { top, left } = position

  let newPosition = {}
  let canvasPosition = {}
  switch (elementName) {
    case DotTop:
      const deltaY = startY - event[tagY]
      newPosition = { height: `${clientHeight + deltaY}px`, top: `${top - deltaY}px` }
      canvasPosition = { height: clientHeight + deltaY, top: top - deltaY }
      break
    case DotRight:
      newPosition = { width: `${clientWidth + (event[tagX] - startX)}px` }
      canvasPosition = { width: clientWidth + (event[tagX] - startX) }
      break
    case DotBottom:
      newPosition = { height: `${clientHeight + (event[tagY] - startY)}px` }
      canvasPosition = { height: clientHeight + (event[tagY] - startY) }
      break
    case DotLeft:
      const deltaX = startX - event[tagX]
      newPosition = { width: `${clientWidth + deltaX}px`, left: `${left - deltaX}px` }
      canvasPosition = { width: clientWidth + deltaX, left: left - deltaX }
      break
    default:
  }

  // 设置一个选区的最小宽高
  if (canvasPosition.width < MinWidth || canvasPosition.height < MinHeight) {
    return
  }

  _this.onMouseDownPositionImage.newPosition = mergeObj({ id }, position, canvasPosition)

  setStyles(currentTarget.parentElement, newPosition)
}
export function handleDotUp(_this, event) {
  const { onMouseDownPositionImage } = _this
  const { newPosition } = onMouseDownPositionImage

  _this.dispatch('modify', newPosition)
  _this.onMouseDownPositionImage = null
}
