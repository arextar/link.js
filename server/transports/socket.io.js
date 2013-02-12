var io

function SocketIO (name) {
	var that = this
	var connections = {}, uid = 0

	io.of('/' + encodeURIComponent(name)).on('connection', function (socket) {
		var id = uid++
		send('__join', [id])
		connections[id] = socket

		function send (event, args) {
			for (var x in connections) {
				if (x != id) connections[x].emit('incoming', id, event, args)
			}
		}

		socket.on('outgoing', send)

		socket.on('targeted', function (user, event, args) {
			if (connections.hasOwnProperty(user))
				connections[user].emit('incoming', id, event, args)
		})
	})
}

SocketIO.init = function (port, name) {
	var server = require('http').createServer()
	server.listen(port, name)
	io = require('socket.io').listen(server)
}

exports['socket.io'] = SocketIO