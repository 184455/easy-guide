// 鼠标事件
import { TemplateDragArea, GuideDragItem, DotTop, DotRight, DotBottom, DotLeft } from '../../config/constant'
import { handleTemplateDown, handleTemplateMove, handleTemplateUp } from './event-mouse-template'
import { handleGuideDown, handleGuideMove, handleGuideUp } from './event-mouse-guide'
import { handleDotDown, handleDotMove, handleDotUp } from './event-mouse-dot'

/**
 * 鼠标按下事件
 * @param e
 */
export function handelMouseDown(_this, e) {
  const elementName = e.target.dataset.elementName
  const eventElementNameList = [
    TemplateDragArea, GuideDragItem,
    DotTop, DotRight, DotBottom, DotLeft
  ] // 支持事件的元素列表
  if (eventElementNameList.indexOf(elementName) < 0) return

  _this.currentTarget = e.target

  if (elementName.indexOf('e_dot-') > -1) {
    // dot 鼠标按下
    handleDotDown(_this, e)
    return
  }

  // 按下
  switch (elementName) {
    case TemplateDragArea:
      // 模板栏拖动
      handleTemplateDown(_this, e)
      break
    case GuideDragItem:
      // 指导 Item 拖拽维护
      handleGuideDown(_this, e)
      break
    default:
  }
}

/**
 * 鼠标移动事件
 * @param e
 */
export function handelMouseMove(_this, e) {
  if (!_this.currentTarget) return
  const currentTargetName = _this.currentTarget.dataset.elementName

  if (currentTargetName.indexOf('e_dot-') > -1) {
    handleDotMove(_this, e)
    return
  }

  switch (currentTargetName) {
    case TemplateDragArea:
      handleTemplateMove(_this, e)
      break
    case GuideDragItem:
      // 指导 Item 拖拽维护
      handleGuideMove(_this, e)
      break
    default:
  }
}

/**
 * 鼠标抬起事件
 * @param e
 */
export function handelMouseUp(_this, e) {
  if (!_this.currentTarget) return
  const currentTargetName = _this.currentTarget.dataset.elementName

  if (currentTargetName.indexOf('e_dot-') > -1) {
    handleDotUp(_this, e)
  }

  switch (currentTargetName) {
    case TemplateDragArea:
      handleTemplateUp(_this, e)
      break
    case GuideDragItem:
      // 指导 Item 拖拽维护
      handleGuideUp(_this, e)
      break
    default:
  }
  _this.currentTarget = null
}
