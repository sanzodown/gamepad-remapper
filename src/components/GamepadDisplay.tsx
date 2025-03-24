import { GamepadButton } from '../types/gamepad'
import { ControllerSVG } from './ControllerSVG'

interface GamepadDisplayProps {
  gamepadIndex: number
  buttons: GamepadButton[]
  axes: number[]
  controllerName: string
}

export const GamepadDisplay = ({
  buttons,
  axes,
  controllerName
}: GamepadDisplayProps) => {
  return (
    <div className="gamepad-display">
      <div className="controller-name">{controllerName}</div>
      <div className="controller-visualization">
        <ControllerSVG
          type="xbox"
          buttons={buttons}
          axes={axes}
        />
      </div>
    </div>
  )
}
