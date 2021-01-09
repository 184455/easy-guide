// 系统试用到的常量

/**
 * 页面模式
 */
export const MODE = {
  READ: 'READ',           // 只展示
  MAINTAIN: 'MAINTAIN'    // 只编辑
}

// 选区最小高度，宽度
export const MinHeight = 50
export const MinWidth = 100

export const DefaultFillStyle = 'rgba(0, 0, 0, 0.5)'

// ------------------ 元素ID --------------------------

// 维护模式最外层容器 ID
export const RootId = '_eG_root'

// 查看模式最外层容器 ID
export const ViewRootId = '_eG_viewRoot'

// EasyGuide 内容编辑 modal 框
export const EGEditModal = '_eG_editModal'

// modal 取消按钮
export const ModalCancelBtn = '_eG_modalCancel'

// modal 确认按钮
export const ModalConfirmBtn = '_eG_modalConfirm'

// ------------------ 元素 DataSet --------------------------

// 元素 dataset 的 key
const DATA_SET_KEY = 'eg'
export const DataSetName = `data-${DATA_SET_KEY}`
export const dataSet = val => `${DataSetName}="${val}"`
export const getDataSet = el => el.dataset[DATA_SET_KEY]

// 元素 close button 的 key
export const CloseButton = 'guide-close-btn'

// template 元素 顶部拖拽区域
export const OperationBarDrag = 'template-drag-area'

// 预览切换按钮
export const PreviewBtn = 'preview-btn'

// 可拖拽指导 item
export const GuideDragItem = 'guide-drag-item'

// template 上下左右模板
export const TemplateItemTop = '_eg-guide-1'
export const TemplateItemRight = '_eg-guide-3'
export const TemplateItemBottom = '_eg-guide-5'
export const TemplateItemLeft = '_eg-guide-7'

// dot 上下左右
export const DotTop = 'e_dot-top'
export const DotRight = 'e_dot-right'
export const DotBottom = 'e_dot-bottom'
export const DotLeft = 'e_dot-left'

// 删除按钮
export const DeleteBtn = 'deleteButton'

// 编辑按钮
export const EditBtn = 'editBtn'

// 退出预览
export const ExitPreview = 'exitPreview'

// 查看 上一步/下一步
export const PrevBtnName = 'PrevBtnName'
export const NextBtnName = 'NextBtnName'
export const ViewCloseBtn = 'ViewCloseBtn'

// ------------------ 事件 --------------------------

// 事件 X 轴取值字段
export const tagX = 'pageX'

// 事件 Y 轴取值字段
export const tagY = 'pageY'
