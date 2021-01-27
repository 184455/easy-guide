/**
 * Mouse
 * 处理鼠标移动事件
 * @author Abner <xiaocao1602@qq.com>
 * @date 2021/01/01
 */

import { isDot } from '@/utils/index'
import { getMaintainRoot } from '@/utils/dom'
import Constant from '@/config/constant'
import { operationBarDown, operationBarMove, operationBarUp } from './mouse-operation-bar'
import { handleGuideDown, handleGuideMove, handleGuideUp } from './mouse-guide'
import { handleDotDown, handleDotMove, handleDotUp } from './mouse-dot'
const { OperationBarDrag, DragGuide, DotTop, DotRight, DotBottom, DotLeft, getDataSet } = Constant

/**
 * 鼠标按下事件
 * @param e
 */
export function handelMouseDown(_this, e) {
  const targetName = getDataSet(e.target)
  const targetList = [OperationBarDrag, DragGuide, DotTop, DotRight, DotBottom, DotLeft]
  if (targetList.indexOf(targetName) < 0) { return }
  _this.mouseEventTarget = e.target

  // 防止鼠标拖拽鼠标跑出浏览器，造成事件丢失的问题
  getMaintainRoot().setPointerCapture(e.pointerId)

  // 按下
  switch (targetName) {
    case OperationBarDrag:
      operationBarDown(_this, e)
      break
    case DragGuide:
      handleGuideDown(_this, e)
      break
    default:
      if (isDot(targetName)) { handleDotDown(_this, e) }
  }
}

/**
 * 鼠标移动事件
 * @param e
 */
export function handelMouseMove(_this, e) {
  if (!_this.mouseEventTarget) return
  const targetName = getDataSet(_this.mouseEventTarget)

  switch (targetName) {
    case OperationBarDrag:
      operationBarMove(_this, e)
      break
    case DragGuide:
      handleGuideMove(_this, e)
      break
    default:
      if (isDot(targetName)) { handleDotMove(_this, e) }
  }
}

/**
 * 鼠标抬起事件
 * @param e
 */
export function handelMouseUp(_this, e) {
  if (!_this.mouseEventTarget) return
  const targetName = getDataSet(_this.mouseEventTarget)

  // 解除鼠标锁定
  getMaintainRoot().releasePointerCapture(e.pointerId)

  switch (targetName) {
    case OperationBarDrag:
      operationBarUp(_this, e)
      break
    case DragGuide:
      handleGuideUp(_this, e)
      break
    default:
      if (isDot(targetName)) { handleDotUp(_this, e) }
  }

  _this.mouseEventTarget = null
}
