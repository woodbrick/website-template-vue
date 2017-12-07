module.exports = {
  proxyTable: {
    '/spider': {
      target: 'http://nova:8080',
      changeOrigin: true,
      pathRewrite: {
        '^/spider': '/spider'
      }
    }
  },
  port: 3000
}