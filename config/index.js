'use strict'
// Template version: 1.2.6
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

const env = require('./' + process.env.env_config + '.env')
let rootPath = path.resolve(__dirname, '../dist')
if (env.NGINX_PATH) {
  rootPath = env.NGINX_PATH.replace(/\"/g, '')
}
const buildIndex = path.resolve(rootPath, 'index.html')
const buildAssetsRoot = rootPath

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        // 这里是公共部分，在调用接口时后面接不相同的部分，/api就相当于http://192.168.0.199:8926/api这一段
        target: 'http://192.168.1.61:8075/', // 这里写的是访问接口的域名和端口号
        changeOrigin: true, // 必须加上这个才能跨域请求
        pathRewrite: {
          // 重命名
          '^/api': '/api'
        },
        headers: {
          'x-rule': env.RULE.replace('"', '').replace('"', '')
        }
      }
    },

    // Various Dev Server settings

    // can be overwritten by process.env.HOST
    // if you want dev by ip, please set host: '0.0.0.0'
    host: '127.0.0.1',
    port: 9527, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: false,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-source-map',

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  },

  build: {
    // Template for index.html
    // index: path.resolve(__dirname, '../dist/index.html'),
    index: buildIndex,

    // Paths
    // assetsRoot: path.resolve(__dirname, '../dist'),
    assetsRoot: buildAssetsRoot,
    assetsSubDirectory: 'static',

    /**
     * You can set by youself according to actual condition
     * You will need to set this if you plan to deploy your site under a sub path,
     * for example GitHub pages. If you plan to deploy your site to https://foo.github.io/bar/,
     * then assetsPublicPath should be set to "/bar/".
     * In most cases please use '/' !!!
     */
    assetsPublicPath: '/ss-web/',

    /**
     * Source Maps
     */
    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: 'source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build:prod --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report || false,

    // `npm run build:prod --generate_report`
    generateAnalyzerReport: process.env.npm_config_generate_report || false
  }
}
