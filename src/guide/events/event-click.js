import {
  TemplateItemTop,
  TemplateItemRight,
  TemplateItemBottom,
  TemplateItemLeft,
  PreviewBtn,
  CloseButton,
  DeleteBtn,
  EditBtn
} from '../../config/constant'
import { createGuideItemData, getMaxNumber } from '../../utils/index'
import { createGuideItem } from '../../utils/dom'

/**
 * 点击事件
 * @param e
 */
export default function handelWrapperClick(_this, e) {
  const elementName = e.target.dataset.eg
  const eventElementNameList = [
    TemplateItemTop, TemplateItemRight, TemplateItemBottom,
    TemplateItemLeft, CloseButton, DeleteBtn, EditBtn, PreviewBtn
  ]
  if (eventElementNameList.indexOf(elementName) === -1) return

  const { guideList, windowWidth } = _this
  if (elementName.indexOf('_eg-guide-') > -1) {
    const itemProps = createGuideItemData({
      orderNumber: getMaxNumber(guideList, 'orderNumber') + 1,
      contentPosition: elementName,
      left: (windowWidth / 2 - 150) | 0,
      top: window.pageYOffset + 200
    })

    createGuideItem(itemProps)
    _this.dispatch('create', itemProps)
    return
  }

  switch (elementName) {
    case CloseButton:
      handleClickCloseButton(_this, e)
      break
    case DeleteBtn:
      handleDeleteItem(_this, e)
      break
    case EditBtn:
      handleEditItem(_this, e)
      break
    case PreviewBtn:
      handlePreview(_this, e)
      break
    default:
  }
}

// 关闭按钮
const handleClickCloseButton = (_this, event) => {
  _this.destroy()
}

// 维护模式下，删除某个用户指导
const handleDeleteItem = (_this, event) => {
  const { guideList } = _this
  const deleteId = event.target.parentElement.parentElement.parentElement.id
  _this.dispatch('delete', guideList.find(i => String(i.id) === String(deleteId)) || {})
}

// 维护模式下，编辑某个用户指导
const handleEditItem = (_this, event) => {
  const editId = event.target.parentElement.parentElement.parentElement.id
  _this.showEditModal(_this.guideList.find(o => String(o.id) === String(editId)))
}

// 维护模式下，切换编辑
const handlePreview = (_this, event) => {
  _this.destroy()
  _this.previewBack = 'maintain'
  _this.setMode('READ')
  _this.show()
}
