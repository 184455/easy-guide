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
    onGuideListChange(action, data, this.guideList)
  }
  EasyGuide.prototype.refresh = function () {}
  EasyGuide.prototype.dispatch = function (action, data) {
    switch (action) {
      case 'create':
        this.guideList.push(data)
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
