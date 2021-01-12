/**
 * checkDot
 * Dot 边缘检查
 * @author Abner <xiaocao1602@qq.com>
 * @date 2021/01/01
 */

import Constant from '../../config/constant'

const { DotTop, DotRight, DotBottom, DotLeft } = Constant

export default function checkDot (
  [windowWidth, windowHeight],
  [startX, startY, newX, newY],
  position,
  [elementName, fixFlag]
) {
  const errorSet = 2 // 边缘检测误差值
  const { left, top, width, height } = position
  let newPosition = {}
  let newLeft, newTop, newHeight, newWidth

  switch (elementName) {
    case DotTop:
      newTop = top - (startY - newY)
      newHeight = height + (startY - newY)
      if (newY < errorSet) {
        newTop = 0
        newHeight = top + height
      }
      return { left, top: newTop, width, height: newHeight }
    case DotRight:
      newWidth = width + (newX - startX)
      if (newX > (windowWidth - errorSet)) {
        newWidth = windowWidth - left
      }
      return { left, top, width: newWidth, height }
    case DotBottom:
      const containHeight = fixFlag === 'Y' ? window.innerHeight : windowHeight
      newHeight = height + (newY - startY)
      if (newY > (containHeight - errorSet)) {
        newHeight = containHeight - top
      }
      return { left, top, width, height: newHeight }
    case DotLeft:
      newLeft = left - (startX - newX)
      newWidth = width + (startX - newX)
      if (newX < errorSet) {
        newLeft = 0
        newWidth = left + width
      }
      return { left: newLeft, top, width: newWidth, height }
    default:
  }

  return newPosition
}
