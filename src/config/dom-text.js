/**
 * 页面 DOM 的字符串标示
 * @author Abner <xiaocao1602@qq.com>
 * @date 2021/01/01
 */
import Constant from './constant'

const {
  MODE, dataSet, PreviewBtn, OperationBarDrag,
  PrevBtnName, NextBtnName, DeleteBtn, EditBtn, ViewCloseBtn, DragGuide, ExitPreview
} = Constant

const POS = ['top', 'right', 'bottom', 'left']

export function getOperationBarDomText () {
  return `
    <div id="_eG_operation-bar">
      <div ${dataSet('_eg-guide-1')}>
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16149" width="200" height="200"><path d="M93.0816 69.8368a23.296 23.296 0 0 0-23.2448 23.2448v837.8368c0 12.8 10.3936 23.2448 23.2448 23.2448h837.8368a23.296 23.296 0 0 0 23.2448-23.2448V93.0816a23.296 23.296 0 0 0-23.2448-23.2448H93.0816zM930.9184 0C982.3232 0 1024 41.6768 1024 93.0816v837.8368A93.0816 93.0816 0 0 1 930.9184 1024H93.0816A93.0816 93.0816 0 0 1 0 930.9184V93.0816C0 41.6768 41.6768 0 93.0816 0h837.8368z m-403.6608 251.392a34.9184 34.9184 0 0 0-34.9184 34.9184L492.288 476.16H302.5408a34.9184 34.9184 0 0 0-34.5088 29.7472l-0.4096 5.12c0 19.3536 15.6672 34.9696 34.9184 34.9696l189.7472-0.0512v189.7984c0 17.5616 12.9536 32.0512 29.7984 34.56l5.12 0.3584a34.9184 34.9184 0 0 0 34.9184-34.9184v-189.7984h189.7984a34.9184 34.9184 0 0 0 34.56-29.696l0.3584-5.1712a34.9184 34.9184 0 0 0-34.9184-34.9184H562.176V286.3104a34.9184 34.9184 0 0 0-29.696-34.5088z" fill="#ff8a2b" p-id="16150"></path></svg>
        <span>添加指导</span>
      </div>
      <div ${dataSet(PreviewBtn)}>
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7298" width="200" height="200"><path d="M703.956003 63.996a31.998 31.998 0 1 1 0-63.996h186.932316C964.419724 0 1023.936004 59.51628 1023.936004 133.047685V319.980001a31.998 31.998 0 1 1-63.996 0V133.047685C959.940004 94.906068 929.029936 63.996 890.888319 63.996H703.956003z m255.984001 624.792951a31.998 31.998 0 1 1 63.996 0v202.099368C1023.936004 964.419724 964.419724 1023.936004 890.888319 1023.936004h-126.328104a31.998 31.998 0 1 1 0-63.996h126.328104c38.141616 0 69.051684-30.910068 69.051685-69.051685v-202.099368zM335.147053 959.940004a31.998 31.998 0 1 1 0 63.996H133.047685A133.047685 133.047685 0 0 1 0 890.888319V703.956003a31.998 31.998 0 1 1 63.996 0v186.932316C63.996 929.029936 94.906068 959.940004 133.047685 959.940004h202.099368zM63.996 319.980001a31.998 31.998 0 0 1-63.996 0V133.047685C0 59.51628 59.51628 0 133.047685 0H319.980001a31.998 31.998 0 0 1 0 63.996H133.047685C94.906068 63.996 63.996 94.906068 63.996 133.047685V319.980001zM511.968002 671.958003c109.625148 0 211.634773-56.892444 308.332729-175.989001C723.602775 376.872445 621.59315 319.980001 511.968002 319.980001c-109.625148 0-211.634773 56.892444-308.332729 175.989001C300.333229 615.065558 402.342854 671.958003 511.968002 671.958003z m0 63.996c-130.615837 0-249.968377-66.55584-357.993625-199.667521a63.996 63.996 0 0 1 0-80.63496C261.999625 322.539841 381.352165 255.984001 511.968002 255.984001c130.615837 0 249.968377 66.55584 357.993625 199.667521a63.996 63.996 0 0 1 0 80.63496C761.936379 669.398163 642.583839 735.954003 511.968002 735.954003z" fill="#ff8a2b" p-id="7299"></path><path d="M511.968002 575.964002a79.995 79.995 0 1 0 0-159.99A79.995 79.995 0 0 0 511.968002 575.964002z m0 63.996a143.991001 143.991001 0 1 1 0-287.982001A143.991001 143.991001 0 0 1 511.968002 639.960002z" fill="#ff8a2b" p-id="7300"></path></svg>
        <span>预览指导</span>
      </div>
      <div class="${OperationBarDrag}" ${dataSet(OperationBarDrag)}>
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="18379" width="200" height="200"><path d="M887.466667 0m34.133333 0l0 0q34.133333 0 34.133333 34.133333l0 136.533334q0 34.133333-34.133333 34.133333l0 0q-34.133333 0-34.133333-34.133333l0-136.533334q0-34.133333 34.133333-34.133333Z" p-id="18380" fill="#ff8a2b"></path><path d="M477.866667 819.2m34.133333 0l0 0q34.133333 0 34.133333 34.133333l0 136.533334q0 34.133333-34.133333 34.133333l0 0q-34.133333 0-34.133333-34.133333l0-136.533334q0-34.133333 34.133333-34.133333Z" p-id="18381" fill="#ff8a2b"></path><path d="M68.266667 682.666667m34.133333 0l0 0q34.133333 0 34.133333 34.133333l0 273.066667q0 34.133333-34.133333 34.133333l0 0q-34.133333 0-34.133333-34.133333l0-273.066667q0-34.133333 34.133333-34.133333Z" p-id="18382" fill="#ff8a2b"></path><path d="M887.466667 546.133333m34.133333 0l0 0q34.133333 0 34.133333 34.133334l0 409.6q0 34.133333-34.133333 34.133333l0 0q-34.133333 0-34.133333-34.133333l0-409.6q0-34.133333 34.133333-34.133334Z" p-id="18383" fill="#ff8a2b"></path><path d="M477.866667 0m34.133333 0l0 0q34.133333 0 34.133333 34.133333l0 409.6q0 34.133333-34.133333 34.133334l0 0q-34.133333 0-34.133333-34.133334l0-409.6q0-34.133333 34.133333-34.133333Z" p-id="18384" fill="#ff8a2b"></path><path d="M68.266667 0m34.133333 0l0 0q34.133333 0 34.133333 34.133333l0 273.066667q0 34.133333-34.133333 34.133333l0 0q-34.133333 0-34.133333-34.133333l0-273.066667q0-34.133333 34.133333-34.133333Z" p-id="18385" fill="#ff8a2b"></path><path d="M512 750.933333a102.4 102.4 0 1 1 0-204.8 102.4 102.4 0 0 1 0 204.8zM102.4 614.4a102.4 102.4 0 1 1 0-204.8 102.4 102.4 0 0 1 0 204.8z" p-id="18386" fill="#ff8a2b"></path><path d="M921.6 375.466667m-102.4 0a102.4 102.4 0 1 0 204.8 0 102.4 102.4 0 1 0-204.8 0Z" p-id="18387" fill="#ff8a2b"></path></svg>
        <span>调整位置</span>
      </div>
      <div class="_eg_close" ${dataSet('guide-close-btn')}>关闭</div>
    </div>
  `
}

