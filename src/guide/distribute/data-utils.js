/**
 * 分发器处理方法：工具方法
 * @author Abner <xiaocao1602@qq.com>
 * @date 2021/01/01
 */
import Constant from '@/config/constant'
import { calcContentPosition, commonBorderCheck, checkDot } from '@/guide/check'
import { getGuideItemDomText, getGuideViewDomText, exitPreview } from '@/config/dom-text'
import {
  assign, isEmptyArray, createGuideItemData,
  getMaxNumber, scrollIntoToView, selectCorner,
  isFunction, px, transformUtilToSave, addUtils
} from '@/utils'
import {
  getElementById, removeChild, getMaintainRoot,
  getElement, getViewRoot, createViewRoot, setStyles
} from '@/utils/dom'

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
        handleCreate(_this, action)
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

async function handleCreate (_this, action) {
  const { guideList, windowWidth, Options } = _this
  const { beforeCreate } = Options

  const beforeVal = createGuideItemData({
    orderNumber: getMaxNumber(guideList, 'orderNumber') + 1,
    left: (windowWidth / 2 - 150) | 0,
    top: window.pageYOffset + 200
  })

  let guideItem = beforeVal
  if (isFunction(beforeCreate)) {
    guideItem = await beforeCreate(_this, beforeVal)
  }

  guideList.push(guideItem)
  const domText = getGuideItemDomText(transformPixel(guideItem, windowWidth), 'MAINTAIN')
  getMaintainRoot().insertAdjacentHTML('beforeend', domText)
  broadcast(_this, action, guideItem)
}

function handleDelete (_this, action, data) {
  const { guideList } = _this
  _this.guideList = guideList.filter(i => String(i.id) !== String(data.id))
  const deleteElement = getElementById(data.id)
  removeChild(deleteElement.parentElement, deleteElement)

  broadcast(_this, action, data)
}

function handleInitViewRender (_this) {
  const { guideList, mode, previewBack } = _this
  const currentItem = assign({}, guideList[0], {
    finalFlag: guideList.length === 1,
    firstFlag: true
  })

  const tempRootEle = createViewRoot()
  tempRootEle.innerHTML = exitPreview(previewBack === 'maintain') + getGuideViewDomText(currentItem, mode)
  refreshStepDom(_this, currentItem, tempRootEle)
  insertViewRoot(tempRootEle)
  scrollIntoToView(getElement(tempRootEle, '_eG_guide-content'))
}

function handleMouseMoving (_this, data) {
  const { type, el } = data

  if (type === 'barMoving') {
    const { newLeft, newTop } = commonBorderCheck(data)
    setStyles(el, { left: px(newLeft), top: px(newTop) })
  } else if (type === 'guideMoving') {
    const { newLeft, newTop } = commonBorderCheck(data)
    setStyles(el, { left: px(newLeft), top: px(newTop) })

    const { containHW, childHW, popElement } = data
    const [childWidth, childHeight] = childHW
    const contentPosition = calcContentPosition(containHW, [newLeft, newTop, childWidth, childHeight])
    popElement.className = `_eG_guide-content ${contentPosition}`

    _this.mouseEventTempData.changeData = {
      contentPosition,
      left: newLeft,
      top: newTop,
      width: childWidth,
      height: childHeight
    }
  } else if (type === 'dotMoving') {
    const { popElement, editItem, containHW } = _this.mouseEventTempData
    const newPosition = checkDot(_this.mouseEventTempData)

    // 设置一个选区的最小宽高
    if (newPosition.width < minWidth || newPosition.height < minHeight) { return }

    setStyles(el, addUtils(newPosition, ['left', 'top', 'width', 'height'], 'px'))
    const newGuideData = assign({}, editItem, newPosition)
    const { left, top, width, height } = newGuideData

    const contentPosition = calcContentPosition(containHW, [left, top, width, height])
    popElement.className = `_eG_guide-content ${contentPosition}`

    _this.mouseEventTempData.changeData = { contentPosition, left, top, width, height }
  }
}

