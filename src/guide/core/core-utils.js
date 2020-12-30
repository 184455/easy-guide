// core 模块的工具方法
import { DataSetName, PrevBtnName, NextBtnName } from '../../config/constant'
import { createGuideItemData, isEmptyArray } from '../../utils/index'
import {
  ele,
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
  hasViewRoot
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
  const { guideList } = _this
  if (isEmptyArray(guideList) || hasViewRoot()) {
    return
  }

  const currentItem = Object.assign({}, guideList[0], {
    finalFlag: guideList.length === 1,
    firstFlag: true
  })

  const barList = (['top', 'left', 'right', 'bottom'])
    .map(i => `<div class="bar-lib-${i} bar-lib-common"></div>`)
    .join('')

  const domText = `
    ${barList}
    <div class="e_step-content-box">
      <div class="box-content"></div>
      <div class="content-footer">
        <button class="box-pre-btn" ${DataSetName}="${PrevBtnName}">上一步</button>
        <button class="box-next-btn" ${DataSetName}="${NextBtnName}">关闭</button>
      </div>
    </div>
  `

  const tempRootEle = createViewRoot()
  tempRootEle.innerHTML = domText
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
