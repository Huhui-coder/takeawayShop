const path = require('path')
const Copy = require('copy-webpack-plugin')

module.exports = {
    configureWebpack: config => {
        config.plugins.push(
          new Copy([{
            from: path.resolve(__dirname, './src/functions'),
            to: path.join(__dirname, 'dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', 'mp-weixin', 'functions')
          }])
          
        )
      }
}