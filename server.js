const express = require('express')
const env = require('dotenv').config()
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid');

const peerPort = process.env.PEERPORT || 3001
const { PeerServer } = require('peer');
const peerServer = PeerServer({ port: peerPort, path: '/' });

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
	res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
	res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
	socket.on('join-room', (roomId, userId) => {
		socket.join(roomId)
		socket.to(roomId).broadcast.emit('user-connected', userId)
		
		socket.on('disconnect', () => {
			socket.to(roomId).broadcast.emit('user-disconnected', userId)
		})
	})
})



const port = process.env.PORT || 3000;
server.listen(port, () =>  console.log('server started on ' + port))