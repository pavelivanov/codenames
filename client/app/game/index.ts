import React, { useContext } from 'react'


export type GameState = Game & {
  me: Player
}

export const GameStateContext = React.createContext<GameState>(null)
export const GameDispatchContext = React.createContext<(state: Partial<GameState>) => void>(null)

export const useGameState = () => useContext(GameStateContext)
export const useGameDispatch = () => useContext(GameDispatchContext)
