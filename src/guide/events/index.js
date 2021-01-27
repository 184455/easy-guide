/**
 * InitEvents
 * 初始化事件，事件代理
 * @author Abner <xiaocao1602@qq.com>
 * @date 2021/01/01
 */

import { getMaintainRoot, getViewRoot } from '@/utils/dom'
import { handelMouseDown, handelMouseMove, handelMouseUp } from './mouse'
import handelViewModeWrapClick from './click-view'
import handelWrapperClick from './click'

export default function InitEvents (EasyGuide) {
  EasyGuide.prototype.initEvents = function () {
    const _this = this

    // 事件代理（Event agent）
    const maintainToot = getMaintainRoot()
    if (maintainToot) {
      maintainToot.onclick = e => handelWrapperClick(_this, e)
      maintainToot.onpointerdown = e => handelMouseDown(_this, e)
      maintainToot.onmousemove = e => handelMouseMove(_this, e)
      maintainToot.onpointerup = e => handelMouseUp(_this, e)
    }

    const viewModeListen = getViewRoot()
    if (viewModeListen) {
      viewModeListen.onclick = e => handelViewModeWrapClick(_this, e)
    }
  }

  EasyGuide.prototype.eventsDestroy = function () {
    const maintainToot = getMaintainRoot()
    if (maintainToot) {
      maintainToot.onclick = null
      maintainToot.onpointerdown = null
      maintainToot.onmousemove = null
      maintainToot.onpointerup = null
    }

    const viewModeListen = getViewRoot()
    if (viewModeListen) {
      viewModeListen.onclick = null
    }
  }
}
