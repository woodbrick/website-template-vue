module.exports = {
  proxyTable: {
    '/spider': {
      target: 'http://192.168.1.121:30003',
      changeOrigin: true,
      pathRewrite: {
        '^/spider': '/spider'
      }
    }
  },
  port: 8080
}