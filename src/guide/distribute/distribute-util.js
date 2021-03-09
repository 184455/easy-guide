/**
 * 分发器处理方法：工具方法
 * @author Abner <xiaocao1602@qq.com>
 * @date 2021/01/01
 */
import Constant from '@/config/constant'
import { calcContentPosition, borderCheck, checkDot } from '@/guide/check'
import { getGuideItemDomText, getGuideViewDomText, exitPreview } from '@/config/dom-text'
import { getElementById, removeChild, getMaintainRoot, getElement, getViewRoot, createViewRoot, setStyles } from '@/utils/dom'
import {
  assign, isEmptyArray, createGuideItemData, getMaxNumber, scrollIntoToView, selectCorner,
  isFunction, px, transformUtilToSave, addUtils, transformUtilToPixel, isNotEmptyArray, isFixedPosition, isFixed, getWindowWidthHeight
} from '@/utils'

const { minHeight, minWidth } = Constant

export function distribute(_this, action, data) {
    switch (action) {
      case 'onMouseMoving':
        handleMouseMoving(_this, data)
        break
      case 'modify':
        handleModify(_this, data)
        break
      case 'initRender':
        handleInitRender(_this)
        break
      case 'create':
        handleCreate(_this)
        break
      case 'delete':
        handleDelete(_this, action, data)
        break
      case 'initViewRender':
        handleInitViewRender(_this)
        break
      case 'showStep':
        handleShowStep(_this, data)
        break
      case 'prevBtnName':
        handleClickPrevBtn(_this)
        break
      case 'nextBtnName':
        handleClickNextBtn(_this)
        break
      case 'exitPreview':
        handleClickCloseBtn(_this)
        break
      case 'viewCloseBtn':
        handleClickCloseBtn(_this)
        break
      case 'guide-close-btn':
        handleClickCloseButton(_this, data)
        break
      case 'deleteButton':
        handleDeleteItem(_this, data)
        break
      case 'editBtn':
        handleEditItem(_this, data)
        break
      case 'preview-btn':
        handlePreview(_this, data)
        break
      default:
    }
}

function handleInitRender (_this) {
  const domText =
    transformData(_this)
    .map(o => selectCorner(o))
    .map(o => getGuideItemDomText(o, _this.mode))
    .join('')
  getMaintainRoot().insertAdjacentHTML('beforeend', domText)
}

const handleCreate = async (_this) => {
  const guideList = _this.getGuideList()
  const { windowWidth, Options } = _this
  const { beforeCreate } = Options
  const beforeGuideItem = createGuideItemData({
    orderNumber: getMaxNumber(guideList, 'orderNumber') + 1,
    left: (windowWidth / 2 - 150) | 0,
    top: window.pageYOffset + 200
  })

  let guideItem = null
  if (isFunction(beforeCreate)) {
    guideItem = await beforeCreate(_this, beforeGuideItem)
  } else {
    guideItem = beforeGuideItem
  }

  _this.setGuideList(guideList.concat(guideItem))
  _this.broadcast('create', guideItem)

  // Render to Dom
  const pixelGuideItem = transformUtilToPixel(guideItem, windowWidth)
  const domText = getGuideItemDomText(pixelGuideItem, 'MAINTAIN')
  getMaintainRoot().insertAdjacentHTML('beforeend', domText)
}

function handleDelete (_this, action, guideItem) {
  _this.setGuideList(_this.getGuideList().filter(i => String(i.id) !== String(guideItem.id)))

  const deleteElement = getElementById(guideItem.id)
  removeChild(deleteElement.parentElement, deleteElement)
  _this.broadcast(action, guideItem)
}

function handleInitViewRender (_this) {
  const guideList = _this.getGuideList()
  const { mode, previewBack } = _this
  const guideItem = assign({}, guideList[0], {
    finalFlag: guideList.length === 1,
    firstFlag: true
  })

  const rootEle = createViewRoot()
  rootEle.innerHTML = exitPreview(previewBack === 'maintain') + getGuideViewDomText(guideItem, mode)
  updateGuideItemPosition(_this, guideItem, rootEle)
  insertViewRoot(rootEle)
  scrollIntoToView(getElement(rootEle, '_eG_guide-content'))
}

