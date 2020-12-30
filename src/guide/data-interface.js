import { removeChild, getElementById } from '../utils/dom'

export default function InitDataInterface (EasyGuide) {
  EasyGuide.prototype.getGuideList = function () {
    return this.guideList
  }
  EasyGuide.prototype.setGuideList = function (list) {
    if (!Array.isArray(list)) throw new Error('GuideList should be Array!')
    this.guideList = [...list]
  }
  EasyGuide.prototype.guideListChange = function (action, data) {
    const { onGuideListChange = () => {} } = this.Options
    const { guideList } = this

    const editItem = guideList.find(i => i.id === data.id) || {}
    onGuideListChange(action, Object.assign(editItem, data), guideList)
    if (action === 'delete') {
      const deleteElement = getElementById(data.id)
      removeChild(deleteElement.parentElement, deleteElement)
    }
  }
  EasyGuide.prototype.dispatch = function (action, data) {
    switch (action) {
      case 'create':
        this.guideList.push(data)
        break
      case 'delete':
        this.guideList = this.guideList.filter(i => String(i.id) !== String(data.id))
        break
      case 'modify':
        this.guideList = this.guideList.map(o => {
          if (String(o.id) === String(data.id)) {
            return Object.assign({}, o, data)
          } else {
            return o
          }
        })
        break
      default:
    }
    this.guideListChange(action, data)
  }
}
