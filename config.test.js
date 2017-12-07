module.exports = {
  proxyTable: {
    '/spider': {
      target: 'http://test.tzzb.cetccity.com',
      changeOrigin: true,
      pathRewrite: {
        '^/spider': '/spider'
      }
    }
  },
  port: 3000
}
