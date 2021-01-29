import InitMixin from './guide/core/index'
import Distribute from './guide/distribute/index'
import InitEvents from './guide/events/index'
import GuideEditModal from './guide/guide-edit-modal/index'
function EasyGuide(options = {}) {
  this.init(options)
}

InitMixin(EasyGuide)
Distribute(EasyGuide)
InitEvents(EasyGuide)
GuideEditModal(EasyGuide)

EasyGuide.prototype.Version = '0.0.6'

export default EasyGuide
