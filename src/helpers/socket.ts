import { io } from 'socket.io-client'


const endpoint = process.env.NODE_ENV === 'production' ? '//codenames.wtf/' : '//local.codenames.wtf:3007/'
const socket = io(endpoint)

socket.on('disconnect', () => {
  console.log('you have been disconnected')
})

socket.on('reconnect', () => {
  console.log('you have been reconnected')
})

socket.on('reconnect_error', () => {
  console.log('attempt to reconnect has failed')
})


export default socket
