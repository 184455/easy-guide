import initMixin from './guide/core'
import initDataInterface from './guide/data-interface'
import initEvents from './guide/events'

function EasyGuide(options = {}) {
  this.init(options)
  this.initEvents()
}

initMixin(EasyGuide)
initDataInterface(EasyGuide)
initEvents(EasyGuide)

EasyGuide.prototype.Version = '0.0.1'

export default EasyGuide
