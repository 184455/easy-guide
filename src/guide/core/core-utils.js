/**
 * CoreUtils
 * 模块的工具方法
 * @author Abner <xiaocao1602@qq.com>
 * @date 2021/01/01
 */
import Config from '@/config/index'
import Constant from '@/config/constant'
import { getOperationBarDomText } from '@/config/dom-text'
import { isEmptyArray, assign, getWindowWidthHeight, PX } from '@/utils/index'
import {
  addClass, deleteClass, setStyles, getMaintainRoot, hasMaintainRoot,
  createMaintainRoot, hasViewRoot
} from '@/utils/dom'

const { MODE } = Constant

export function initMode (_this, m) {
  setMode(_this, m)
  setStatus(_this, m)
  if (MODE.MAINTAIN === m) {
    showModeMaintain(_this)
  } else {
    _this.dispatch('initViewRender')
  }
}

export function initDefaultData (_this) {
  const { mode, guideList = [], currentIndex = 0 } = _this.Options

  _this.mode = mode
  _this.previewBack = ''
  _this.guideList = guideList.slice(0)
  _this.currentIndex = currentIndex
  _this.mouseEventTempData = null
  _this.mouseEventTarget = null
}

export function initViewport(_this) {
  const [vw, vh] = getWindowWidthHeight()
  _this.windowWidth = vw
  _this.windowHeight = vh
}

export function mergeCustomOptions(_this, options) {
  _this.Options = assign({}, Config, options)
}

export function checkMode (m) {
  if (!MODE[m]) {
    throw new Error('Mode 是一个枚举类型：[READ, MAINTAIN]')
  }
}

export function handleBodyClassName () {
  addClass(document.body, '_eG_body')
}

export function removeBodyClassName () {
  deleteClass(document.body, '_eG_body')
}

export function showFlag (_this, m) {
  if (m === MODE.READ && isEmptyArray(_this.guideList)) { return false }
  return !(hasMaintainRoot() || hasViewRoot())
}

/* --------------------------- Private function ---------------------------------------- */

function showModeMaintain(_this) {
  createMaintainRoot()
  setMaintainRootWidthHeight(_this)
  createOperationBar()
  _this.dispatch('initRender')
}

function setMode(_this, m) {
  _this.mode = m
}

function setStatus(_this, m) {
  _this.status = m
}

function createOperationBar () {
  const domText = getOperationBarDomText()
  getMaintainRoot().insertAdjacentHTML('afterbegin', domText)
}

function setMaintainRootWidthHeight (_this) {
  const { windowWidth, windowHeight } = _this
  setStyles(getMaintainRoot(), { height: PX(windowHeight), width: PX(windowWidth) })
}
