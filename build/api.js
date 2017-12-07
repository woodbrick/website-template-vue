const fs = require("fs");

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
      let path = './static/data-issues.json'
      let dataStr = ''
      let readerStream = fs.createReadStream(path);
      readerStream.setEncoding('UTF8')
      readerStream.on('data', function(chunk) {
        dataStr += chunk
      })
      readerStream.on('end', function() {
        let rows = JSON.parse(dataStr)
        res.send({
          rows: rows,
          total: rows.length
        })
      });
    })
  }
}
