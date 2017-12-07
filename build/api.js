module.exports = {
  registerAPI: function (app) {
    app.get('/', function (req, res) {
      res.redirect('/pages/home/index.html')
    })
    app.get('/login', function (req, res) {
      res.redirect('/pages/login/index.html')
    })
    app.get('/admin', function (req, res) {
      res.redirect('/pages/backstage/index.html')
    })
  }
}
