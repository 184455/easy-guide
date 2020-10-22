// 维护指导信息的弹框
import {
  MODE,
  ModalCancelBtnId,
  ModalConfirmBtnId,
  EGEditModal
} from '../config/constant'
import { utilsCreateElement } from '../utils/dom'

// 创建单个item
const createFromItem = itemData => {
  const { title, isRequired = false, elementType } = itemData
  const requireElement = utilsCreateElement('span', { style: 'color: red;' })
  requireElement.innerHTML = '* '

  const wrap = utilsCreateElement('div', { class: 'form-item' })
  // 左边
  const itemLeft = utilsCreateElement('div', { class: 'item-left' })
  const label = utilsCreateElement('label')
  if (isRequired) {
    label.appendChild(requireElement)
  }
  const labelText = utilsCreateElement('span')
  labelText.innerHTML = `${title}：`
  label.appendChild(labelText)
  itemLeft.appendChild(label)

  // 右边
  const itemRight = utilsCreateElement('div', { class: 'item-right' })
  itemRight.appendChild(utilsCreateElement(elementType))

  wrap.appendChild(itemLeft)
  wrap.appendChild(itemRight)
  return wrap
}

// 创建表单的列表
const createFromItems = (itemList) => {
  const items = document.createDocumentFragment()
  itemList.forEach(formItem => {
    items.appendChild(createFromItem(formItem))
  })

  return items
}

// 创建表单
const createFrom = () => {
  const form = utilsCreateElement('form', { method: 'POST', url: '' })
  form.appendChild(createFromItems([
    { title: '序号', isRequired: true, elementType: 'input' },
    { title: '指导信息', isRequired: true, elementType: 'textarea' },
    { title: '定位参考', elementType: 'input' },
    { title: '左/右边距', elementType: 'input' },
    { title: '上/下边距', elementType: 'input' },
    { title: '是否随页面滚动', elementType: 'select' }
  ]))

  return form
}

// 处理点击取消按钮
const handleClickCancel = _this => {
  _this.hiddenEditModal()
}

// 处理点击取消按钮
const handleClickConfirm = _this => {
  console.log('Click Confirm')
  _this.hiddenEditModal()
}

export default function guideModal (EasyGuide) {
  EasyGuide.prototype.hiddenEditModal = function () {
    // 解绑事件
    document.getElementById(ModalCancelBtnId).onclick = null
    document.getElementById(ModalConfirmBtnId).onclick = null

    const removeElement = document.getElementById(EGEditModal)
    document.body.removeChild(removeElement)
  }
  EasyGuide.prototype.showEditModal = function (editInfo) {
    if (this.mode === MODE.READ) {
      return
    }

    console.log(editInfo)

    const _this = this

    const rootElement = utilsCreateElement('div', { class: 'e_edit-modal', id: EGEditModal })
    const mastElement = utilsCreateElement('div', { class: 'e_modal-mast' })
    const contentWrap = utilsCreateElement('div', { class: 'e_modal-content-wrap' })
    const innerContentElement = utilsCreateElement('div', { class: 'e_modal-inner-content' })

    // modal 里面的内容
    const headerContent = utilsCreateElement('div', { class: 'modal-header' })
    headerContent.innerHTML = '编辑指导信息'
    innerContentElement.appendChild(headerContent)

    const content = utilsCreateElement('div', { class: 'modal-content' })
    content.appendChild(createFrom())
    innerContentElement.appendChild(content)

    const footerContent = utilsCreateElement('div', { class: 'modal-footer' })
    const cancelBtn = utilsCreateElement('button', {
      class: 'e_cancel-btn',
      id: ModalCancelBtnId
    })
    cancelBtn.innerHTML = '取消'
    cancelBtn.onclick = () => {
      handleClickCancel(_this)
    }
    const confirmBtn = utilsCreateElement('button', {
      class: 'e_confirm-btn',
      id: ModalConfirmBtnId
    })
    confirmBtn.innerHTML = '确定'
    confirmBtn.onclick = () => {
      handleClickConfirm(_this)
    }
    footerContent.appendChild(cancelBtn)
    footerContent.appendChild(confirmBtn)
    innerContentElement.appendChild(footerContent)

    rootElement.appendChild(mastElement)
    contentWrap.appendChild(innerContentElement)
    rootElement.appendChild(contentWrap)
    document.body.appendChild(rootElement)
  }
}
