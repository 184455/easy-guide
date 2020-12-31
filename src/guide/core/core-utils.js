// core 模块的工具方法
import { createGuideItemData, isEmptyArray, mergeObj } from '../../utils/index'
import {
  addClass,
  deleteClass,
  setStyles,
  createGuideItem,
  getRootElement,
  hasRootElement,
  createRootElement,
  createTemplateElement,
  createViewRoot,
  insertViewRoot,
  refreshDom,
  hasViewRoot,
  guideContentBox
} from '../../utils/dom'

function renderGuideList({ guideList }) {
  if (!isEmptyArray(guideList)) {
    guideList.forEach((position) => {
      createGuideItem(createGuideItemData(position))
    })
  }
}

export function handleBodyClassName () {
  addClass(document.body, '_eG_body')
}

export function handleRemoveBodyClassName () {
  deleteClass(document.body, '_eG_body')
}

// 展示-编辑模式
export function showGuideMainTain(_this) {
  // 检查根结点
  if (!hasRootElement()) {
    createRootElement()
  }

  // 设置蒙板宽高
  const { windowWidth, windowHeight } = _this
  setStyles(getRootElement(), { height: windowHeight + 'px', width: windowWidth + 'px' })

  // 渲染用户指导
  renderGuideList(_this)

  // 创建指导模板
  createTemplateElement()
}

// 展示-查看模式
export function showGuideView(_this) {
  const { guideList, mode } = _this
  if (isEmptyArray(guideList) || hasViewRoot()) {
    return
  }

  const currentItem = mergeObj({}, guideList[0], {
    finalFlag: guideList.length === 1,
    firstFlag: true
  })

  const barList = (['top', 'left', 'right', 'bottom'])
    .map(i => `<div class="bar-lib-${i} bar-lib-common"></div>`)
    .join('')

  const tempRootEle = createViewRoot()
  tempRootEle.innerHTML = barList + guideContentBox(currentItem, mode)
  refreshDom(currentItem, tempRootEle)
  insertViewRoot(tempRootEle)
}

// 初始化默认的数据项
export function initDefaultData (_this) {
  const { mode, guideList } = _this.Options
  _this.guideList = (guideList || []).slice(0)
  _this.mode = mode
  _this.currentIndex = 0
}

// 初始化面板的宽高
export function initWindowWidthAndHeight(_this) {
  const { scrollAble } = _this.Options
  _this.windowWidth = scrollAble ? document.body.scrollWidth : window.innerWidth
  _this.windowHeight = scrollAble ? document.body.scrollHeight : window.innerHeight
}
