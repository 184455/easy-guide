import {
  TemplateDragArea,
  tagX, tagY,
  TemplateItemTop,
  TemplateItemRight,
  TemplateItemBottom,
  TemplateItemLeft,
  GuideDragItem,
  CloseButton,
  DotTop,
  DotRight,
  DotBottom,
  DotLeft,
  MinHeight,
  MinWidth,
  DeleteBtn,
  EditBtn
} from '../config/constant'
import { createGuideItemData, defaultPosition, getMaxNumber } from '../utils/index'
import {
  utilsMoveDiv,
  editElementStyle,
  getPosition, createGuideItem
} from '../utils/dom'

// 关闭按钮
const handleClickCloseButton = (_this, event) => {
  _this.destroy()
}

// 维护模式下，删除某个用户指导
const handleDeleteItem = (_this, event) => {
  const { guideList } = _this
  const deleteId = event.target.parentElement.parentElement.parentElement.id
  _this.dispatch('delete', guideList.find(i => String(i.id) === String(deleteId)) || {})
}

// 维护模式下，编辑某个用户指导
const handleEditItem = (_this, event) => {
  const editId = event.target.parentElement.parentElement.parentElement.id
  _this.showEditModal(_this.guideList.find(o => String(o.id) === String(editId)))
}

// 拖动模版框
const handleTemplateDropAreaDown = (_this, event) => {
  const { offsetLeft, offsetTop } = _this.currentTarget.parentElement // 从父元素取距离屏幕的位置
  _this.onMouseDownPositionImage = {
    deltaX: event[tagX] - offsetLeft,
    deltaY: event[tagY] - offsetTop
  }
}
const handleTemplateDropAreaMove = (_this, event) => {
  const { deltaX, deltaY } = _this.onMouseDownPositionImage // 鼠标落点和元素的边距，需要减去，保持移动前不抖动
  utilsMoveDiv(_this.currentTarget.parentElement, event[tagX] - deltaX, event[tagY] - deltaY)
}
const handleTemplateDropAreaUp = (_this, event) => {
  _this.onMouseDownPositionImage = null
}

// 拖拽用户指导Item
const handleGuideDragItemDown = (_this, event) => {
  const { offsetLeft, offsetTop, clientWidth, clientHeight, id } = _this.currentTarget // 从父元素取距离屏幕的位置
  _this.onMouseDownPositionImage = {
    deltaX: event[tagX] - offsetLeft,
    deltaY: event[tagY] - offsetTop,
    isActive: false, // 标记是否移动过距离
    clientWidth, clientHeight,
    id
  }
}
const handleGuideDragItemMove = (_this, event) => {
  const {
    onMouseDownPositionImage, currentTarget
  } = _this
  const { deltaX, deltaY, clientWidth: width, clientHeight: height } = onMouseDownPositionImage // 鼠标落点和元素的边距，需要减去，保持移动前不抖动
  const left = event[tagX] - deltaX
  const top = event[tagY] - deltaY

  utilsMoveDiv(currentTarget, left, top)
  Object.assign(onMouseDownPositionImage, { left, top, width, height, isActive: true })
}
const handleGuideDragItemUp = (_this, event) => {
  const { left, top, width, height, id, isActive } = _this.onMouseDownPositionImage
  if (!isActive) {
    return
  }

  _this.dispatch('modify', { left, top, width, height, id })
  _this.onMouseDownPositionImage = null
}

