// 系统试用到的常量

/**
 * 页面模式
 */
export const MODE = {
  READ: 'READ',           // 只展示
  MAINTAIN: 'MAINTAIN'    // 编辑模式
}

export const DefaultFillStyle = 'rgba(0, 0, 0, 0.5)'

// ------------------ 元素ID --------------------------

// EasyGuide 最外层 div 容器 ID
export const EasyGuideWrapId = 'EasyGuideWrap'

// EasyGuide 画板
export const EasyGuideCanvasId = 'EasyGuideCanvasId'

// EasyGuide 存放用户维护的指导 div 数据
export const EasyGuideDivContainerId = 'EasyGuideDivContainerId'

// EasyGuide 放置用户可以选用的模版
export const EasyGuideTemplateId = 'EasyGuideTemplateId'

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

// ------------------ 事件 --------------------------

// 事件 X 轴取值字段
export const tagX = 'pageX'

// 事件 Y 轴取值字段
export const tagY = 'pageY'
