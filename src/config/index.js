/**
 * Config
 * 配置文件
 * @author Abner <xiaocao1602@qq.com>
 * @date 2021/01/01
 */

import Constant from './constant'

const Config = {
  mode: Constant.MODE.READ,
  beforeCreate: null,
  beforeNext: null,
  afterNext: null,
  beforePrev: null,
  afterPrev: null,
  guildClose: null,
  onGuideListChange: null,

}

export default Config