function handleModify (_this, newGuideItem) {
  let pipeline = null
  pipeline = selectCorner(newGuideItem)
  pipeline = transformUtilToSave(pipeline, _this.windowWidth)

  _this.setGuideItem(pipeline)
  broadcast(_this, 'modify', pipeline)
}

async function handleClickPrevBtn(_this, e) {
  const { guideList, currentIndex: oldIndex } = _this
  if (!Array.isArray(guideList) || !guideList.length) { return }

  const newIndex = oldIndex - 1

  const { beforePrev } = _this.Options
  if (isFunction(beforePrev)) {
    await beforePrev(oldIndex, newIndex, guideList)
  }

  handleShowStep(_this, newIndex)
}

async function handleClickNextBtn(_this, e) {
  const { guideList, currentIndex: oldIndex } = _this
  if (!Array.isArray(guideList) || !guideList.length) { return }

  const newIndex = oldIndex + 1

  const { beforeNext } = _this.Options
  if (isFunction(beforeNext)) {
    await beforeNext(oldIndex, newIndex, guideList)
  }

  handleShowStep(_this, newIndex)
}

function handleShowStep (_this, index) {
  const { guideList } = _this
  if (!guideList[index]) {
    handleClickCloseBtn(_this)
    return
  }

  const showItem = assign({}, guideList[index], {
    finalFlag: (index + 1) === guideList.length,
    firstFlag: index === 0
  })

  _this.currentIndex = index
  refreshStepDom(_this, showItem)
  setTimeout(() => {
    scrollIntoToView(getElement(getViewRoot(), '_eG_guide-content'))
  }, 320)
}

function handleClickCloseBtn(_this) {
  const { currentIndex, guideList } = _this
  const { guildClose } = _this.Options
  if (isFunction(guildClose)) { guildClose(currentIndex, guideList[currentIndex], guideList) }

  _this.currentIndex = 0
  _this.destroy()

  if (_this.previewBack) { // 通过 previewBack 标示判断回退界面
    _this.show('MAINTAIN')
    _this.previewBack = ''
    setTimeout(() => {
      scrollIntoToView(getMaintainRoot(), { block: 'start' })
    })
  }
}

// 关闭按钮
function handleClickCloseButton (_this, e) {
  _this.destroy()
}

// 维护模式下，删除某个用户指导
function handleDeleteItem (_this, e) {
  const { guideList } = _this
  const deleteId = e.target.parentElement.parentElement.parentElement.id
  _this.dispatch('delete', guideList.find(i => String(i.id) === String(deleteId)) || {})
}

// 维护模式下，编辑某个用户指导
function handleEditItem (_this, e) {
  const editId = e.target.parentElement.parentElement.parentElement.id
  _this.showEditModal(_this.guideList.find(o => String(o.id) === String(editId)))
}

// 维护模式下，切换编辑
function handlePreview (_this, e) {
  _this.destroy()
  _this.previewBack = 'maintain'
  _this.show('READ')
}

/* --------------------------- Private function ---------------------------------------- */

function broadcast (_this, action, data) {
  const { onGuideListChange = () => {} } = _this.Options
  onGuideListChange(action, data, _this.guideList)
}

function transformData (_this) {
  const { guideList, windowWidth } = _this
  if (isEmptyArray(guideList)) {
    return []
  }
  return guideList.map(o => transformPixel(o, windowWidth))
}

function transformPixel (guideItem, windowWidth) {
  const obj = assign({}, guideItem)
  const transformKeys = ['left', 'top', 'width', 'height']
  const temp = Object.keys(obj).reduce((prev, key) => {
    let val = obj[key]
    const newKey = `${key}Util`
    const denominator = windowWidth

    if (transformKeys.indexOf(key) === -1) {
      return prev
    } else {
      if (obj[newKey] === '%') {
        val = parseInt(val * denominator)
      }
      return assign({}, prev, { [key]: val, [newKey]: 'px' })
    }
  }, { position: obj.fixFlag !== 'N' ? 'fixed' : 'absolute' })

  return assign(obj, temp)
}

function insertViewRoot (el) {
  document.body.insertBefore(el, document.body.childNodes[0])
}

