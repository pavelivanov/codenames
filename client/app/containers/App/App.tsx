import React, { useEffect } from 'react'
import { useReducerState } from 'hooks'
import cookie from 'js-cookie'
import socket from 'socket'

import Auth from 'containers/Auth/Auth'

import './sanitize.scss'
import './App.scss'
// import './animate.css'


const App = ({ children }) => {
  const playername = cookie.get('playername')
  const [ { isFetching, isLoggedIn }, setState ] = useReducerState({ isFetching: playername, isLoggedIn: false })

  useEffect(() => {
    socket.on('game created', () => {
      console.log('GAME CREATED!')
    })

    socket.on('login', () => {
      setState({ isFetching: false, isLoggedIn: true })
    })

    if (playername) {
      socket.emit('add player', playername)
    }
  }, [])

  if (isFetching) {
    return <div>Loading...</div>
  }

  if (!isLoggedIn) {
    return <Auth />
  }

  return children
}


export default App
