import React, { useRef, useEffect, useCallback, Fragment } from 'react'
import { useParams } from 'react-router-dom'
import { request } from 'helpers'
import { useReducerState } from 'hooks'
import cookie from 'js-cookie'
import socket from 'socket'
import cx from 'classnames'

import s from './Auth.scss'


const Auth = ({ playerNameTaken, onError }) => {
  const { gameId } = useParams()
  const inputRef = useRef<HTMLInputElement>()

  const [ state, setState ] = useReducerState<{ playerName: string, errored: boolean }>({
    playerName: cookie.get('playerName') || '',
    errored: playerNameTaken,
  })

  const { playerName, errored } = state

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const handleChange = useCallback((event) => {
    setState({
      playerName: event.target.value,
      errored: false,
    })
  }, [ errored ])

  const handleSubmit = useCallback((event) => {
    event.preventDefault()

    request.get('/check-name-taken', {
      params: {
        gameId,
        name: playerName,
      },
    })
      // @ts-ignore
      .then(({ taken }) => {
        if (!taken) {
          const playerColor = cookie.get('playerColor')

          cookie.set('playerName', playerName)
          socket.emit('join game', { gameId, name: playerName, color: playerColor })
        }
        else {
          setState({ errored: true })
        }
      })
      .catch((err) => {
        onError(err)
      })
  }, [ playerName ])

  return (
    <Fragment>
      <div className={s.auth}>
        <form className={s.content} onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className={cx(s.input, { [s.errored]: errored })}
            value={playerName}
            type="text"
            placeholder="Player name"
            onChange={handleChange}
          />
          {
            errored && (
              <div className={s.error}>This name is taken by other player. Try another</div>
            )
          }
        </form>
      </div>
      <div className={s.footer}>
        <div className={s.tips}>* the name will be saved for next games</div>
      </div>
    </Fragment>
  )
}


export default Auth
