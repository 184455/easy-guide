// 全局公共方法

/**
 * 创建一个 guide 所必须拥有的字段
 * @param {object} data 初始化数据
 */
export function createGuideItemData (initVal) {
  return Object.assign({
    id: (new Date()).getTime(),
    content: '',
    width: '',
    widthUtil: '%',
    height: '',
    heightUtil: '%',
    left: '',
    leftUtil: '%',
    top: '',
    topUtil: '%',
    orderNumber: 1,
    fixFlag: 'N'
  }, initVal)
}

// 生成一个默认的选项
export function defaultPosition (windowWidth) {
  return {
    left: (windowWidth / 2 - 150) | 0,
    top: 200,
    width: 300,
    height: 120,
    id: String((new Date()).getTime())
  }
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
