import initMixin from './guide/core'

import { warn } from './utils/debug'

function EasyGuide(el, options) {
  this.wrapper = typeof el === 'string' ? document.querySelector(el) : el
  if (!this.wrapper) {
    warn('Can not resolve the wrapper DOM.')
  }

  this._init(el, options)
}

initMixin(EasyGuide)

EasyGuide.Version = '0.0.1'

export default EasyGuide

