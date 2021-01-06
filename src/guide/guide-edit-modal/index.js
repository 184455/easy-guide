// 维护指导信息的弹框
import { MODE, ModalCancelBtn, ModalConfirmBtn, EGEditModal } from '../../config/constant'
import { createGuideEditModal } from './guide-eidt-modal-utils'
import { removeChild, getElementById } from '../../utils/dom'

export default function GuideEditModal (EasyGuide) {
  EasyGuide.prototype.showEditModal = function (editInfo) {
    if (this.mode === MODE.READ) {
      return
    }
    createGuideEditModal(this, editInfo)
  }
  EasyGuide.prototype.hiddenEditModal = function () {
    const rootEle = getElementById(EGEditModal)
    getElementById(ModalCancelBtn).onclick = null
    getElementById(ModalConfirmBtn).onclick = null
    rootEle.onchange = null
    removeChild(document.body, rootEle)
  }
}
