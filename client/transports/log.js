;(function () {
	var uid = 0, cache = {}
	function Log (name, config) {
		this.name = name
		console.log('Starting log in room ' + name + ' with config:', JSON.stringify(config))
	}

	Log.prototype = {
		listen: function (fn) {
			console.log('Bind function', fn, 'to listen on', this.name)
		},

		emit: function (name, arguments) {
			console.log('Emit', name, 'with arguments', arguments, 'on', this.name)
		},

		targeted_emit: function (user, name, arguments) {
			console.log('Emit', name, 'with arguments', arguments, 'on', this.name, 'to user', user)
		}
	}

	Log.supported = function () {
		return 'console' in window
	}

	link.transports.log = Log
} ())