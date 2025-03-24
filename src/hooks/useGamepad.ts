import { useEffect, useState } from 'react'
import { GamepadButton } from '../types/gamepad'

interface GamepadState {
  buttons: GamepadButton[]
  axes: number[]
  name: string
}

type GamepadStates = Record<number, GamepadState>

export const useGamepads = () => {
  const [gamepads, setGamepads] = useState<GamepadStates>({})

  useEffect(() => {
    let animationFrameId: number

    const updateGamepads = () => {
      const connectedGamepads = navigator.getGamepads()
      const updatedGamepads: GamepadStates = {}

      for (const gamepad of connectedGamepads) {
        if (gamepad) {
          updatedGamepads[gamepad.index] = {
            buttons: Array.from(gamepad.buttons),
            axes: Array.from(gamepad.axes),
            name: gamepad.id
          }
        }
      }

      setGamepads(updatedGamepads)
      animationFrameId = requestAnimationFrame(updateGamepads)
    }

    window.addEventListener('gamepadconnected', updateGamepads)
    window.addEventListener('gamepaddisconnected', updateGamepads)
    updateGamepads()

    return () => {
      window.removeEventListener('gamepadconnected', updateGamepads)
      window.removeEventListener('gamepaddisconnected', updateGamepads)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return gamepads
}
