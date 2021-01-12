import Constant from '../../config/constant'
import {
  handleInitRender, handleCreate,
  handleDelete, handleModify, handleInitViewRender,
  handleClickPrevBtn, handleClickNextBtn, handleClickCloseBtn,
  handleClickCloseButton, handleDeleteItem, handleEditItem, handlePreview
 } from './data-utils'

 const {
  PrevBtnName, NextBtnName, ViewCloseBtn, ExitPreview,
  CloseButton, DeleteBtn, EditBtn, PreviewBtn
} = Constant

export default function InitDataInterface (EasyGuide) {
  EasyGuide.prototype.dispatch = function (action, data) {
    const _this = this

    switch (action) {
      case 'initRender':
        handleInitRender(_this)
        break
      case 'create':
        handleCreate(_this, action)
        break
      case 'delete':
        handleDelete(_this, action, data)
        break
      case 'initViewRender':
        handleInitViewRender(_this)
        break
      case 'modify':
        handleModify(_this, action, data)
        break
      case PrevBtnName:
        handleClickPrevBtn(_this)
        break
      case NextBtnName:
        handleClickNextBtn(_this)
        break
      case ExitPreview:
        handleClickCloseBtn(_this)
        break
      case ViewCloseBtn:
        handleClickCloseBtn(_this)
        break
      case CloseButton:
        handleClickCloseButton(_this, data)
        break
      case DeleteBtn:
        handleDeleteItem(_this, data)
        break
      case EditBtn:
        handleEditItem(_this, data)
        break
      case PreviewBtn:
        handlePreview(_this, data)
        break
      default:
    }
  }
}
