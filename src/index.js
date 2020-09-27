import initMixin from './guide/core'

function EasyGuide(options = {}) {
  this.init(options)
}

initMixin(EasyGuide)

EasyGuide.Version = '0.0.1'

export default EasyGuide
