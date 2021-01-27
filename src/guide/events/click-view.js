/**
 * Click
 * 处理查看模式下的点击事件
 * @author Abner <xiaocao1602@qq.com>
 * @date 2021/01/01
 */

import Constant from '@/config/constant'

/**
 * 只读模式下的点击事件代理
 * @param e
 */
export default function handelViewModeWrapClick(_this, e) {
  const elementName = Constant.getDataSet(e.target)
  const eventElementNameList = ['prevBtnName', 'nextBtnName', 'exitPreview', 'viewCloseBtn']
  if (eventElementNameList.indexOf(elementName) === -1) return

  // 把数据派发到数据层处理
  _this.dispatch(elementName)
}
