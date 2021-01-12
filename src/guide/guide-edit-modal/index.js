/**
 * GuideEditModal
 * 编辑指导的模态框
 * @author Abner <xiaocao1602@qq.com>
 * @date 2021/01/01
 */

import Constant from '../../config/constant'
import { createGuideEditModal } from './modal-utils'
import { removeChild, getElementById } from '../../utils/dom'

const { MODE, ModalCancelBtn, ModalConfirmBtn, EGEditModal } = Constant

export default function GuideEditModal (EasyGuide) {
  EasyGuide.prototype.showEditModal = function (editInfo) {
    if (this.mode === MODE.MAINTAIN) {
      createGuideEditModal(this, editInfo)
    }
  }
  EasyGuide.prototype.hiddenEditModal = function () {
    const rootEle = getElementById(EGEditModal)
    getElementById(ModalCancelBtn).onclick = null
    getElementById(ModalConfirmBtn).onclick = null
    rootEle.onchange = null
    removeChild(document.body, rootEle)
  }
}
