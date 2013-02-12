;(function () {
	function SocketIO (name, config) {
		this.socket = io.connect(config.address + '/' + encodeURIComponent(name))
	}

	SocketIO.prototype = {
		listen: function (fn) {
			this.socket.on('incoming', fn)
		},

		emit: function (event, args) {
			this.socket.emit('outgoing', event, args)
		},

		targeted_emit: function (user, event, args) {
			this.socket.emit('targeted', user, event, args)
		}
	}

	SocketIO.supported = function () {
		return 'io' in window
	}

	link.transports['socket.io'] = SocketIO
} ())