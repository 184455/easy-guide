// 维护指导信息的弹框
import {
  MODE,
  ModalCancelBtnId,
  ModalConfirmBtnId,
  EGEditModal
} from '../config/constant'
import { utilsCreateElement } from '../utils/dom'

// 创建一个 select 元素
const createSelect = (list) => {
  const optionList = document.createDocumentFragment()
  if (Array.isArray(list)) {
    list.map(item => {
      const { value, showText } = item
      const temp = utilsCreateElement('option', { value })
      temp.innerHTML = showText
      optionList.appendChild(temp)
    })
  }
  const res = utilsCreateElement('select', { class: 'e_select' })
  res.appendChild(optionList)
  return res
}

// 创建带头信息的 select 框
const prefixSelect = (prefixContent, list) => {
  const res = utilsCreateElement('div', { class: 'prefix-select' })
  const leftContent = utilsCreateElement('div', { class: 'select-left' })
  leftContent.innerHTML = prefixContent
  res.appendChild(leftContent)
  res.appendChild(createSelect(list))

  return res
}

// 创建单个item
const createFromItem = itemData => {
  const { title, isRequired = false, elementType, className, fileName } = itemData
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
  switch (fileName) {
    case 'orderNumber':
      itemRight.appendChild(utilsCreateElement(
        elementType, {
          class: className,
          style: 'width: 50px;',
          type: 'number',
          min: 1
        }
      ))
      break
    case 'guideContent':
      itemRight.appendChild(utilsCreateElement(
        elementType,
        { class: className }
      ))
      break
    case 'verticalDistance':
      itemRight.appendChild(prefixSelect('300', [
        { showText: '百分比', value: '%' },
        { showText: '像素', value: 'px' }
      ]))
      break
    case 'horizontalDistance':
      itemRight.appendChild(prefixSelect('300', [
        { showText: '百分比', value: '%' },
        { showText: '像素', value: 'px' }
      ]))
      break
    case 'boxWidth':
      itemRight.appendChild(prefixSelect('300', [
        { showText: '百分比', value: '%' },
        { showText: '像素', value: 'px' }
      ]))
      break
    case 'boxHeight':
      itemRight.appendChild(prefixSelect('300', [
        { showText: '百分比', value: '%' },
        { showText: '像素', value: 'px' }
      ]))
      break
    case 'positionReference':
      itemRight.appendChild(createSelect([
        { showText: '左上角', value: 'LeftTop' },
        { showText: '右上角', value: 'RightTop' },
        { showText: '右下角', value: 'RightBottom' },
        { showText: '左下角', value: 'LeftBottom' }
      ]))
      break
    case 'scrollAble':
      itemRight.appendChild(createSelect([
        { showText: '是', value: '1' },
        { showText: '否', value: '0' }
      ]))
      break
    default:
      itemRight.appendChild(utilsCreateElement(elementType, { class: className }))
  }

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
    { title: '序号', isRequired: true, elementType: 'input', className: 'e_input', fileName: 'orderNumber' },
    {
      title: '指导信息',
      isRequired: true,
      elementType: 'textarea',
      className: 'e_input e_textarea',
      fileName: 'guideContent'
    },
    { title: '左/右边距', elementType: 'select', fileName: 'verticalDistance' },
    { title: '上/下边距', elementType: 'select', fileName: 'horizontalDistance' },
    { title: '选框宽度', elementType: 'select', fileName: 'boxWidth' },
    { title: '选框高度', elementType: 'select', fileName: 'boxHeight' },
    { title: '定位参考', elementType: 'select', fileName: 'positionReference' },
    { title: '是否随页面滚动', elementType: 'select', fileName: 'scrollAble' }
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
