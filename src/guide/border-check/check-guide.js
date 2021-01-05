// 模板边缘检测
import { tagX, tagY } from '../../config/constant'

const ErrorSet = 12 // 边缘检测误差值
const Margin = 100 // 气泡移动与浏览器边缘的距离
const MaxBlock = 500

export default function checkGuide (_this, event, deltaX, deltaY, clientWidth, clientHeight, fixFlag) {
  let newLeft = event[tagX] - deltaX
  let newTop = event[tagY] - deltaY
  let missMouse = false
  let contentPosition = ''

  const { windowWidth, windowHeight } = _this
  const x = event[tagX]
  const y = event[tagY]
  if (y >= 0 && y <= deltaY) {
    newTop = 0
  }
  if (y >= (windowHeight + deltaY - clientHeight) && y <= windowHeight) {
    newTop = windowHeight - clientHeight
  }
  if (x >= 0 && x <= deltaX) {
    newLeft = 0
  }
  if (x >= (windowWidth + deltaX - clientWidth) && x <= windowWidth) {
    newLeft = windowWidth - clientWidth
  }

  if (
    x < ErrorSet ||
    y < ErrorSet ||
    (x + ErrorSet) >= windowWidth ||
    (y + ErrorSet) >= windowHeight
  ) {
    missMouse = true
  }

  // 判断选框的位置，决定把指导的小气泡放在那个位置
  // 因为组件定位的方式，决定高度的参考不一样
  const moveHeight = fixFlag === 'Y' ? window.innerHeight : windowHeight
  contentPosition = calcContentPosition(windowWidth, moveHeight, newLeft, newTop, clientHeight, clientWidth)

  return { newLeft, newTop, missMouse, contentPosition }
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
 * @param {*} w 屏幕宽度
 * @param {*} h 屏幕高度
 */
export function calcContentPosition (w, h, newLeft, newTop, clientHeight, clientWidth) {
  const columnWidth = parseInt(w / 4)
  const columnHeight = parseInt(h / 4)
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
        (newLeft >= x && newLeft <= X) &&
        (newTop >= y && newTop <= Y)
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
      if (clientHeight > MaxBlock && clientWidth > (w / 2)) {
        res = 6
      } else if (clientHeight > MaxBlock) {
        res = 3
      } else if (clientWidth > (w / 2)) {
        res = 5
      } else if (clientHeight > 200) {
        res = 4
      } else {
        res = 3
      }
      break
    case 2:
      if (clientWidth > MaxBlock || clientHeight > MaxBlock) {
        res = 8
      } else {
        res = 6
      }
      break
    case 3:
      if (clientHeight > MaxBlock) {
        res = 8
      } else if (clientWidth < 300) {
        res = 7
      } else {
        res = 8
      }
      break
    case 4:
      if (clientWidth > (w / 2)) {
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
      if (clientHeight > MaxBlock && clientWidth > (w / 2)) {
        res = 1
      } else if (clientWidth > (w / 2)) {
        res = 1
      } else if (newTop < Margin || newLeft < Margin) {
        res = 4
      } else {
        res = 1
      }
      break
    case 8:
      res = 1
      break
    case 9:
      if (clientHeight > 200) {
        res = 8
      } else {
        res = 7
      }
      break
    default:
      res = 1
  }

  return `_eg-guide-${res}`
}
