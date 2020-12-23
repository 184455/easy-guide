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
import {
  editElementStyle,
  getPosition
} from '../../utils/dom'

export function handleDotDown(_this, event) {
  const elementName = event.target.dataset.elementName
  const { clientWidth, clientHeight, id } = _this.currentTarget.parentElement
  _this.onMouseDownPositionImage = {
    id,
    clientWidth,
    clientHeight,
    elementName,
    startX: event[tagX],
    startY: event[tagY],
    position: getPosition(_this.currentTarget.parentElement)
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

  _this.onMouseDownPositionImage.newPosition = Object.assign({ id }, position, canvasPosition)

  editElementStyle(currentTarget.parentElement, newPosition)
}
export function handleDotUp(_this, event) {
  const { onMouseDownPositionImage } = _this
  const { newPosition } = onMouseDownPositionImage

  _this.dispatch('modify', newPosition)
  _this.onMouseDownPositionImage = null
}
