import React, { useContext, useRef, useCallback } from 'react'
import { GameContext, GameStateContext } from '@/helpers/providers'
import { socket, storage } from '@/helpers'


const Team = ({ color, players, player }) => {
  const inputRef = useRef<HTMLInputElement>()

  const handleJoinClick = useCallback(() => {
    const name = inputRef.current.value

    socket.emit('join team', { name, color })
  }, [ color ])

  const handleLeaveClick = useCallback(() => {
    socket.emit('leave team')
  }, [ color ])

  const inTeam = Boolean(players.find(({ id }) => id === player?.id))

  return (
    <div>
      <div>{color}:</div>
      <div>
        {
          players.map(({ id, name }) => (
            <div key={`${id}`}>{name}</div>
          ))
        }
      </div>
      {
        !player && (
          <>
            <input ref={inputRef} />
            <button onClick={handleJoinClick}>JOIN</button>
          </>
        )
      }
      {
        inTeam && (
          <button onClick={handleLeaveClick}>LEAVE</button>
        )
      }
    </div>
  )
}

const Spymaster = ({ player }) => {
  const handleClick = useCallback(() => {
    socket.emit('become spymaster')
  }, [ player ])

  return (
    <button onClick={handleClick}>
      become a spymaster
    </button>
  )
}

const Teams = () => {
  const { player, players } = useContext(GameStateContext)

  const redTeam = players.filter(({ color }) => color === 'red')
  const blueTeam = players.filter(({ color }) => color === 'blue')
  const isSpymasterVisible = player && players.filter((p) => p.color === player.color && p.spymaster).length === 0

  return (
    <div>
      <Team color="red" players={redTeam} player={player} />
      <hr />
      <Team color="blue" players={blueTeam} player={player} />
      {
        isSpymasterVisible && (
          <Spymaster player={player} />
        )
      }
    </div>
  )
}


export default Teams
