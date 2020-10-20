import { canvasPainting } from '../utils/dom'

export default function initDataInterface (EasyGuide) {
  EasyGuide.prototype.getGuideList = function () {
    return this.guideList
  }
  EasyGuide.prototype.setGuideList = function (list) {
    if (!Array.isArray(list)) throw new Error('GuideList should be Array!')
    this.guideList = [...list]
  }
  EasyGuide.prototype.guideListChange = function (action, data) {
    const { onGuideListChange = () => {} } = this.Options
    const { windowWidth, windowHeight, guideList, EasyGuideCanvasContext } = this

    onGuideListChange(action, data, this.guideList)
    canvasPainting(EasyGuideCanvasContext, undefined, { windowWidth, windowHeight }, guideList)
    if (action === 'delete') {
      const deleteElement = document.getElementById(data.id)
      deleteElement.parentElement.removeChild(deleteElement)
    }
  }
  EasyGuide.prototype.refresh = function () {}
  EasyGuide.prototype.dispatch = function (action, data) {
    switch (action) {
      case 'create':
        this.guideList.push(data)
        break
      case 'delete':
        this.guideList = this.guideList.filter(i => i.id !== data.id)
        break
      case 'modify':
        this.guideList = this.guideList.map(o => {
          if (o.id === data.id) {
            return data
          }
          return o
        })
        break
      default:
    }
    this.guideListChange(action, data)
  }
}
