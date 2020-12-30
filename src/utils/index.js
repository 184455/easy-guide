// 全局公共方法
import Config from '../config/index'

/**
 * 创建一个 guide 所必须拥有的字段
 * @param {object} data 初始化数据
 */
export function createGuideItemData (initVal) {
  return mergeObj({
    id: String((new Date()).getTime()),
    content: '',
    width: 300,
    widthUtil: '%',
    height: 120,
    heightUtil: '%',
    left: 500,
    leftUtil: '%',
    top: 200,
    topUtil: '%',
    orderNumber: 1,
    fixFlag: 'N'
  }, initVal)
}

/**
 * 找到数据中最大的某项数据
 * @param {array} list 列表数据
 * @param {string} field 比较的字段
 * @return {number} 列表里面最大的数
 */
export function getMaxNumber(list, field) {
  let res = 0
  list.forEach(item => {
    if (Number(item[field]) > res) {
      res = Number(item[field])
    }
  })
  return res
}

/**
 * 检测是否是非空数组
 * @param {array} arr - 检测数组
 * @returns {boolean}
 */
export function isEmptyArray(arr) {
  if (!Array.isArray(arr)) {
    return true
  }
  return arr.length === 0
}

/**
 * 合同用户的配置
 * @param {object} options 用户传入的配置项
 */
export function mergeCustomOptions(options) {
  return mergeObj({}, Config, options)
}

/**
 * 对象合并
 */
export function mergeObj() {
  return Object.assign.apply(this, arguments)
}
