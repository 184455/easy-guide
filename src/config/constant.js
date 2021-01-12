// 系统试用到的常量

const Config = {
  tagX: 'pageX',
  tagY: 'pageY',
  MODE: {
    READ: 'READ',           // 只展示
    MAINTAIN: 'MAINTAIN'    // 只编辑
  },
  MinHeight: 50,
  MinWidth: 100,
  DefaultFillStyle: 'rgba(0, 0, 0, 0.5)',
  RootId: '_eG_root',
  ViewRootId: '_eG_viewRoot',
  EGEditModal: '_eG_editModal',
  ModalCancelBtn: '_eG_modalCancel',
  ModalConfirmBtn: '_eG_modalConfirm',
  DataSetName: 'data-eg',
  dataSet: val => `data-eg="${val}"`,
  getDataSet: el => el.dataset.eg,
  CloseButton: 'guide-close-btn',
  OperationBarDrag: 'operation-drag-area',
  PreviewBtn: 'preview-btn',
  DragGuide: 'guide-drag-item',
  DotTop: 'e_dot-top',
  DotRight: 'e_dot-right',
  DotBottom: 'e_dot-bottom',
  DotLeft: 'e_dot-left',
  DeleteBtn: 'deleteButton',
  EditBtn: 'editBtn',
  ExitPreview: 'exitPreview',
  PrevBtnName: 'PrevBtnName',
  NextBtnName: 'NextBtnName',
  ViewCloseBtn: 'ViewCloseBtn'
}

export default Config
