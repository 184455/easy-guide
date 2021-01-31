import Constant from '@/config/constant'

const { DotTop, DotRight, DotBottom, DotLeft } = Constant

/**
 * 边缘检测函数
 * @param {array} containHW 外部容器宽高
 * @param {array} childHW 内部容器宽高
 * @param {array} mouseContainOffset 鼠标在外部容器的坐标
 * @param {array} mouseChildOffset 鼠标在内部容器的坐标
 * @returns {object} 新 距离 (0, 0) 的位置信息
 */
export function borderCheck ({ containHW, childHW, mouseContainOffset, mouseChildOffset }) {
  const errorOffset = 2 // 误差允许范围
  const [containWidth, containHeight] = containHW
  const [childWidth, childHeight] = childHW
  const [containX, containY] = mouseContainOffset
  const [childX, childY] = mouseChildOffset
  let newLeft = containX - childX
  let newTop = containY - childY

  if ((containX - errorOffset) <= childX) {
    newLeft = 0
  }
  if ((containY - errorOffset) <= childY) {
    newTop = 0
  }
  if ((containWidth - containX) <= (childWidth - childX + errorOffset)) {
    newLeft = containWidth - childWidth
  }
  if ((containHeight - containY) <= (childHeight - childY + errorOffset)) {
    newTop = containHeight - childHeight
  }

  return { newLeft, newTop }
}

/**
 * 把屏幕按照一定的比例，分成9块，分别应用不同的计算方式。它们的大小比例：
 * 1/16 2/16 1/16
 * 2/16 4/16 2/16
 * 1/16 2/16 1/16
 *
 * 顺序图
 *    1    2
 *  8 +----+ 3
 *    |    |
 *  7 +----+ 4
 *    6    5
 *
 * 1 2 3
 * 4 5 6
 * 7 8 9
 *
 * @param {array} containBorder 屏幕宽高
 * @param {array} childReact 元素的：左上宽高
 */
export function calcContentPosition (containBorder, childReact) {
  const [containWidth, containHeight] = containBorder
  const [childLeft, childTop, childWidth, childHeight] = childReact

  const Margin = 100 // 气泡移动与浏览器边缘的距离
  const MaxBlock = 500
  const columnWidth = parseInt(containWidth / 4)
  const columnHeight = parseInt(containHeight / 4)
  const axisX = []
  const axisY = [];

  ([0, 1, 3, 4]).forEach(i => {
    axisX.push(i * columnWidth)
    axisY.push(i * columnHeight)
  })

  let pos = ''
  for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
      const X = axisX[j]
      const x = axisX[j - 1]
      const Y = axisY[i]
      const y = axisY[i - 1]
      if (
        (childLeft >= x && childLeft <= X) &&
        (childTop >= y && childTop <= Y)
      ) {
        pos = (i - 1) * 3 + j
        break
      }
    }
    if (pos) { break }
  }

  let res
  switch (pos) {
    case 1:
      if (childHeight > MaxBlock && childWidth > (containWidth / 2)) {
        res = 6
      } else if (childHeight > MaxBlock) {
        res = 3
      } else if (childWidth > (containWidth / 2)) {
        res = 5
      } else if (childHeight > 200) {
        res = 4
      } else {
        res = 3
      }
      break
    case 2:
      if (childWidth > MaxBlock || childHeight > MaxBlock) {
        res = 8
      } else {
        res = 6
      }
      break
    case 3:
      if (childHeight > MaxBlock) {
        res = 8
      } else if (childWidth < 300) {
        res = 7
      } else {
        res = 8
      }
      break
    case 4:
      if (childWidth > (containWidth / 2)) {
        res = 5
      } else {
        res = 3
      }
      break
    case 5:
      res = 1
      break
    case 6:
      res = 8
      break
    case 7:
      if (childHeight > MaxBlock && childWidth > (containWidth / 2)) {
        res = 1
      } else if (childWidth > (containWidth / 2)) {
        res = 1
      } else if (childTop < Margin || childLeft < Margin) {
        res = 4
      } else {
        res = 1
      }
      break
    case 8:
      res = 1
      break
    case 9:
      if (childHeight > 200) {
        res = 8
      } else {
        res = 7
      }
      break
    default:
      res = 1
  }

  return `_eG_guide-${res}`
}

/**
 * dot 边缘检测
 * @param {array} containHW 外部容器宽高
 * @param {array} childHW 内部容器宽高
 * @param {array} startPointer 鼠标落点坐标
 * @param {array} dropPointer 鼠标移动点坐标
 * @param {string} elementName dot 元素名称
 * @returns {object} 新 距离 (0, 0) 的位置信息
 */
export function checkDot ({ containHW, childLTWH, startPointer, dropPointer, elementName }) {
  const errorSet = 2 // 边缘检测误差值
  const [containWidth, containHeight] = containHW
  const [left, top, width, height] = childLTWH
  const [startX, startY] = startPointer
  const [endX, endY] = dropPointer

  let newLeft, newTop, newHeight, newWidth

  switch (elementName) {
    case DotTop:
      newTop = top - (startY - endY)
      newHeight = height + (startY - endY)
      if (endY < errorSet) {
        newTop = 0
        newHeight = top + height
      }
      return { left, top: newTop, width, height: newHeight }
    case DotRight:
      newWidth = width + (endX - startX)
      if (endX > (containWidth - errorSet)) {
        newWidth = containWidth - left
      }
      return { left, top, width: newWidth, height }
    case DotBottom:
      newHeight = height + (endY - startY)
      if (endY > (containHeight - errorSet)) {
        newHeight = containHeight - top
      }
      return { left, top, width, height: newHeight }
    case DotLeft:
      newLeft = left - (startX - endX)
      newWidth = width + (startX - endX)
      if (endX < errorSet) {
        newLeft = 0
        newWidth = left + width
      }
      return { left: newLeft, top, width: newWidth, height }
    default:
      return { left, top, width, height }
  }
}

/**
 * // TODO 这个边缘检测的算法未完成
 * 根据剩余宽度计算指导位置
 * @param {array} containBorder 外部容器宽高
 * @param {array} childBorder 内部容器左上宽高
 * @param {array} guideReact 指导框的宽高
 * @returns {object} 指导框位置信息
 */
export function getContentPosition (containBorder, childReact, guideReact) {
  const [containWidth, containHeight] = containBorder
  const [childLeft, childTop, childWidth, childHeight] = childReact
  const [guideWidth, guideHeight] = guideReact

  console.log(guideWidth)

  const top = childTop
  const right = containWidth - childLeft - childWidth
  const bottom = containHeight - childTop - childHeight
  const left = childLeft

  // 建立边的映射关系
  const mapping = [top, right, bottom, left]
  const maxBorder = Math.max(top, right, bottom, left)
  const index = mapping.indexOf(maxBorder)
  const res = val => '_eG_guide-' + val

  switch (index) {
    case 0: // top
      return res(left <= right ? 1 : 2)
    case 1: // right
      return res(childHeight <= guideHeight ? 4 : 3)
    case 2: // bottom
      return res(left <= right ? 6 : 5)
    case 3: // left
      return res(childHeight <= guideHeight ? 7 : 8)
    default:
  }
}
