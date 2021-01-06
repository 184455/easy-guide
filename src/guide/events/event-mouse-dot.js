// 拖拽 dot 调整选区宽高
import { tagX, tagY, MinHeight, MinWidth } from '../../config/constant'
import { setStyles, getPosition, getElement } from '../../utils/dom'
import { mergeObj, addUtil, transformUtil } from '../../utils/index'
import checkDot from '../border-check/check-dot'
import { calcContentPosition } from '../border-check/check-guide'

function editContentClassName (el, className) {
  el.className = `e_guide-content ${className}`
}

export function handleDotDown(_this, event) {
  const elementName = event.target.dataset.eg
  const parentEle = _this.currentTarget.parentElement
  const { clientWidth, clientHeight, id } = parentEle
  _this.onMouseDownPositionImage = {
    id,
    clientWidth,
    clientHeight,
    elementName,
    contentElement: getElement(parentEle, 'e_guide-content'),
    fixFlag: parentEle.style.position === 'fixed' ? 'Y' : 'N',
    startX: event[tagX],
    startY: event[tagY],
    position: getPosition(parentEle)
  }
}
export function handleDotMove(_this, event) {
  let { onMouseDownPositionImage, windowWidth, windowHeight } = _this
  if (!onMouseDownPositionImage) {
    return
  }

  const { elementName, position, id, contentElement } = onMouseDownPositionImage
  const { newPosition, missMouse } = checkDot(_this, elementName, event)

  // 设置一个选区的最小宽高
  if (newPosition.width < MinWidth || newPosition.height < MinHeight) {
    onMouseDownPositionImage = null
    return
  }

  const nextPosition = mergeObj({ id }, position, newPosition)
  onMouseDownPositionImage.newPosition = nextPosition
  const { left, top, width, height } = nextPosition
  const contentPosition = calcContentPosition(windowWidth, windowHeight, left, top, height, width)
  if (contentPosition) {
    editContentClassName(contentElement, contentPosition)
  }
  setStyles(_this.currentTarget.parentElement, addUtil(newPosition, 'px'))

  if (missMouse) {
    handleDotUp(_this)
    return
  }
}
export function handleDotUp(_this, event) {
  const { onMouseDownPositionImage = {} } = _this
  const { newPosition } = onMouseDownPositionImage
  if (!(newPosition && newPosition.id)) {
    return
  }

  const editItem = _this.guideList.find(i => i.id === newPosition.id) || {}
  _this.dispatch('modify', transformUtil(mergeObj(editItem, newPosition), _this.windowWidth))
  _this.onMouseDownPositionImage = null
}
