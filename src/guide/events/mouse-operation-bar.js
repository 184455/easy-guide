/**
 * operationBar
 * 操作栏鼠标拖动事件
 * @author Abner <xiaocao1602@qq.com>
 * @date 2021/01/01
 */
import Constant from '@/config/constant'
import { getOperationBarEle } from '@/utils/dom'
import { assign, getWindowWidthHeight } from '@/utils/index'

const { tagX, tagY } = Constant

export function operationBarDown(_this, e) {
  const rootEle = getOperationBarEle()
  const { offsetLeft, offsetTop, clientHeight, clientWidth } = rootEle
  const deltaX = e[tagX] - offsetLeft
  const deltaY = e[tagY] - offsetTop

  _this.mouseEventTempData = {
    el: rootEle,
    mouseChildOffset: [deltaX, deltaY],
    childHW: [clientWidth, clientHeight],
    containHW: getWindowWidthHeight(true)
  }
}

export function operationBarMove(_this, e) {
  _this.dispatch('onMouseMoving', assign(_this.mouseEventTempData, {
    type: 'barMoving',
    mouseContainOffset: [e[tagX], e[tagY]]
  }))
}

export function operationBarUp(_this, e) {
  _this.mouseEventTempData = null
}