function handleMouseMoving (_this, data) {
  const { type, el } = data

  if (type === 'barMoving') {
    const { newLeft, newTop } = borderCheck(data)
    setStyles(el, { left: px(newLeft), top: px(newTop) })
  } else if (type === 'guideMoving') {
    const { newLeft, newTop } = borderCheck(data)
    setStyles(el, { left: px(newLeft), top: px(newTop) })

    const { containHW, childHW, popElement, popContentHW } = data
    const [childWidth, childHeight] = childHW
    const contentPosition = calcContentPosition(
      containHW,
      [newLeft, newTop, childWidth, childHeight],
      popContentHW
    )
    popElement.className = `_eG_guide-content ${contentPosition}`

    _this.mouseEventTempData.changeData = {
      contentPosition,
      left: newLeft,
      top: newTop,
      width: childWidth,
      height: childHeight
    }
  } else if (type === 'dotMoving') {
    const { popElement, editItem, containHW, popContentHW } = _this.mouseEventTempData
    const newPosition = checkDot(_this.mouseEventTempData)

    // 设置一个选区的最小宽高
    if (newPosition.width < minWidth || newPosition.height < minHeight) { return }

    setStyles(el, addUtils(newPosition, ['left', 'top', 'width', 'height'], 'px'))
    const newGuideData = assign({}, editItem, newPosition)
    const { left, top, width, height } = newGuideData

    const contentPosition = calcContentPosition(containHW, [left, top, width, height], popContentHW)
    popElement.className = `_eG_guide-content ${contentPosition}`

    _this.mouseEventTempData.changeData = { contentPosition, left, top, width, height }
  }
}

function handleModify (_this, newGuideItem) {
  let pipeline = null
  pipeline = selectCorner(newGuideItem)
  pipeline = transformUtilToSave(pipeline, _this.windowWidth)

  _this.setGuideItem(pipeline)
  _this.broadcast('modify', pipeline)
}

const handleClickPrevBtn = async (_this, e) => {
  const guideList = _this.getGuideList()
  if (!isNotEmptyArray(guideList)) { return }

  const { currentIndex: oldIndex } = _this
  const newIndex = oldIndex - 1

  const { beforePrev, afterPrev } = _this.Options
  if (isFunction(beforePrev)) {
    await beforePrev(oldIndex, newIndex, guideList)
  }

  handleShowStep(_this, newIndex)
  
  if (isFunction(afterPrev)) {
    await afterPrev(oldIndex, newIndex, guideList)
  }
}

const handleClickNextBtn = async (_this, e) => {
  const guideList = _this.getGuideList()
  if (!isNotEmptyArray(guideList)) { return }

  const { currentIndex: oldIndex } = _this
  const newIndex = oldIndex + 1

  const { beforeNext, afterNext } = _this.Options
  if (isFunction(beforeNext)) {
    await beforeNext(oldIndex, newIndex, guideList)
  }

  handleShowStep(_this, newIndex)

  if (isFunction(afterNext)) {
    await afterNext(oldIndex, newIndex, guideList)
  }
}

function handleShowStep (_this, index) {
  const guideList = _this.getGuideList()
  if (!guideList[index]) {
    handleClickCloseBtn(_this)
    return
  }

  const guideItem = assign({}, guideList[index], {
    finalFlag: (index + 1) === guideList.length,
    firstFlag: index === 0
  })

  _this.currentIndex = index
  updateGuideItemPosition(_this, guideItem, getViewRoot())
  setTimeout(() => {
    scrollIntoToView(getElement(getViewRoot(), '_eG_guide-content'))
  }, 320)
}

function handleClickCloseBtn(_this) {
  const { currentIndex, previewBack } = _this
  const guideList = _this.getGuideList()
  const { guildClose } = _this.Options
  if (isFunction(guildClose)) { guildClose(currentIndex, guideList[currentIndex], guideList) }

  _this.currentIndex = 0
  _this.destroy()

  // 通过 previewBack 标示判断回退界面
  if (previewBack) {
    _this.show('MAINTAIN')
    _this.previewBack = ''
    setTimeout(() => {
      scrollIntoToView(getMaintainRoot(), { block: 'start' })
    })
  }
}

// 关闭按钮
async function handleClickCloseButton (_this) {
  const { onClickOperationBarClose } = _this.Options
  if (isFunction(onClickOperationBarClose)) { await onClickOperationBarClose() }

  _this.destroy()
}

// 维护模式下，删除某个用户指导
function handleDeleteItem (_this, e) {
  const guideId = e.target.parentElement.parentElement.parentElement.id
  _this.dispatch('delete', _this.getGuideItemById(guideId))
}

// 维护模式下，编辑某个用户指导
function handleEditItem (_this, e) {
  const guideId = e.target.parentElement.parentElement.parentElement.id
  _this.showEditModal(_this.getGuideItemById(guideId))
}

// 维护模式下，切换编辑
function handlePreview (_this, e) {
  _this.destroy()
  _this.previewBack = 'maintain'
  _this.show('READ')
}