export function getGuideItemDomText (guideItem, mode) {
  const { id, position, width, height, left, top } = guideItem
  const dots = POS
    .map(o => `<div class="e_dot-${o} e_dot-common" ${dataSet(`e_dot-${o}`)}></div>`)
    .join('')

  const styles = `position: ${position}; width: ${width}px; height: ${height}px; left: ${left}px; top: ${top}px;`

  return `
    <div id="${id}" class="e_guide-item" ${dataSet(DragGuide)} style="${styles}">
      ${dots}
      ${getContentBoxDomText(guideItem, mode)}
    </div>
  `
}

export function getGuideViewDomText (guideItem, mode) {
  const barList = (['top', 'left', 'right', 'bottom'])
    .map(i => `<div class="bar-lib-${i} bar-lib-common"></div>`)
    .join('')

  return barList + getContentBoxDomText(guideItem, mode)
}

export function exitPreview (flag) {
  return flag ? `<div ${dataSet(ExitPreview)} class="_eg-exit-preview">退出预览</div>` : ''
}

function getContentBoxDomText (guideItem, mode) {
  const { contentPosition, orderNumber, content } = guideItem
  const position = mode === MODE.MAINTAIN ? ' ' + contentPosition : ''
  const btn = mode === MODE.MAINTAIN
    ? [DeleteBtn, '删除', EditBtn, '编辑']
    : [PrevBtnName, '上一步', NextBtnName, '关闭']

  return `
    <div class="e_guide-content${position}">
      <div class="e_guide-content-title">
        <div class="e_guide-title-text">步骤${orderNumber}</div>
        <div class="e_guide-close" ${dataSet(ViewCloseBtn)}>&#10005;</div>
      </div>
      <div class="e_guide-content-text">${content || '请维护用户指导内容！'}</div>
      <div class="e_guide-content-btn">
        <button class="e_prev-btn" ${dataSet(btn[0])}>${btn[1]}</button>
        <button class="e_next-btn" ${dataSet(btn[2])}>${btn[3]}</button>
      </div>
    </div>
  `
}
