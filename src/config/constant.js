// 系统试用到的常量

/**
 * 页面模式
 */
export const MODE = {
  READ: 'READ',           // 只展示
  MAINTAIN: 'MAINTAIN',    // 只编辑
  MIX: 'MIX'    // 可以切换展示和编辑模式
}

// 选区最小高度，宽度
export const MinHeight = 50
export const MinWidth = 100

export const DefaultFillStyle = 'rgba(0, 0, 0, 0.5)'

// ------------------ 元素ID --------------------------

// EasyGuide 最外层 div 容器 ID
export const EasyGuideWrapId = 'EasyGuideWrap'

// EasyGuide 画板
export const EasyGuideCanvasId = 'EasyGuideCanvasId'

// EasyGuide 放置用户可以选用的模版
export const EasyGuideTemplateId = 'EasyGuideTemplateId'

// EasyGuide 内容编辑 modal 框
export const EGEditModal = 'EGEditModal'

// modal 取消按钮
export const ModalCancelBtnId = 'modalCancelBtn'

// modal 确认按钮
export const ModalConfirmBtnId = 'modalConfirmBtn'

// ------------------ 元素 DataSet --------------------------

// 元素 dataset 的 key
export const ElementDataSetName = 'data-element-name'

// 元素 close button 的 key
export const CloseButton = 'data-element-name'

// canvas 元素 dataset 名字
export const CanvasName = 'canvas'

// template 元素 顶部拖拽区域
export const TemplateDragArea = 'template-drag-area'

// 可拖拽指导 item
export const GuideDragItem = 'guide-drag-item'

// template 上下左右模板
export const TemplateItemTop = 'template-item-top'
export const TemplateItemRight = 'template-item-right'
export const TemplateItemBottom = 'template-item-bottom'
export const TemplateItemLeft = 'template-item-left'

// dot 上下左右
export const DotTop = 'e_dot-top'
export const DotRight = 'e_dot-right'
export const DotBottom = 'e_dot-bottom'
export const DotLeft = 'e_dot-left'

// 删除按钮
export const DeleteBtn = 'deleteButton'

// 编辑按钮
export const EditBtn = 'editBtn'

// ------------------ 事件 --------------------------

// 事件 X 轴取值字段
export const tagX = 'pageX'

// 事件 Y 轴取值字段
export const tagY = 'pageY'
