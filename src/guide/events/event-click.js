import {
  TemplateItemTop,
  TemplateItemRight,
  TemplateItemBottom,
  TemplateItemLeft,
  CloseButton,
  DeleteBtn,
  EditBtn
} from '../../config/constant'
import { createGuideItemData, defaultPosition, getMaxNumber } from '../../utils/index'
import { createGuideItem } from '../../utils/dom'

/**
 * 点击事件
 * @param e
 */
export default function handelWrapperClick(_this, e) {
  const elementName = e.target.dataset.elementName
  // 支持事件的元素列表
  const eventElementNameList = [
    TemplateItemTop, TemplateItemRight, TemplateItemBottom,
    TemplateItemLeft, CloseButton, DeleteBtn, EditBtn
  ]
  if (eventElementNameList.indexOf(elementName) === -1) return

  if (elementName.indexOf('template-item-') > -1) {
    // 点击模版添加，创建元素
    const positionInfo = defaultPosition(_this.windowWidth)
    const itemProps = createGuideItemData(Object.assign(positionInfo, {
      orderNumber: getMaxNumber(_this.guideList, 'orderNumber') + 1,
      contentPosition: elementName
    }))

    createGuideItem(_this, elementName, itemProps)
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