/* --------------------------- Private function ---------------------------------------- */

function transformData (_this) {
  const { windowWidth } = _this
  const guideList = _this.getGuideList()
  return isEmptyArray(guideList) ? [] : guideList.map(o => transformUtilToPixel(o, windowWidth))
}

function insertViewRoot (el) {
  document.body.insertBefore(el, document.body.childNodes[0])
}

// 更新上一步下一步 dom 内容
function updateGuideItemPosition(_this, guideItem, rootEle) {
  const { finalFlag, firstFlag, orderNumber, content } = guideItem

  // 1. update content
  const popElement = getElement(rootEle, '_eG_guide-content-text')
  popElement.innerHTML = content

  // 2. update button text
  const prevBtn = getElement(rootEle, '_eG_prev-btn')
  const nextBtn = getElement(rootEle, '_eG_next-btn')
  nextBtn.innerHTML = finalFlag ? '关闭' : '下一步'
  prevBtn.style.visibility = firstFlag ? 'hidden' : 'unset'

  // 3. update close title
  const closeTitle = getElement(rootEle, 'e_guide-title-text')
  closeTitle.innerHTML = `步骤${orderNumber}`

  // 4. update close button
  const closeBtn = getElement(rootEle, 'e_guide-close')
  setStyles(closeBtn, { display: 'inline-block' })

  const renderGuideItem = selectCorner(transformUtilToPixel(guideItem, _this.windowWidth))

  // 5. update bar position
  setBarLibPosition(rootEle, renderGuideItem)

  // 6. update wrapper
  const { windowWidth, windowHeight } = _this
  const { left, top, width, height } = renderGuideItem
  const contentPosition = calcContentPosition(
    [windowWidth, windowHeight],
    [left, top, width, height],
    [popElement.clientWidth, popElement.clientHeight]
  )
  const contentWrap = getElement(rootEle, '_eG_guide-content')
  contentWrap.className = `_eG_guide-content ${contentPosition}`
  setStyles(contentWrap, getContentPosition(_this, renderGuideItem, contentPosition))
}

function setBarLibPosition(rootEle, { top, left, width, height, position }) {
  const barElementList = Array.from(rootEle.getElementsByClassName('_eG_view-bar-common'))
  const temp = [
    `height:${top}px;`,
    `height:${height}px; width:${left}px; top:${top}px;`,
    `height:${height}px; left:${left + width}px; top:${top}px;`,
    `top: ${top + height}px;`
  ]
  temp.forEach((item, index) => {
    barElementList[index].setAttribute('style', item + `position: ${position};`)
  })
}

function getContentPosition (_this, guideItem, contentPosition) {
  const { top, left, height, width, fixFlag } = guideItem
  const fixedHeight = getWindowWidthHeight(isFixed(fixFlag))[1]
  const { windowWidth, windowHeight } = _this

  const styleJoin = ({
    left = 'unset',
    top = 'unset',
    right = 'unset',
    bottom = 'unset',
    transform = 'none'
  }) => ({
    position: isFixedPosition(fixFlag),
    left, top, right, bottom, transform
  })

  const offset = 12
  const H = isFixed(fixFlag) ? fixedHeight : windowHeight
  switch (contentPosition) {
    case '_eG_guide-1':
      return styleJoin({
        left: px(left),
        top: px(top - offset),
        transform: 'translateY(-100%)'
      })
    case '_eG_guide-2':
      return styleJoin({
        right: px(windowWidth - (left + width)),
        top: px(top - offset),
        transform: 'translateY(-100%)'
      })
    case '_eG_guide-3':
      return styleJoin({
        left: px(left + width + offset),
        top: px(top)
      })
    case '_eG_guide-4':
      return styleJoin({
        left: px(left + width + offset),
        bottom: px(H - (top + height)),
      })
    case '_eG_guide-5':
      return styleJoin({
        top: px(top + height + offset),
        right: px(windowWidth - (left + width)),
      })
    case '_eG_guide-6':
      return styleJoin({
        top: px(top + height + offset),
        left: px(left),
      })
    case '_eG_guide-7':
      return styleJoin({
        left: px(left - offset),
        bottom: px(H - (top + height)),
        transform: 'translateX(-100%)'
      })
    case '_eG_guide-8':
      return styleJoin({
        top: px(top),
        left: px(left - offset),
        transform: 'translateX(-100%)'
      })
    default:
      return styleJoin({
        top: px(top - offset),
        left: px(left),
        transform: 'translateX(-100%)'
      })
  }
}
