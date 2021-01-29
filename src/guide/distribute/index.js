/**
 * Distribute
 * 事件数据处理的分发器
 * @author Abner <xiaocao1602@qq.com>
 * @date 2021/01/01
 */
import { distribute } from './data-utils'

export default function Distribute (EasyGuide) {
  EasyGuide.prototype.dispatch = function (action, data) {
    distribute(this, action, data)
  }
}
