import InitMixin from './guide/core/index'
import InitDataInterface from './guide/data-interface'
import InitEvents from './guide/events/index'
import GuideEditModal from './guide/guide-edit-modal/index'

function EasyGuide(options = {}) {
  this.init(options)
}

InitMixin(EasyGuide)
InitDataInterface(EasyGuide)
InitEvents(EasyGuide)
GuideEditModal(EasyGuide)

EasyGuide.prototype.Version = '0.0.1'

export default EasyGuide
