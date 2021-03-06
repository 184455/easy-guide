const fs = require('fs')
const path = require('path')
const rollup = require('rollup')
const colors = require('colors')
const version = require('../package.json').version
const alias = require('rollup-plugin-alias')
const babel = require('rollup-plugin-babel')
const uglify = require('uglify-js')
const zlib = require('zlib')

const banner =
  '/*!\n' +
  ' * Easy Guide v' + version + '\n' +
  ' * (c) 2020-' + new Date().getFullYear() + ' Abner\n' +
  ' * Released under the MIT License.\n' +
  ' */'

const aliasConfig = alias({
  resolve: ['.jsx', '.js'],
  entries:[
    {find:'@', replacement: resolve('src')},
  ]
})

// 平时开发的时候，只需要打包 esm 格式的文件，发布 mpm 包的时候，所有格式都需要
const builds = [{
  entry: resolve('src/index.js'),
  dest: resolve('dist/easy-guide.esm.js'),
  format: 'es',
  moduleName: 'EasyGuide',
  plugins: [
    aliasConfig,
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ],
  banner
}]

if (process.env.GUIDE_MODE === 'product') {
  builds.push({
    entry: resolve('src/index.js'),
    dest: resolve('dist/easy-guide.js'),
    format: 'umd',
    moduleName: 'EasyGuide',
    plugins: [
      aliasConfig,
      babel({
        exclude: 'node_modules/**' // only transpile our source code
      })
    ],
    banner
  })

  // TODO 支持压缩版本
  // {
  //   entry: resolve('src/index.js'),
  //   dest: resolve('dist/easy-guide.min.js'),
  //   format: 'umd',
  //   moduleName: 'EasyGuide',
  //   plugins: [
      // aliasConfig,
      // babel({
  //       exclude: 'node_modules/**' // only transpile our source code
  //     })
  //   ],
  //   banner
  // }
}

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist')
}

function resolve(p) {
  return path.resolve(__dirname, '../', p)
}

function copyCSS() {
  fs.copyFile(resolve('./src/index.css'), resolve('./dist/easy-guide.css'), function (err) {
    if(err) console.log('CSS Copy Fail !'.red)
  })
}

/**
 * CSS 样式暂时复制到 /dist
 * 
 * TODO: 把 CSS 文件加入 rollup 打包文件
 */
copyCSS()

function build(builds) {
  let built = 0
  const total = builds.length
  const next = () => {
    buildEntry(builds[built]).then(() => {
      built++
      if (built < total) {
        next()
      }
    }).catch(logError)
  }

  next()
}

function buildEntry(config) {
  const isProd = /min\.js$/.test(config.dest)
  return rollup.rollup(config).then((bundle) => {
    const code = bundle.generate(config).code
    if (isProd) {
      var minified = (config.banner ? config.banner + '\n' : '') + uglify.minify(code, {
          output: {
            ascii_only: true
          },
          compress: {
            pure_funcs: ['makeMap']
          }
        }).code
      return write(config.dest, minified, true)
    } else {
      return write(config.dest, code)
    }
  }).catch(logError)
}

function write(dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report(extra) {
      console.log(blue(path.relative(process.cwd(), dest)) + ' ' + getSize(code) + (extra || ''))
      resolve()
    }

    fs.writeFile(dest, code, (err) => {
      if (err) {
        return reject(err)
      }
      if (zip) {
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err)
          report(' (gzipped: ' + getSize(zipped) + ')')
        })
      } else {
        report()
      }
    })
  })
}

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function blue(str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}

function logError(e) {
  console.log(e)
}

build(builds)