// 模板边缘检测
import {
  tagX, tagY,
  DotTop,
  DotRight,
  DotBottom,
  DotLeft
} from '../../config/constant'

const errorSet = 4 // 边缘检测误差值

export default function checkDot (_this, elementName, event) {
  const newX = event[tagX]
  const newY = event[tagY]
  const {
    startX, startY,
    clientWidth, clientHeight,
    position, fixFlag
  } = _this.onMouseDownPositionImage
  const { top, left } = position

  let missMouse = false
  let newPosition = {}
  let newHeight, newWidth
  switch (elementName) {
    case DotTop:
      let deltaY = startY - newY
      let newTop = top - deltaY
      newHeight = clientHeight + deltaY
      if (newY < errorSet) {
        newTop = 0
        newHeight = top + clientHeight
        missMouse = true
      }
      newPosition = { height: newHeight, top: newTop }
      break
    case DotRight:
      newWidth = clientWidth + (newX - startX)
      if (newX > (_this.windowWidth - errorSet)) {
        newWidth = _this.windowWidth - left
        missMouse = true
      }
      newPosition = { width: newWidth }
      break
    case DotBottom:
      const containHeight = fixFlag === 'Y' ? window.innerHeight : _this.windowHeight
      newHeight = clientHeight + (newY - startY)
      if (newY > (containHeight - errorSet)) {
        newHeight = containHeight - top
        missMouse = true
      }
      newPosition = { height: newHeight }
      break
    case DotLeft:
      const deltaX = startX - newX
      let newLeft = left - deltaX
      newWidth = clientWidth + deltaX
      if (newX < errorSet) {
        newLeft = 0
        newWidth = left + clientWidth
        missMouse = true
      }
      newPosition = { width: newWidth, left: newLeft }
      break
    default:
  }

  return { newPosition, missMouse }
}
