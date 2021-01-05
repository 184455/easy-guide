import { ele, getElementById, getElement, setStyles } from '../../utils/dom'
import { ModalConfirmBtn, EGEditModal, ModalCancelBtn } from '../../config/constant'
import { mergeObj } from '../../utils/index'

// 创建用户指导编辑框
export function createGuideEditModal(_this, editInfo) {
  const rootElement = ele('div', { class: 'e_edit-modal', id: EGEditModal })
  rootElement.innerHTML = modalDomText(editInfo)
  document.body.appendChild(rootElement)

  setTimeout(() => {
    getElement(rootElement, 'e_cancel-btn').onclick = () => handleClickCancel(_this)
    getElement(rootElement, 'e_confirm-btn').onclick = () => handleClickConfirm(_this, editInfo)
  })
}

// 用户点击确认，更新对编辑对应的 dom
const refreshEditDom = (id, { content, top, fixFlag }) => {
  const editItemDom = getElementById(String(id))
  const contentBox = getElement(editItemDom, 'e_guide-content-text')

  setStyles(editItemDom, { position: fixFlag === 'Y' ? 'fixed' : 'absolute', top: `${top}px` })
  contentBox.innerHTML = content || '请维护用户指导内容！'
}

// 处理点击取消按钮
const handleClickCancel = _this => {
  _this.hiddenEditModal()
}

// 处理点击确认按钮
const handleClickConfirm = (_this, editInfo) => {
  const inputElements = document.getElementsByClassName('e_edit_class')
  const values = Array.from(inputElements).reduce((prev, inputEle) => {
    const { name, value } = inputEle
    return mergeObj(prev, { [name]: value })
  }, {})

  if (values.fixFlag === 'Y' && editInfo.fixFlag === 'N') {
    // 从相对定位切换到绝对定位，位置需要重置到最开始的位置
    values.top = 200
  }

  _this.dispatch('modify', mergeObj(editInfo, values, { id: editInfo.id }))
  _this.hiddenEditModal()
  refreshEditDom(editInfo.id, values)
}

function selectElement (value, fileName, optionList) {
  const selectedFlag = (val) => val === value ? ' selected' : ''
  return `
    <select class="e_select e_edit_class" name="${fileName}">
      ${optionList.map(o => {
        return `<option value="${o.value}"${selectedFlag(o.value)}>${o.showText}</option>`
      }).join('')}
    </select>
  `
}
function prefixSelect ({ fileName, value, suffixValue }) {
  const prefixOptionList = [
    { showText: '百分比', value: '%' },
    { showText: '像素', value: 'px' }
  ]

  return `
    <div class="prefix-select">
      <div class="select-left">${value}</div>
      ${selectElement(suffixValue, fileName, prefixOptionList)}
    </div>
  `
}
function requireElement (flag) {
  return flag ? '<span style="color: red;">* </span>' : ''
}
function formItem (itemData) {
  return `
    <div class="form-item">
      ${formItemLeft(itemData)}
      <div class="item-right">
        ${formItemRight(itemData)}
      </div>
    </div>
  `
}
function formItemLeft ({ title, isRequired }) {
  return `<div class="item-left"><label>${requireElement(isRequired)}<span>${title}：</span></label></div>`
}
function formItemRight (itemData) {
  const { fileName, value } = itemData
  switch (fileName) {
    case 'orderNumber':
      return `<input value="${value}" name="orderNumber" class="e_input e_edit_class" style="width: 50px;" type="number" min="1" />`
    case 'content':
      return `<textarea class="e_input e_textarea e_edit_class" name="content" placeholder="请输入指导内容">${value}</textarea>`
    case 'fixFlag':
      return selectElement(value, fileName, [
        { showText: '是', value: 'Y' },
        { showText: '否', value: 'N' }
      ])
    default:
      return prefixSelect(itemData)
  }
}
function modalDomText (initData) {
  const {
    orderNumber, content, fixFlag,
    width, widthUtil,
    height, heightUtil,
    left, leftUtil,
    top, topUtil
  } = initData
  const formItemList = [
    { title: '序号', fileName: 'orderNumber', value: orderNumber || 1, isRequired: true },
    { title: '指导信息', fileName: 'content', value: content || '', isRequired: true },
    { title: '选框宽度', fileName: 'widthUtil', value: width, suffixValue: widthUtil },
    { title: '选框高度', fileName: 'heightUtil', value: height, suffixValue: heightUtil },
    { title: '左/右边距', fileName: 'leftUtil', value: left, suffixValue: leftUtil },
    { title: '上/下边距', fileName: 'topUtil', value: top, suffixValue: topUtil },
    { title: '是否固定位置', fileName: 'fixFlag', value: fixFlag }
  ]

  return `
    <div class="e_modal-mast"></div>
    <div class="e_modal-content-wrap">
      <div class="e_modal-inner-content">
        <div class="modal-header">编辑指导信息</div>
        <div class="modal-content">
          <form method="POST" url="">
            ${formItemList.map(o => formItem(o)).join('')}
          </form>
        </div>
        <div class="modal-footer">
          <button class="e_cancel-btn" id="${ModalCancelBtn}">取消</button>
          <button class="e_confirm-btn" id="${ModalConfirmBtn}">确定</button>
        </div>
      </div>
    </div>
  `
}
