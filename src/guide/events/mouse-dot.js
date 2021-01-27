/**
 * Mouse Dot
 * dot 拖拽
 * @author Abner <xiaocao1602@qq.com>
 * @date 2021/01/01
 */

import Constant from '@/config/constant'
import { setStyles, getPosition, getElement } from '@/utils/dom'
import { mergeObj, addUtil, transformUtil } from '@/utils/index'
import { calcContentPosition } from '../border-check/check-common'
import checkDot from '../border-check/check-dot'

const { tagX, tagY, getDataSet } = Constant
const MinHeight = 50
const MinWidth = 100

export function handleDotDown(_this, e) {
  const { guideList } = _this
  const elementName = getDataSet(e.target)
  const parentEle = _this.mouseEventTarget.parentElement
  const { id } = parentEle
  const editItem = guideList.find(o => o.id === id)

  _this.mouseEventTempData = {
    id,
    elementName,
    startX: e[tagX],
    startY: e[tagY],
    position: getPosition(parentEle),
    contentElement: getElement(parentEle, '_eG_guide-content'),
    fixFlag: editItem.fixFlag
  }
}
export function handleDotMove(_this, e) {
  let { mouseEventTempData, windowWidth, windowHeight } = _this
  const { elementName, position, id, contentElement, startX, startY, fixFlag } = mouseEventTempData
  const newPosition = checkDot(
    [windowWidth, windowHeight],
    [startX, startY, e[tagX], e[tagY]],
    position,
    [elementName, fixFlag]
  )

  // 设置一个选区的最小宽高
  if (newPosition.width < MinWidth || newPosition.height < MinHeight) {
    mouseEventTempData = null
    return
  }

  const nextPosition = mergeObj({ id }, position, newPosition)
  mouseEventTempData.newPosition = nextPosition
  const { left, top, width, height } = nextPosition
  const contentPosition = calcContentPosition([windowWidth, windowHeight], [left, top, width, height])
  contentElement.className = `_eG_guide-content ${contentPosition}`
  setStyles(_this.mouseEventTarget.parentElement, addUtil(newPosition, 'px'))
}

export function handleDotUp(_this, e) {
  const { mouseEventTempData = {} } = _this
  const { newPosition } = mouseEventTempData
  if (!(newPosition && newPosition.id)) {
    return
  }

  const editItem = _this.guideList.find(i => i.id === newPosition.id) || {}
  _this.dispatch('modify', transformUtil(mergeObj(editItem, newPosition), _this.windowWidth))
  _this.mouseEventTempData = null
}
