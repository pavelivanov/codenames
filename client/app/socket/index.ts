import io from 'socket.io-client'
import cookie from 'js-cookie'


const endpoint = process.env.NODE_ENV === 'production' ? 'http://codenames.wtf/' : 'http://localhost:3007/'
const socket = io(endpoint)

socket.on('disconnect', () => {
  console.log('you have been disconnected')
})

socket.on('reconnect', () => {
  console.log('you have been reconnected')

  const playername = cookie.get('playername')

  if (playername) {
    socket.emit('add player', playername)
  }
})

socket.on('reconnect_error', () => {
  console.log('attempt to reconnect has failed')
})


export default socket
