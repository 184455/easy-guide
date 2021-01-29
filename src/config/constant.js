/**
 * Constant
 * 系统常量
 * @author Abner <xiaocao1602@qq.com>
 * @date 2021/01/01
 */

export default {
  tagX: 'pageX',
  tagY: 'pageY',
  MODE: {
    READ: 'READ',           // 只展示
    MAINTAIN: 'MAINTAIN'    // 只编辑
  },
  minHeight: 50,
  minWidth: 100,
  DefaultFillStyle: 'rgba(0, 0, 0, 0.5)',
  OperationBarDrag: 'operation-drag-area',
  DragGuide: 'guide-drag-item',
  DotTop: '_eG_dot-top',
  DotRight: '_eG_dot-right',
  DotBottom: '_eG_dot-bottom',
  DotLeft: '_eG_dot-left',
  dataSet: val => `data-eg="${val}"`,
  getDataSet: el => el.dataset.eg
}

