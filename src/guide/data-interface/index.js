/**
 * InitDataInterface
 * 初始化数据处理接口
 * @author Abner <xiaocao1602@qq.com>
 * @date 2021/01/01
 */
import {
  handleInitRender, handleCreate,
  handleDelete, handleModify, handleInitViewRender, handleShowStep,
  handleClickPrevBtn, handleClickNextBtn, handleClickCloseBtn,
  handleClickCloseButton, handleDeleteItem, handleEditItem, handlePreview
 } from './data-utils'

export default function InitDataInterface (EasyGuide) {
  EasyGuide.prototype.dispatch = function (action, data) {
    const _this = this

    switch (action) {
      case 'modify':
        handleModify(_this, action, data)
        break
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
      case 'showStep':
        handleShowStep(_this, data)
        break
      case 'prevBtnName':
        handleClickPrevBtn(_this)
        break
      case 'nextBtnName':
        handleClickNextBtn(_this)
        break
      case 'exitPreview':
        handleClickCloseBtn(_this)
        break
      case 'viewCloseBtn':
        handleClickCloseBtn(_this)
        break
      case 'guide-close-btn':
        handleClickCloseButton(_this, data)
        break
      case 'deleteButton':
        handleDeleteItem(_this, data)
        break
      case 'editBtn':
        handleEditItem(_this, data)
        break
      case 'preview-btn':
        handlePreview(_this, data)
        break
      default:
    }
  }
}
