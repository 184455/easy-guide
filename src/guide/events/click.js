import { PreviewBtn, CloseButton, DeleteBtn, EditBtn, getDataSet } from '../../config/constant'

/**
 * 点击事件
 * @param e
 */
export default function handelWrapperClick(_this, e) {
  const targetName = getDataSet(e.target)
  if (targetName && targetName.indexOf('_eg-guide-') > -1) {
    _this.dispatch('create')
    return
  }

  const eventElementNameList = [CloseButton, DeleteBtn, EditBtn, PreviewBtn]
  if (eventElementNameList.indexOf(targetName) === -1) { return }

  _this.dispatch(targetName, e)
}
