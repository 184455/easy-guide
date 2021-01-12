import Constant from '../../config/constant'

const { PrevBtnName, NextBtnName, ViewCloseBtn, ExitPreview, getDataSet } = Constant

/**
 * 只读模式下的点击事件代理
 * @param e
 */
export default function handelViewModeWrapClick(_this, e) {
  const elementName = getDataSet(e.target)
  const eventElementNameList = [PrevBtnName, NextBtnName, ExitPreview, ViewCloseBtn]
  if (eventElementNameList.indexOf(elementName) === -1) return

  // 把数据派发到数据层处理
  _this.dispatch(elementName)
}
