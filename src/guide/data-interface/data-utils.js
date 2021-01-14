/**
 * 数据处理方法：工具方法
 * @author Abner <xiaocao1602@qq.com>
 * @date 2021/01/01
 */

import { mergeObj, isEmptyArray, createGuideItemData,
  getMaxNumber, scrollIntoToView, selectPosition, isFunction } from '../../utils/index'
import { getGuideItemDomText, getGuideViewDomText } from '../../config/dom-text'
import {
  getElementById, removeChild, getMaintainRoot,
  getElement, getViewRoot, createViewRoot, setStyles
} from '../../utils/dom'

export function handleInitRender (_this) {
  const renderData = transformData(_this).map(o => {
    const temp = mergeObj({}, o)
    const pos = selectPosition(temp)
    return mergeObj({}, temp, pos)
  })
  const { mode } = _this

  const domText = renderData.map(o => getGuideItemDomText(o, mode)).join('')
  getMaintainRoot().insertAdjacentHTML('beforeend', domText)
}

export async function handleCreate (_this, action) {
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

export function handleDelete (_this, action, data) {
  const { guideList } = _this
  _this.guideList = guideList.filter(i => String(i.id) !== String(data.id))
  const deleteElement = getElementById(data.id)
  removeChild(deleteElement.parentElement, deleteElement)

  broadcast(_this, action, data)
}

export function handleInitViewRender (_this) {
  const { guideList, mode } = _this
  const currentItem = mergeObj({}, guideList[0], {
    finalFlag: guideList.length === 1,
    firstFlag: true
  })

  const tempRootEle = createViewRoot()
  tempRootEle.innerHTML = getGuideViewDomText(currentItem, mode)
  refreshStepDom(_this, currentItem, tempRootEle)
  insertViewRoot(tempRootEle)
  scrollIntoToView(getElement(tempRootEle, 'e_guide-content'))
}

export function handleModify (_this, action, data) {
  _this.guideList = _this.guideList.map(o => {
    if (String(o.id) === String(data.id)) {
      return mergeObj({}, o, data)
    } else {
      return o
    }
  })
  broadcast(_this, action, data)
}

export async function handleClickPrevBtn(_this, e) {
  const { guideList, currentIndex: oldIndex } = _this
  if (!Array.isArray(guideList) || !guideList.length) {
    return
  }

  const { beforePrev } = _this.Options

  let newIndex
  if (oldIndex === 0) {
    // 第一条，不做任何事情
  } else {
    newIndex = oldIndex - 1

    if (isFunction(beforePrev)) {
      await beforePrev(oldIndex, newIndex, guideList)
    }

    const currentItem = mergeObj({}, guideList[newIndex], {
      finalFlag: (newIndex + 1) === guideList.length,
      firstFlag: newIndex === 0
    })
    _this.currentIndex = newIndex
    refreshStepDom(_this, currentItem)
    setTimeout(() => {
      scrollIntoToView(getElement(getViewRoot(), 'e_guide-content'))
    }, 320)
  }
}

export async function handleClickNextBtn(_this, e) {
  const { guideList, currentIndex: oldIndex } = _this
  if (!Array.isArray(guideList) || !guideList.length) {
    return
  }

  let newIndex
  if ((oldIndex + 1) === guideList.length) {
    // 关闭
    handleClickCloseBtn(_this)
  } else {
    newIndex = oldIndex + 1

    const { beforeNext } = _this.Options
    if (isFunction(beforeNext)) {
      await beforeNext(oldIndex, newIndex, guideList)
    }

    const currentItem = mergeObj({}, guideList[newIndex], {
      finalFlag: (oldIndex + 2) === guideList.length,
      firstFlag: false
    })
    _this.currentIndex = newIndex
    refreshStepDom(_this, currentItem)
    setTimeout(() => {
      scrollIntoToView(getElement(getViewRoot(), 'e_guide-content'))
    }, 320)
  }
}

export function handleClickCloseBtn(_this) {
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
export function handleClickCloseButton (_this, e) {
  _this.destroy()
}

// 维护模式下，删除某个用户指导
export function handleDeleteItem (_this, e) {
  const { guideList } = _this
  const deleteId = e.target.parentElement.parentElement.parentElement.id
  _this.dispatch('delete', guideList.find(i => String(i.id) === String(deleteId)) || {})
}

// 维护模式下，编辑某个用户指导
export function handleEditItem (_this, e) {
  const editId = e.target.parentElement.parentElement.parentElement.id
  _this.showEditModal(_this.guideList.find(o => String(o.id) === String(editId)))
}

// 维护模式下，切换编辑
export function handlePreview (_this, e) {
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
  const obj = mergeObj({}, guideItem)
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
      return mergeObj({}, prev, { [key]: val, [newKey]: 'px' })
    }
  }, { position: obj.fixFlag !== 'N' ? 'fixed' : 'absolute' })

  return mergeObj(obj, temp)
}

