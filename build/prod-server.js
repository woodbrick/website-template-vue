require('./check-versions')()
let path = require('path')
let config = require('../config')
let runTimeConfig = require('../config.runtime')
let proxyTable = runTimeConfig.proxyTable
let express = require('express');
let app = express();
let proxyMiddleware = require('http-proxy-middleware')

// serve pure static assets
let staticPath = path.posix.join(config.build.assetsRoot, config.build.assetsSubDirectory)
app.use('/static', express.static(staticPath))

let _resolve
let readyPromise = new Promise(resolve => {
  _resolve = resolve
})
console.log('> Starting prod server...')

app.get('/',  function(req, res) {
  res.sendFile(path.join(config.build.assetsRoot, 'pages/home/index.html'));
});
app.get('/admin',  function(req, res) {
  res.sendFile(path.join(config.build.assetsRoot, 'pages/backstage/index.html'));
});
app.get('/login',  function(req, res) {
  res.sendFile(path.join(config.build.assetsRoot, 'pages/login/index.html'));
});

// default port where dev server listens for incoming traffic
let port = runTimeConfig.port
let server = app.listen(port)

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

console.log('> listening port:' + port)
module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
