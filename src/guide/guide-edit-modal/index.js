/**
 * GuideEditModal
 * 编辑指导的模态框
 * @author Abner <xiaocao1602@qq.com>
 * @date 2021/01/01
 */
import Constant from '@/config/constant'
import { removeChild, getElementById } from '@/utils/dom'
import { createGuideEditModal } from './modal-utils'

const { MODE } = Constant

export default function GuideEditModal (EasyGuide) {
  EasyGuide.prototype.showEditModal = function (editInfo) {
    if (this.mode === MODE.MAINTAIN) {
      createGuideEditModal(this, editInfo)
    }
  }
  EasyGuide.prototype.hiddenEditModal = function () {
    const rootEle = getElementById('_eG_editModal')
    getElementById('_eG_modalCancel').onclick = null
    getElementById('_eG_modalConfirm').onclick = null
    rootEle.onchange = null
    removeChild(document.body, rootEle)
  }
}
