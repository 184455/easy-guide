// 维护指导信息的弹框
import { MODE, ModalCancelBtnId, ModalConfirmBtnId, EGEditModal } from '../../config/constant'
import { createGuideEditModal } from './guide-eidt-modal-utils'
import { removeChild } from '../../utils/dom'

export default function GuideEditModal (EasyGuide) {
  EasyGuide.prototype.showEditModal = function (editInfo) {
    if (this.mode === MODE.READ) {
      return
    }

    createGuideEditModal(this, editInfo)
  }
  EasyGuide.prototype.hiddenEditModal = function () {
    // 解绑事件
    document.getElementById(ModalCancelBtnId).onclick = null
    document.getElementById(ModalConfirmBtnId).onclick = null

    const removeElement = document.getElementById(EGEditModal)
    removeChild(document.body, removeElement)
  }
}