// 更新上一步下一步 dom 内容
function refreshStepDom(_this, showItemData, rootEle) {
  rootEle = rootEle || getViewRoot()
  const barElementList = Array.from(rootEle.getElementsByClassName('_eG_view-bar-common'))
  const contentWrap = getElement(rootEle, '_eG_guide-content')
  const content = getElement(rootEle, '_eG_guide-content-text')
  const closeTitle = getElement(rootEle, 'e_guide-title-text')
  const closeBtn = getElement(rootEle, 'e_guide-close')
  const prevBtn = getElement(rootEle, '_eG_prev-btn')
  const nextBtn = getElement(rootEle, '_eG_next-btn')
  content.innerHTML = showItemData.content
  const { windowWidth, windowHeight } = _this
  assign(showItemData, { windowWidth, windowHeight })

  const { finalFlag, firstFlag } = showItemData
  if (finalFlag) {
    nextBtn.innerHTML = '关闭'
  } else {
    nextBtn.innerHTML = '下一步'
  }

  if (firstFlag) {
    prevBtn.style.visibility = 'hidden'
  } else {
    prevBtn.style.visibility = 'unset'
  }

  const renderValue1 = transformPixel(showItemData, _this.windowWidth, _this.windowHeight, 0)
  const checkPosition = selectCorner(renderValue1)
  const finalRender = assign({}, renderValue1, checkPosition)
  setBarLibPosition(barElementList, finalRender)

  const { contentPosition, orderNumber } = showItemData
  closeTitle.innerHTML = `步骤${orderNumber}`
  setStyles(closeBtn, { display: 'inline-block' })
  contentWrap.className = `_eG_guide-content ${contentPosition}`
  setStyles(contentWrap, calcGuidePosition(assign(showItemData, finalRender)))
}

function setBarLibPosition(barList, { top, left, width, height, position }) {
  const temp = [
    `height:${top}px;`,
    `height:${height}px; width:${left}px; top:${top}px;`,
    `height:${height}px; left:${left + width}px; top:${top}px;`,
    `top: ${top + height}px;`
  ]
  temp.forEach((item, index) => {
    barList[index].setAttribute('style', item + `position: ${position};`)
  })
}

function calcGuidePosition ({ top, left, height, width, fixFlag, contentPosition, windowWidth, windowHeight }) {
  const styleJoin = (top, left, obj = {}) => {
    return assign({
      position: fixFlag !== 'N' ? 'fixed' : 'absolute',
      top: `${top}px`,
      left: `${left}px`
    }, obj)
  }

  const offset = 12
  const Height = fixFlag !== 'N' ? window.innerHeight : windowHeight
  switch (contentPosition) {
    case '_eG_guide-1':
      return styleJoin(top - offset, left, {
        right: 'unset',
        bottom: 'unset',
        transform: 'translateY(-100%)'
      })
    case '_eG_guide-2':
      return styleJoin(top - offset, left, {
        left: 'unset',
        right: `${windowWidth - (left + width)}px`,
        transform: 'translateY(-100%)'
      })
    case '_eG_guide-3':
      return styleJoin(top, left + width + offset, {
        right: 'unset',
        bottom: 'unset',
        transform: 'none'
      })
    case '_eG_guide-4':
      return styleJoin(top, left + width + offset, {
        top: 'unset',
        bottom: `${Height - (top + height)}px`,
        transform: 'none'
      })
    case '_eG_guide-5':
      return styleJoin(top + height + offset, left, {
        left: 'unset',
        right: `${windowWidth - (left + width)}px`,
        transform: 'none'
      })
    case '_eG_guide-6':
      return styleJoin(top + height + offset, left, {
        right: 'unset',
        bottom: 'unset',
        transform: 'none'
      })
    case '_eG_guide-7':
      return styleJoin(top, left - offset, {
        top: 'unset',
        bottom: `${Height - (top + height)}px`,
        transform: 'translateX(-100%)'
      })
    case '_eG_guide-8':
      return styleJoin(top, left - offset, {
        transform: 'translateX(-100%)',
        right: 'unset',
        bottom: 'unset'
      })
    default:
      return styleJoin(top - offset, left, {
        right: 'unset',
        bottom: 'unset',
        transform: 'translateY(-100%)'
      })
  }
}
