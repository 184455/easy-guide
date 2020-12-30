import { getRootElement, getViewRoot } from '../../utils/dom'
import { handelMouseDown, handelMouseMove, handelMouseUp } from './event-mouse'
import handelWrapperClick from './event-click'
import handelViewModeWrapClick from './event-view-mode'

export default function InitEvents (EasyGuide) {
  EasyGuide.prototype.initEvents = function () {
    // 在根节点代理所有的事件
    const listenerTarget = getRootElement()
    if (listenerTarget) {
      listenerTarget.onclick = e => handelWrapperClick(this, e)
      listenerTarget.onmousedown = e => handelMouseDown(this, e)
      listenerTarget.onmousemove = e => handelMouseMove(this, e)
      listenerTarget.onmouseup = e => handelMouseUp(this, e)
    }

    const viewModeListen = getViewRoot()
    if (viewModeListen) {
      viewModeListen.onclick = e => handelViewModeWrapClick(this, e)
    }
  }

  // 解绑所有事件
  EasyGuide.prototype.eventsDestroy = function () {
    const listenerTarget = getRootElement()
    if (listenerTarget) {
      listenerTarget.onclick = null
      listenerTarget.onmousedown = null
      listenerTarget.onmousemove = null
      listenerTarget.onmouseup = null
    }

    const viewModeListen = getViewRoot()
    if (viewModeListen) {
      viewModeListen.onclick = null
    }
  }
}
