/**
 * operationBar
 * 操作栏鼠标拖动事件
 * @author Abner <xiaocao1602@qq.com>
 * @date 2021/01/01
 */

import Constant from '@/config/constant'
import { setStyles, getOperationBarEle } from '@/utils/dom'
import commonBorderCheck from '../border-check/check-common'
import { getWindowWidthHeight, PX } from '@/utils/index'

const { tagX, tagY } = Constant

export function operationBarDown(_this, e) {
  const rootEle = getOperationBarEle()
  const { offsetLeft, offsetTop, clientHeight, clientWidth } = rootEle // 从父元素取距离屏幕的位置
  _this.mouseEventTempData = {
    deltaX: e[tagX] - offsetLeft,
    deltaY: e[tagY] - offsetTop,
    outerContain: getWindowWidthHeight(true),
    clientHeight,
    clientWidth,
    rootEle
  }
}
export function operationBarMove(_this, e) {
  if (!_this.mouseEventTempData) {
    return
  }

  const { deltaX, deltaY, rootEle, clientHeight, clientWidth, outerContain } = _this.mouseEventTempData // 鼠标落点和元素的边距，需要减去，保持移动前不抖动
  const { newLeft, newTop } = commonBorderCheck(
    outerContain,
    [clientWidth, clientHeight],
    [e[tagX], e[tagY]],
    [deltaX, deltaY]
  )
  setStyles(rootEle, { left: PX(newLeft), top: PX(newTop) })
}
export function operationBarUp(_this, e) {
  _this.mouseEventTempData = null
}
