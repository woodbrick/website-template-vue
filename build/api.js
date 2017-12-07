module.exports = {
  registerAPI: function (app) {
    app.get('/', function (req, res) {
      res.redirect('/views/home/index.html')
    })
    app.get('/login', function (req, res) {
      res.redirect('/views/login/index.html')
    })
    app.get('/admin', function (req, res) {
      res.redirect('/views/backstage/index.html')
    })
    app.get('/data/issue', function (req, res) {
      res.redirect('/static/data-issues.json')
    })
  }
}