function insertViewRoot (el) {
  document.body.insertBefore(el, document.body.childNodes[0])
}

// 更新上一步下一步 dom 内容
export function refreshStepDom(_this, showItemData, rootEle) {
  rootEle = rootEle || getViewRoot()
  const barElementList = Array.from(rootEle.getElementsByClassName('bar-lib-common'))
  const contentWrap = getElement(rootEle, 'e_guide-content')
  const content = getElement(rootEle, 'e_guide-content-text')
  const closeTitle = getElement(rootEle, 'e_guide-title-text')
  const closeBtn = getElement(rootEle, 'e_guide-close')
  const prevBtn = getElement(rootEle, 'e_prev-btn')
  const nextBtn = getElement(rootEle, 'e_next-btn')
  content.innerHTML = showItemData.content
  const { windowWidth, windowHeight } = _this
  mergeObj(showItemData, { windowWidth, windowHeight })

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
  console.log(mergeObj({}, renderValue1))
  const checkPosition = selectPosition(renderValue1)
  const finalRender = mergeObj({}, renderValue1, checkPosition)
  setBarLibPosition(barElementList, finalRender)

  console.log(finalRender)

  const { contentPosition, orderNumber } = showItemData
  closeTitle.innerHTML = `步骤${orderNumber}`
  setStyles(closeBtn, { display: 'inline-block' })
  contentWrap.className = `e_guide-content ${contentPosition}`
  setStyles(contentWrap, calcGuidePosition(mergeObj(showItemData, finalRender)))
}

export function setBarLibPosition(barList, { top, left, width, height, position }) {
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
    return mergeObj({
      position: fixFlag !== 'N' ? 'fixed' : 'absolute',
      top: `${top}px`,
      left: `${left}px`
    }, obj)
  }

  const offset = 12
  const Height = fixFlag !== 'N' ? window.innerHeight : windowHeight
  switch (contentPosition) {
    case '_eg-guide-1':
      return styleJoin(top - offset, left, {
        right: 'unset',
        bottom: 'unset',
        transform: 'translateY(-100%)'
      })
    case '_eg-guide-2':
      return styleJoin(top - offset, left, {
        left: 'unset',
        right: `${windowWidth - (left + width)}px`,
        transform: 'translateY(-100%)'
      })
    case '_eg-guide-3':
      return styleJoin(top, left + width + offset, {
        right: 'unset',
        bottom: 'unset',
        transform: 'none'
      })
    case '_eg-guide-4':
      return styleJoin(top, left + width + offset, {
        top: 'unset',
        bottom: `${Height - (top + height)}px`,
        transform: 'none'
      })
    case '_eg-guide-5':
      return styleJoin(top + height + offset, left, {
        left: 'unset',
        right: `${windowWidth - (left + width)}px`,
        transform: 'none'
      })
    case '_eg-guide-6':
      return styleJoin(top + height + offset, left, {
        right: 'unset',
        bottom: 'unset',
        transform: 'none'
      })
    case '_eg-guide-7':
      return styleJoin(top, left - offset, {
        top: 'unset',
        bottom: `${Height - (top + height)}px`,
        transform: 'translateX(-100%)'
      })
    case '_eg-guide-8':
      return styleJoin(top, left - offset, {
        transform: 'translateX(-100%)',
        right: 'unset',
        bottom: 'unset'
      })
    default:
  }
}
