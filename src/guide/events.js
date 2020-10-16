import {
  TemplateDragArea,
  tagX, tagY, MODE,
  TemplateItemTop,
  TemplateItemRight,
  TemplateItemBottom,
  TemplateItemLeft,
  ElementDataSetName,
  GuideDragItem,
  CloseButton
} from '../config/constant'
import { utilsMoveDiv, utilsCreateElement, editElementStyle, canvasPainting } from '../utils/dom'

const defaultPosition = (windowWidth) => ({
  left: (windowWidth / 2 - 150) | 0,
  top: 200,
  width: 300,
  height: 120,
  id: String((new Date()).getTime())
})

// 创建指导的小框
const createGuideItem = (EG, elementName, { top, left, width, height, id }) => {
  const { Options } = EG
  const tempFragment = document.createDocumentFragment()
  const topStep = utilsCreateElement('div', { class: 'e_top-step-number' })
  topStep.innerHTML = 1

  const guideContent = utilsCreateElement('div', { class: 'e_guide-content' })
  editElementStyle(guideContent, { bottom: `${height + 12}px` })
  const contentText = utilsCreateElement('div', { class: 'e_guide-content-text' })
  contentText.innerHTML = 'I am content!'
  guideContent.appendChild(contentText)
  const guideContentBtn = utilsCreateElement('div', { class: 'e_guide-content-btn' })

  if (Options.mode === MODE.READ) {
    // 只读模式
    const closeBtn = utilsCreateElement('button', { class: 'e_close-btn' })
    closeBtn.innerHTML = '关闭'
    const prevBtn = utilsCreateElement('button', { class: 'e_prev-btn' })
    prevBtn.innerHTML = '上一步'
    const nextBtn = utilsCreateElement('button', { class: 'e_next-btn' })
    nextBtn.innerHTML = '下一步'

    guideContentBtn.appendChild(closeBtn)
    guideContentBtn.appendChild(prevBtn)
    guideContentBtn.appendChild(nextBtn)
  } else if (Options.mode === MODE.MAINTAIN) {
    // 维护编辑模式
    const deleteBtn = utilsCreateElement('button', { class: 'e_delete-btn' })
    deleteBtn.innerHTML = '删除'
    const editBtn = utilsCreateElement('button', { class: 'e_edit-btn' })
    editBtn.innerHTML = '编辑'

    guideContentBtn.appendChild(deleteBtn)
    guideContentBtn.appendChild(editBtn)
  }

  guideContent.appendChild(guideContentBtn)

  tempFragment.appendChild(topStep)
  tempFragment.appendChild(guideContent)
  const temp = utilsCreateElement('div', {
    id,
    class: `e_guide-item ${elementName}`,
    [ElementDataSetName]: GuideDragItem
  })
  temp.appendChild(tempFragment)

  editElementStyle(temp, { top: `${top}px`, left: `${left}px`, width: `${width}px`, height: `${height}px` })
  EG.EasyGuideDivContainer.appendChild(temp)
}

// 关闭按钮
const handleClickCloseButton = (_this, event) => {
  _this.destroy()
}

// 拖动模版框
const handleTemplateDropAreaDown = (EG, event) => {
  const { offsetLeft, offsetTop } = EG.currentTarget.parentElement // 从父元素取距离屏幕的位置
  EG.onMouseDownPositionImage = {
    deltaX: event[tagX] - offsetLeft,
    deltaY: event[tagY] - offsetTop
  }
}
const handleTemplateDropAreaMove = (EG, event) => {
  const { deltaX, deltaY } = EG.onMouseDownPositionImage // 鼠标落点和元素的边距，需要减去，保持移动前不抖动
  utilsMoveDiv(EG.currentTarget.parentElement, event[tagX] - deltaX, event[tagY] - deltaY)
}
const handleTemplateDropAreaUp = (EG, event) => {
  EG.onMouseDownPositionImage = null
}

// 拖拽用户指导Item
const handleGuideDragItemDown = (_this, event) => {
  const { offsetLeft, offsetTop, clientWidth, clientHeight, id } = _this.currentTarget // 从父元素取距离屏幕的位置
  _this.onMouseDownPositionImage = {
    deltaX: event[tagX] - offsetLeft,
    deltaY: event[tagY] - offsetTop,
    clientWidth, clientHeight,
    id
  }
}
const handleGuideDragItemMove = (_this, event) => {
  const {
    windowWidth, windowHeight,
    onMouseDownPositionImage, currentTarget,
    EasyGuideCanvasContext, guideList
  } = _this
  const { deltaX, deltaY, clientWidth: width, clientHeight: height, id } = onMouseDownPositionImage // 鼠标落点和元素的边距，需要减去，保持移动前不抖动
  const left = event[tagX] - deltaX
  const top = event[tagY] - deltaY

  const excludeItem = guideList.filter(o => o.id !== id)
  utilsMoveDiv(currentTarget, left, top)
  canvasPainting(EasyGuideCanvasContext, { left, top, width, height }, { windowWidth, windowHeight }, excludeItem)
  Object.assign(onMouseDownPositionImage, { left, top, width, height })
}
const handleGuideDragItemUp = (_this, event) => {
  const { left, top, width, height, id } = _this.onMouseDownPositionImage
  _this.dispatch('modify', { left, top, width, height, id })
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
    TemplateItemLeft, GuideDragItem, CloseButton
  ]
  if (eventElementNameList.indexOf(elementName) < 0) return

  const { windowWidth, windowHeight } = _this

  if (/^template-item-(top|right|bottom|left)$/.test(elementName)) {
    // 点击模版添加
    const position = defaultPosition(_this.windowWidth)
    createGuideItem(_this, elementName, position)
    canvasPainting(_this.EasyGuideCanvasContext, position, { windowWidth, windowHeight }, _this.guideList)
    _this.dispatch('create', position)
    return
  }

  switch (elementName) {
    case CloseButton:
      handleClickCloseButton(_this, e)
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
  const eventElementNameList = [TemplateDragArea, GuideDragItem] // 支持事件的元素列表
  if (eventElementNameList.indexOf(elementName) < 0) return

  _this.currentTarget = e.target
  const currentTargetName = elementName

  // 按下
  switch (currentTargetName) {
    case TemplateDragArea:
      // 模板栏拖动
      handleTemplateDropAreaDown(_this, e)
      break
    case GuideDragItem:
      // 指导 Item 拖拽维护
      handleGuideDragItemDown(_this, e)
      break
    // case BorderDivName:
    //   divMouseDown(e)
    //   break
    // case DivDotName:
    //   dotMouseDown(e)
    //   break
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

  switch (currentTargetName) {
    case TemplateDragArea:
      handleTemplateDropAreaMove(_this, e)
      break
    case GuideDragItem:
      // 指导 Item 拖拽维护
      handleGuideDragItemMove(_this, e)
      break
    // case BorderDivName:
    //   divMouseMove(e)
    //   break
    // case DivDotName:
    //   dotMouseMove(e)
    //   break
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

  switch (currentTargetName) {
    case TemplateDragArea:
      handleTemplateDropAreaUp(_this, e)
      break
    case GuideDragItem:
      // 指导 Item 拖拽维护
      handleGuideDragItemUp(_this, e)
      break
    // case BorderDivName:
    //   divMouseUp(e)
    //   break
    // case DivDotName:
    //   dotMouseUp(e)
    //   break
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