// 拖拽 dot 调整选区宽高
const handleDotDown = (_this, event) => {
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
const handleDotMove = (_this, event) => {
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
const handleDotUp = (_this, event) => {
  const { onMouseDownPositionImage } = _this
  const { newPosition } = onMouseDownPositionImage

  _this.dispatch('modify', newPosition)
  _this.onMouseDownPositionImage = null
}

// ======================= 事件分发 ===============================================================
/**
 * 点击事件
 * @param e
 */
const handelWrapperClick = (_this, e) => {
  const elementName = e.target.dataset.elementName
  // 支持事件的元素列表
  const eventElementNameList = [
    TemplateItemTop, TemplateItemRight, TemplateItemBottom,
    TemplateItemLeft, CloseButton, DeleteBtn, EditBtn
  ]
  if (eventElementNameList.indexOf(elementName) === -1) return

  if (elementName.indexOf('template-item-') > -1) {
    // 点击模版添加，创建元素
    const positionInfo = defaultPosition(_this.windowWidth)
    const itemProps = createGuideItemData(Object.assign(positionInfo, {
      orderNumber: getMaxNumber(_this.guideList, 'orderNumber') + 1,
      templatePosition: elementName
    }))

    createGuideItem(_this, elementName, itemProps)
    _this.dispatch('create', itemProps)
    return
  }

  switch (elementName) {
    case CloseButton:
      handleClickCloseButton(_this, e)
      break
    case DeleteBtn:
      handleDeleteItem(_this, e)
      break
    case EditBtn:
      handleEditItem(_this, e)
      break
    default:
  }
}

/**
 * 鼠标按下事件
 * @param e
 */
const handelWrapperDown = (_this, e) => {
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
      handleTemplateDropAreaDown(_this, e)
      break
    case GuideDragItem:
      // 指导 Item 拖拽维护
      handleGuideDragItemDown(_this, e)
      break
    default:
  }
}
/**
 * 鼠标移动事件
 * @param e
 */
const handelWrapperMove = (_this, e) => {
  if (!_this.currentTarget) return
  const currentTargetName = _this.currentTarget.dataset.elementName

  if (currentTargetName.indexOf('e_dot-') > -1) {
    handleDotMove(_this, e)
    return
  }

  switch (currentTargetName) {
    case TemplateDragArea:
      handleTemplateDropAreaMove(_this, e)
      break
    case GuideDragItem:
      // 指导 Item 拖拽维护
      handleGuideDragItemMove(_this, e)
      break
    default:
  }
}
/**
 * 鼠标抬起事件
 * @param e
 */
const handelWrapperUp = (_this, e) => {
  if (!_this.currentTarget) return
  const currentTargetName = _this.currentTarget.dataset.elementName

  if (currentTargetName.indexOf('e_dot-') > -1) {
    handleDotUp(_this, e)
  }

  switch (currentTargetName) {
    case TemplateDragArea:
      handleTemplateDropAreaUp(_this, e)
      break
    case GuideDragItem:
      // 指导 Item 拖拽维护
      handleGuideDragItemUp(_this, e)
      break
    default:
  }
  _this.currentTarget = null
}

export default function initEvents (EasyGuide) {
  // 初始化 所有关于事件的东西
  EasyGuide.prototype.initEvents = function () {
    // 在根节点代理所有的事件

    // 点击事件
    const _handelWrapperClick = e => {
      handelWrapperClick(this, e)
    }
    // 按下事件
    const _handelWrapperDown = e => {
      handelWrapperDown(this, e)
    }
    // 按下移动事件
    const _handelWrapperMove = e => {
      handelWrapperMove(this, e)
    }
    // 起来事件
    const _handelWrapperUp = e => {
      handelWrapperUp(this, e)
    }

    const listenerTarget = this.EasyGuideWrap
    listenerTarget.onclick = _handelWrapperClick
    listenerTarget.onmousedown = _handelWrapperDown
    listenerTarget.onmousemove = _handelWrapperMove
    listenerTarget.onmouseup = _handelWrapperUp
  }

  // 解绑所有事件
  EasyGuide.prototype.eventsDestroy = function () {
    const listenerTarget = this.EasyGuideWrap
    listenerTarget.onclick = null
    listenerTarget.onmousedown = null
    listenerTarget.onmousemove = null
    listenerTarget.onmouseup = null
  }
}
