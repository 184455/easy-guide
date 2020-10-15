import initMixin from './guide/core'
import initEvents from './guide/events'

function EasyGuide(options = {}) {
  this.init(options)
  this.initEvents()
}

initMixin(EasyGuide)
initEvents(EasyGuide)

EasyGuide.prototype.Version = '0.0.1'

export default EasyGuide
