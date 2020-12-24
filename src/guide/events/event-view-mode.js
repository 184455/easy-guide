import { PrevBtnName, NextBtnName } from '../../config/constant'
import { updateStepDom } from '../../utils/dom'

/**
 * 只读模式下的点击事件代理
 * @param e
 */
export default function handelViewModeWrapClick(_this, e) {
  const elementName = e.target.dataset.elementName
  // 支持事件的元素列表
  const eventElementNameList = [PrevBtnName, NextBtnName]
  if (eventElementNameList.indexOf(elementName) === -1) return

  switch (elementName) {
    case PrevBtnName:
      handleClickPrevBtn(_this, e)
      break
    case NextBtnName:
      handleClickNextBtn(_this, e)
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
    const currentItem = Object.assign({}, guideList[newIndex], {
      finalFlag: (newIndex + 1) === guideList.length,
      firstFlag: newIndex === 0
    })
    _this.currentIndex = newIndex
    updateStepDom(currentItem)
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
    _this.currentIndex = 0
    _this.destroy()
  } else {
    newIndex = oldIndex + 1
    const currentItem = Object.assign({}, guideList[newIndex], {
      finalFlag: (oldIndex + 2) === guideList.length,
      firstFlag: false
    })
    _this.currentIndex = newIndex
    updateStepDom(currentItem)
  }
}
