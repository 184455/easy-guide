// 初始化函数

export default function initMixin (EasyGuide) {
  console.log('mixin')
  EasyGuide.prototype._init = function () {
    console.log('I am init function.')
  }
};
