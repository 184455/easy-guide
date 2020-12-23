import { utilsCreateElement } from '../../utils/dom'
import { ModalConfirmBtnId, EGEditModal, ModalCancelBtnId } from '../../config/constant'

// 用户点击确认，更新对编辑对应的 dom
const refreshEditDom = (id, { content, orderNumber, fixFlag }) => {
  const editItemDom = document.getElementById(String(id))
  editItemDom.style.position = fixFlag === 'Y' ? 'fixed' : 'absolute'
  const contentBox = editItemDom.getElementsByClassName('e_guide-content-text')[0]
  const orderNumberBox = editItemDom.getElementsByClassName('e_top-step-number')[0]
  contentBox.innerHTML = content
  orderNumberBox.innerHTML = orderNumber
}

// 创建一个 select 元素
const createSelect = (list, selectedValue, fileName) => {
  const optionList = document.createDocumentFragment()
  if (Array.isArray(list)) {
    list.map(item => {
      const { optionValue, showText } = item
      const temp = utilsCreateElement('option', { value: optionValue })
      temp.innerHTML = showText
      optionList.appendChild(temp)
    })
  }

  console.log(selectedValue)
  const SelectEle = utilsCreateElement('select', {
    class: 'e_select e_edit_class', name: fileName
  })
  SelectEle.appendChild(optionList)
  SelectEle.value = selectedValue
  return SelectEle
}

// 创建带头信息的 select 框
const prefixSelect = (prefixContent, value, fileName, list) => {
  const res = utilsCreateElement('div', { class: 'prefix-select' })
  const leftContent = utilsCreateElement('div', { class: 'select-left' })
  leftContent.innerHTML = prefixContent
  res.appendChild(leftContent)
  res.appendChild(createSelect(list, value, fileName))

  return res
}

// 创建单个item
const createFromItem = itemData => {
  const { title, isRequired = false, elementType, className, fileName, value, suffixValue } = itemData
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
          value,
          name: fileName,
          class: className,
          style: 'width: 50px;',
          type: 'number',
          min: 1
        }
      ))
      break
    case 'content':
      const contentBox = utilsCreateElement(
        elementType,
        { class: className, name: fileName }
      )
      contentBox.value = value
      itemRight.appendChild(contentBox)
      break
    case 'verticalDistance':
      itemRight.appendChild(prefixSelect(value, suffixValue, fileName, [
        { showText: '百分比', value: '%' },
        { showText: '像素', value: 'px' }
      ]))
      break
    case 'horizontalDistance':
      itemRight.appendChild(prefixSelect(value, suffixValue, fileName, [
        { showText: '百分比', value: '%' },
        { showText: '像素', value: 'px' }
      ]))
      break
    case 'boxWidth':
      itemRight.appendChild(prefixSelect(value, suffixValue, fileName, [
        { showText: '百分比', value: '%' },
        { showText: '像素', value: 'px' }
      ]))
      break
    case 'boxHeight':
      itemRight.appendChild(prefixSelect(value, suffixValue, fileName, [
        { showText: '百分比', value: '%' },
        { showText: '像素', value: 'px' }
      ]))
      break
    case 'positionReference':
      itemRight.appendChild(createSelect([
        { showText: '左上角', optionValue: 'LeftTop' },
        { showText: '右上角', optionValue: 'RightTop' },
        { showText: '右下角', optionValue: 'RightBottom' },
        { showText: '左下角', optionValue: 'LeftBottom' }
      ], value, fileName))
      break
    case 'fixFlag':
      itemRight.appendChild(createSelect([
        { showText: '是', optionValue: 'Y' },
        { showText: '否', optionValue: 'N' }
      ], value, fileName))
      break
    default:
      itemRight.appendChild(utilsCreateElement(elementType, { class: className, value }))
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
const createFrom = (initData) => {
  const { orderNumber, content, left, top, width, height, fixFlag } = initData
  const form = utilsCreateElement('form', { method: 'POST', url: '' })
  form.appendChild(createFromItems([
    {
      title: '序号',
      isRequired: true,
      elementType: 'input',
      className: 'e_input e_edit_class',
      fileName: 'orderNumber',
      value: orderNumber || 1
    },
    {
      title: '指导信息',
      isRequired: true,
      elementType: 'textarea',
      className: 'e_input e_textarea e_edit_class',
      fileName: 'content',
      value: content || ''
    },
    { title: '左/右边距', elementType: 'select', fileName: 'verticalDistance', value: left, suffixValue: '%' },
    { title: '上/下边距', elementType: 'select', fileName: 'horizontalDistance', value: top, suffixValue: '%' },
    { title: '选框宽度', elementType: 'select', fileName: 'boxWidth', value: width, suffixValue: '%' },
    { title: '选框高度', elementType: 'select', fileName: 'boxHeight', value: height, suffixValue: '%' },
    { title: '定位参考', elementType: 'select', fileName: 'positionReference', value: 'LeftTop' },
    { title: '是否固定位置', elementType: 'select', fileName: 'fixFlag', value: fixFlag }
  ]))

  return form
}

// 处理点击取消按钮
const handleClickCancel = _this => {
  _this.hiddenEditModal()
}

// 处理点击确认按钮
const handleClickConfirm = (_this, editInfo) => {
  const inputElements = document.getElementsByClassName('e_edit_class')
  const values = Array.from(inputElements).reduce((prev, ele) => {
    const { name, value } = ele
    return Object.assign(prev, { [name]: value })
  }, {})

  _this.dispatch('modify', Object.assign(values, { id: editInfo.id }))
  refreshEditDom(editInfo.id, values)
  _this.hiddenEditModal()
}

// 创建用户指导编辑框
export function createGuideEditModal(_this, editInfo) {
  const rootElement = utilsCreateElement('div', { class: 'e_edit-modal', id: EGEditModal })
  const mastElement = utilsCreateElement('div', { class: 'e_modal-mast' })
  const contentWrap = utilsCreateElement('div', { class: 'e_modal-content-wrap' })
  const innerContentElement = utilsCreateElement('div', { class: 'e_modal-inner-content' })

  // modal 里面的内容
  const headerContent = utilsCreateElement('div', { class: 'modal-header' })
  headerContent.innerHTML = '编辑指导信息'
  innerContentElement.appendChild(headerContent)

  const content = utilsCreateElement('div', { class: 'modal-content' })
  content.appendChild(createFrom(editInfo))
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
    handleClickConfirm(_this, editInfo)
  }
  footerContent.appendChild(cancelBtn)
  footerContent.appendChild(confirmBtn)
  innerContentElement.appendChild(footerContent)

  rootElement.appendChild(mastElement)
  contentWrap.appendChild(innerContentElement)
  rootElement.appendChild(contentWrap)
  document.body.appendChild(rootElement)
}
