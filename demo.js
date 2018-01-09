const events = require('events')
let eventEmmiter = new events.EventEmitter()

let connectHandler = function connected() {
  console.log('connection success')
  eventEmmiter.emit('data')
}

eventEmmiter.on('connection', connectHandler)

eventEmmiter.on('data', function() {
  console.log('data success')
})

eventEmmiter.emit('connection')
console.log('finish')
