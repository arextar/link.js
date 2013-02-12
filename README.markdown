# link.js

This project consists of a client and a server to allow easy connection with other people in a browser. In the future, I hope to write some code to make it compatible with WebRTC because that would be much more practical than running everything through a server, but at the moment I'm having trouble getting together the tools and documentation to do such. Docs will be coming soon, but, in the meantime, here's a sneak peek at what a single page app with link.js and socket.io looks like:

````html
<script src='client/link.js'></script>
<script src='http://192.168.1.40:1338/socket.io/socket.io.js'></script>
<script src='client/transports/socket.io.js'></script>

<canvas width=1000 height=600></canvas>

<script>
// Configuration
link.set('address', '192.168.1.40:1338')
link.set('transports', ['socket.io'])

var canvas = document.querySelector('canvas'), cxt = canvas.getContext('2d')

link.connect('global', function (room) {
	// Set user's color through a prompt
	room.set('clr', prompt('Color?'))

	// Draw a rectangle wherever the canvas is clicked
	canvas.onclick = function (e) {
		var x = e.pageX - canvas.offsetLeft, y = e.pageY - canvas.offsetTop

		cxt.fillStyle = room.get('clr')
		cxt.fillRect(x - 7, y - 7, 14, 14)

		// Send out an event to the other users in the room
		room.emit('draw', x, y)
	}


	room.on('draw', function (x, y) {
		cxt.fillStyle = this.get('clr')
		cxt.fillRect(x - 7, y - 7, 14, 14)
	})
})
</script>
````