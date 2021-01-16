/**
 * Click
 * 处理点击事件
 * @author Abner <xiaocao1602@qq.com>
 * @date 2021/01/01
 */

import Constant from '../../config/constant'

const { PreviewBtn, CloseButton, DeleteBtn, EditBtn, getDataSet } = Constant

/**
 * 点击事件
 * @param e
 */
export default function handelWrapperClick(_this, e) {
  const targetName = getDataSet(e.target)
  if (targetName && targetName.indexOf('_eG_guide-') > -1) {
    _this.dispatch('create')
    return
  }

  const eventElementNameList = [CloseButton, DeleteBtn, EditBtn, PreviewBtn]
  if (eventElementNameList.indexOf(targetName) === -1) { return }

  _this.dispatch(targetName, e)
}
