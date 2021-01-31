/**
 * createGuideEditModal
 * 创建编辑框
 * @author Abner <xiaocao1602@qq.com>
 * @date 2021/01/01
 */
import { formDomText } from '@/config/dom-text'
import { createElement, getElementById, getElement, setStyles } from '@/utils/dom'
import { assign, selectCorner, addUtils, isFixed, getUtilValue, isFixedPosition, transformUtilToPixel } from '@/utils'

// 创建用户指导编辑框
export function createGuideEditModal(_this, guideItem) {
  const rootElement = createElement('div', { class: 'e_edit-modal', id: '_eG_editModal' })
  rootElement.innerHTML = modalDomText(guideItem)
  document.body.appendChild(rootElement)

  // 事件监听
  setTimeout(() => {
    getElement(rootElement, 'e_cancel-btn').onclick = () => handleClickCancel(_this)
    getElement(rootElement, 'e_confirm-btn').onclick = () => handleClickConfirm(_this, guideItem)
    rootElement.onchange = (e) => handleOnChange(_this, e)
  })
}

// 处理表单 onchange 事件
const handleOnChange = (_this, e) => {
  let { value, name } = e.target
  const selectKeys = ['leftUtil', 'topUtil', 'widthUtil', 'heightUtil']
  if (selectKeys.indexOf(name) === -1) { return }

  const valueContain = getElementById(`_EG_${name}`)
  valueContain.innerHTML = getUtilValue(Number(valueContain.innerHTML), value, _this.windowWidth)
}

// 表单元素
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

  return formDomText(formItemList)
}

// 处理点击取消按钮
const handleClickCancel = _this => {
  _this.hiddenEditModal()
}

// 获取表单数据
const getFormValues = (guideItem, windowWidth) => {
  const inputElements = document.getElementsByClassName('e_edit_class')
  const values = Array.from(inputElements).reduce((prev, inputEle) => {
    const { name, value } = inputEle
    return assign(prev, { [name]: value })
  }, {})

  // 定位方式变了，需要指定默认的 top, left 值
  if (guideItem.fixFlag !== values.fixFlag) {
    const { topUtil, leftUtil } = values
    values.top = topUtil === '%' ? 0.15 : 200
    values.left = leftUtil === '%' ? 0.15 : isFixed(values.fixFlag) ? 200 : (windowWidth / 2 - 150) | 0
  }
  return values
}

const transformChangeFields = (formValues, guideItem, windowWidth) => {
  const changeFields =
    (['left', 'top', 'width', 'height'])
    .filter(o => formValues[o + 'Util'] !== guideItem[o + 'Util'])
    .reduce((acc, field) => {
      return assign(acc, {
        [field]: getUtilValue(guideItem[field], formValues[field + 'Util'], windowWidth)
      })
    }, {})

  return assign({}, guideItem, formValues, changeFields)
}

// 处理点击确认按钮
const handleClickConfirm = (_this, guideItem) => {
  const { content, id } = guideItem

  // 获取表单数据
  const { windowWidth } = _this
  const formValues = getFormValues(guideItem, windowWidth)

  // 根据改变的字段，转换他们的值
  const transformGuideItem = transformChangeFields(formValues, guideItem, windowWidth)

  // 把数据转成像素
  const pixelGuideItem = transformUtilToPixel(transformGuideItem, windowWidth)

  // 根据四个角落转换数据
  const cornerGuideItem = selectCorner(pixelGuideItem)

  // Dispatch To Dom
  const editItemDom = getElementById(String(id))
  const styles = addUtils(cornerGuideItem, ['top', 'left', 'height', 'width'], 'px')
  getElement(editItemDom, '_eG_guide-content-text').innerHTML = content || '请维护用户指导内容！'
  setStyles(editItemDom, assign({}, styles, { position: isFixedPosition(cornerGuideItem.fixFlag) }))

  // Dispatch To modify
  _this.dispatch('modify', cornerGuideItem)

  // 关闭
  _this.hiddenEditModal()
}
