module.exports={
    devServer: {
        open: true, //配置自动启动浏览器
        proxy: 'http://localhost:9000' // 配置跨域处理,只有一个代理
    }
}


