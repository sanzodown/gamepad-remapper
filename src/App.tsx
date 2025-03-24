import { useGamepads } from './hooks/useGamepad'
import { useRemapping } from './hooks/useRemapping'
import { GamepadPair } from './components/GamepadPair'

const App = () => {
  const gamepads = useGamepads()
  const {
    mappings,
    addButtonMapping,
    removeButtonMapping,
    addAxisMapping,
    removeAxisMapping,
    clearMappings,
    applyMappings
  } = useRemapping()

  return (
    <div className="app">
      {Object.entries(gamepads).length === 0 ? (
        <div className="waiting-message">
          Please connect a controller and press any button to start
        </div>
      ) : (
        Object.entries(gamepads).map(([index, gamepad]) => {
          const gamepadIndex = parseInt(index)
          const { remappedButtons, remappedAxes } = applyMappings(
            gamepadIndex,
            gamepad.buttons,
            gamepad.axes
          )

          return (
            <GamepadPair
            key={index}
              gamepadIndex={gamepadIndex}
              originalButtons={gamepad.buttons}
              originalAxes={gamepad.axes}
              remappedButtons={remappedButtons}
              remappedAxes={remappedAxes}
            controllerName={gamepad.name}
              mapping={mappings[gamepadIndex]}
              onAddButtonMapping={addButtonMapping}
              onRemoveButtonMapping={removeButtonMapping}
              onAddAxisMapping={addAxisMapping}
              onRemoveAxisMapping={removeAxisMapping}
              onClearMappings={clearMappings}
          />
          )
        })
      )}
    </div>
  )
}

export default App
