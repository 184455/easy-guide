// 开发模式启动测试脚本

const path = require('path')
const colors = require('colors')
const chokidar = require('chokidar')
const shelljs = require('shelljs')
const _ = require('lodash')

const execContent = () => {
  console.log('\n')
  shelljs.exec(`cross-env GUIDE_MODE=develop node ${path.resolve(__dirname, './build.js')}`)
  console.log('Continue file listening...'.green);
}
const _execContent = _.debounce(execContent, 200);

const watcher = chokidar.watch(path.resolve(__dirname, '../', './src'), {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
})

// 监听文件变化，监听除了 ready, raw, and error 之外所有的事件类型
watcher.on('all', (event, path) => {
  _execContent()
})
watcher.on('error', (event) => {
  console.log('err')
})
