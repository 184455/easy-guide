import { getEasyGuideWrap } from '../../utils/dom'
import { handelMouseDown, handelMouseMove, handelMouseUp } from './event-mouse'
import handelWrapperClick from './event-click'

export default function InitEvents (EasyGuide) {
  // 初始化事件
  EasyGuide.prototype.initEvents = function () {
    // 在根节点代理所有的事件
    const listenerTarget = getEasyGuideWrap()
    listenerTarget.onclick = e => handelWrapperClick(this, e)
    listenerTarget.onmousedown = e => handelMouseDown(this, e)
    listenerTarget.onmousemove = e => handelMouseMove(this, e)
    listenerTarget.onmouseup = e => handelMouseUp(this, e)
  }

  // 解绑所有事件
  EasyGuide.prototype.eventsDestroy = function () {
    const listenerTarget = getEasyGuideWrap()
    listenerTarget.onclick = null
    listenerTarget.onmousedown = null
    listenerTarget.onmousemove = null
    listenerTarget.onmouseup = null
  }
}
