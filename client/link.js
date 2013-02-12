;(function () {
	var config = {}, transports = {}

	function Emitter (mixin) {
		this.events = {}
		if (mixin) {
			for (var x in mixin) this[x] = mixin[x]
		}
	}

	Emitter.prototype = {
		on: function (name, fn) {
			var event
			if (event = this.events[name]) {
				if (typeof event === 'function') {
					this.events[name] = [event, fn]
				}
				else
				{
					this.events[name].push(fn)
				}
			}
			else
			{
				this.events[name] = fn
			}
		},
		emit: function (event, a, b) {
			var length = arguments.length, args

			if (length < 2) args = []
	   		else if (length < 3) args = [a]
	   		else if (length < 4) args = [a, b]
	   		else args = [].slice.call(arguments, 1)

			this._emit(event, this, args)
		},
		_emit: function (event, context, args) {
			if (!this.events.hasOwnProperty(event)) return;
			if (typeof (event = this.events[event]) === 'function') {
				event.apply(context, args)
			}
			else
			{
				for (var i = 0; i < event.length; i++) event[i].apply(context, args)
			}
		}
	}


	function Room (transport) {
		var that = this, users = {}
		this.data = {}
		this.events = {}
		this.transport = transport

		transport.listen(function (id, event, args) {
			var user, id
			if (event === '__join') {
				user = users[args[0]] || (users[args[0]] = new User(args[0], transport))
				user.emit('__set', that.data)
				that._emit('join', user, [users[id]])
			}
			else if (event === '__set') {
				user = users[id] || (users[id] = new User(id, transport))
				if (typeof args[0] === 'object') {
					for (var x in args[0]) user.set(x, args[0][x])
				}
				else
				{
					user.set(args[0], args[1])
				}
			}

			that._emit(event, users[id] || (users[id] = new User(id, transport)), args)
		})
	}

	Room.prototype = new Emitter({
		emit: function (event, a, b) {
			var length = arguments.length, args

			if (length < 2) args = []
	  		else if (length < 3) args = [a]
	   		else if (length < 4) args = [a, b]
	   		else args = [].slice.call(arguments, 1)

			this.transport.emit(event, args)
		},
		set: function (name, value) {
			this.emit('__set', name, value)
			this.data[name] = value
		},
		get: function (name) {
			return this.data[name]
		}
	})


	function User (id, transport) {
		this.id = id
		this.transport = transport
		this.data = {}
		this.events = {}
	}

	User.prototype = new Emitter({
		emit: function (event, a, b) {
			var length = arguments.length, args

			if (length < 2) args = []
	  		else if (length < 3) args = [a]
	   		else if (length < 4) args = [a, b]
	   		else args = [].slice.call(arguments, 1)

	   		this.transport.targeted_emit(this.id, event, args)
		},
		set: function (name, value) {
			this.data[name] = value
		},
		get: function (name) {
			return this.data[name]
		}
	})

	window.link = {
		set: function (name, value) {
			if (name === 'address' && !/ws:/.test(value)) value = 'ws://' + value
			if (value == null) value = true
			config[name] = value
		},
		get: function (name) {
			return config[name]
		},
		transports: transports,

		connect: function (name, fn) {
			if (name === '@page') name = location.pathname
			if (name === '@hash') name = location.hash
			var i, transport

			for (i = 0; i < config.transports.length; i++) {
				if (transports[config.transports[i]].supported()) {
					fn(new Room(new transports[config.transports[i]](name, config)))
					break;
				}
			}

			
		}
	}
} ())