const fs = require("fs");
const Router = require('koa-router')
let page = new Router()
page
.get('/404', async ( ctx )=>{
  ctx.body = '404 page!'
})

let data = new Router()
data
.get('/issue', async ctx => {
  let path = './static/data-issues.json'
  var data = fs.readFileSync(path);
  ctx.body = {
    rows: JSON.parse(data),
    success: true
  }
})

let router = new Router()
router.use('/data', data.routes(), data.allowedMethods())
.use('/views', page.routes(), page.allowedMethods())
.redirect('/', '/views/home/index.html')
.redirect('/backstage', '/views/backstage/index.html')
.redirect('/login', '/views/login/index.html')

module.exports = {
  registerAPI: function (app) {
    app.use(router.routes()).use(router.allowedMethods())
  }
}
