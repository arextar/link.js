function load_transport (name) {
	return require('./transports/' + name + '.js')[name]
}

var io = load_transport('socket.io')

io.init(1338)

var room = new io('global')