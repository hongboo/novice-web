var proxyConfig = require('./proxy.config');
module.exports = {
  baseUrl: './',
  outputDir: 'novice-web',
  css: {
    loaderOptions: {
      // 引入全局scss
      // sass: {
      //   data: `@import "@/assets/scss/common.scss";`
      // },
      // 引入iconfont
      css: {
        data: `@import "@/assets/fonts/iconfont.css";`
      }
    }
  },
  devServer: {
    // 配置服务器代理
    host: '0.0.0.0',
    port: 9000,
    disableHostCheck: true,
    proxy: proxyConfig
  },
}