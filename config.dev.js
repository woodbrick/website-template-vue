module.exports = {
  proxyTable: {
    '/nova': {
      target: 'http://dev.tzzb.cetccity.com',
      changeOrigin: true,
      pathRewrite: {
        '^/nova': '/nova'
      }
    }
  },
  port: 8080
}
