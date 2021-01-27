/**
 * createGuideEditModal
 * 创建编辑框
 * @author Abner <xiaocao1602@qq.com>
 * @date 2021/01/01
 */

import Constant from '@/config/constant'
import { ele, getElementById, getElement, setStyles } from '@/utils/dom'
import { mergeObj, transformUtil, toPixel, selectPosition, addUtils } from '@/utils/index'

const { ModalConfirmBtn, EGEditModal, ModalCancelBtn } = Constant

// 创建用户指导编辑框
export function createGuideEditModal(_this, editInfo) {
  const rootElement = ele('div', { class: 'e_edit-modal', id: EGEditModal })
  rootElement.innerHTML = modalDomText(editInfo)
  document.body.appendChild(rootElement)

  setTimeout(() => {
    getElement(rootElement, 'e_cancel-btn').onclick = () => handleClickCancel(_this)
    getElement(rootElement, 'e_confirm-btn').onclick = () => handleClickConfirm(_this, editInfo)
    rootElement.onchange = (e) => handleOnChange(_this, e)
  })
}

// 用户点击确认，更新对编辑对应的 dom
const refreshEdit = (patchData, windowWidth, windowHeight) => {
  const { content, id } = patchData
  const editItemDom = getElementById(String(id))
  const contentBox = getElement(editItemDom, '_eG_guide-content-text')

  const pixelData = toPixel(patchData, windowWidth, windowHeight)
  const temp1 = mergeObj({}, patchData, pixelData)
  const checkPositionData = selectPosition(temp1)
  const temp2 = mergeObj({}, temp1, checkPositionData)
  const pixel = addUtils(temp2, ['top', 'left', 'height', 'width'], 'px')
  setStyles(editItemDom, pixel)
  contentBox.innerHTML = content || '请维护用户指导内容！'
}

// 处理点击取消按钮
const handleClickCancel = _this => {
  _this.hiddenEditModal()
}

// 处理点击确认按钮
const handleClickConfirm = (_this, editInfo) => {
  const { windowWidth, windowHeight } = _this
  const inputElements = document.getElementsByClassName('e_edit_class')
  const values = Array.from(inputElements).reduce((prev, inputEle) => {
    let { name, value } = inputEle
    return mergeObj(prev, { [name]: value })
  }, {})

  if (editInfo.fixFlag !== values.fixFlag) {
    const { topUtil, leftUtil } = values
    if (values.fixFlag === 'N') {
      values.top = topUtil === '%' ? 0.15 : 200
      values.left = leftUtil === '%' ? 0.15 : (windowWidth / 2 - 150) | 0
    } else {
      // 四个角
      values.top = topUtil === '%' ? 0.15 : 200
      values.left = leftUtil === '%' ? 0.15 : 200
    }
  }

  const temp = mergeObj(editInfo, values, { id: editInfo.id })
  const transformUtilData = transformUtil(temp, windowWidth, windowHeight)
  _this.dispatch('modify', transformUtilData)
  _this.hiddenEditModal()
  refreshEdit(transformUtilData, windowWidth, windowHeight)
}

// 处理表单 onchange 事件
const handleOnChange = (_this, e) => {
  let { value, name } = e.target
  const selectKeys = ['leftUtil', 'topUtil', 'widthUtil', 'heightUtil']
  if (selectKeys.indexOf(name) === -1) {
    return
  }
  const valueElement = getElementById(`_EG_${name}`)
  const oldVal = Number(valueElement.innerHTML)

  if (value === '%') {
    value = Number((oldVal / _this.windowWidth).toFixed(2))
  } else {
    value = parseInt(_this.windowWidth * oldVal)
  }
  valueElement.innerHTML = value
}

/* --------------------------- Private function ---------------------------------------- */

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
      <div class="select-left" id="_EG_${fileName}">${value}</div>
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
        { showText: '不固定', value: 'N' },
        { showText: '参考左上角固定', value: 'leftTop' },
        { showText: '参考右上角固定', value: 'rightTop' },
        { showText: '参考右下角固定', value: 'rightBottom' },
        { showText: '参考左下角固定', value: 'leftBottom' }
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
    { title: '是否固定', fileName: 'fixFlag', value: fixFlag }
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
