// 模板边缘检测
import { tagX, tagY } from '../../config/constant'

const errorSet = 12 // 边缘检测误差值

export default function checkTemplate (_this, event, deltaX, deltaY, clientWidth, clientHeight) {
  let newLeft = event[tagX] - deltaX
  let newTop = event[tagY] - deltaY
  let missMouse = false

  const { windowWidth } = _this
  const windowHeight = window.innerHeight
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

  if (x < errorSet || y < errorSet || (x + errorSet) >= windowWidth || (y + errorSet) >= windowHeight) {
    missMouse = true
  }

  return { newLeft, newTop, missMouse }
}
