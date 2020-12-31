import { PrevBtnName, NextBtnName, ViewCloseBtn } from '../../config/constant'
import { refreshDom } from '../../utils/dom'
import { mergeObj } from '../../utils/index'

/**
 * 只读模式下的点击事件代理
 * @param e
 */
export default function handelViewModeWrapClick(_this, e) {
  const elementName = e.target.dataset.eg
  // 支持事件的元素列表
  const eventElementNameList = [PrevBtnName, NextBtnName, ViewCloseBtn]
  if (eventElementNameList.indexOf(elementName) === -1) return

  switch (elementName) {
    case PrevBtnName:
      handleClickPrevBtn(_this, e)
      break
    case NextBtnName:
      handleClickNextBtn(_this, e)
      break
    case ViewCloseBtn:
      handleClickCloseBtn(_this, e)
      break
    default:
  }
}

function handleClickPrevBtn(_this, e) {
  const { guideList, currentIndex: oldIndex } = _this
  if (!Array.isArray(guideList) || !guideList.length) {
    return
  }

  let newIndex
  if (oldIndex === 0) {
    // 第一条，不做任何事情
  } else {
    newIndex = oldIndex - 1
    const currentItem = mergeObj({}, guideList[newIndex], {
      finalFlag: (newIndex + 1) === guideList.length,
      firstFlag: newIndex === 0
    })
    _this.currentIndex = newIndex
    refreshDom(currentItem)
  }
}

function handleClickNextBtn(_this, e) {
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
    const currentItem = mergeObj({}, guideList[newIndex], {
      finalFlag: (oldIndex + 2) === guideList.length,
      firstFlag: false
    })
    _this.currentIndex = newIndex
    refreshDom(currentItem)
  }
}

function handleClickCloseBtn(_this) {
  // 关闭
  _this.currentIndex = 0
  _this.destroy()
}
