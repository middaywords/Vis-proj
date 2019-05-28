// 通过调用babel在Node.js中使用import/export
require('babel-register') ({
    presets: [ 'env' ]
})

module.exports = require('./app.js')