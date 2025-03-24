import { GamepadButton } from '../types/gamepad';
import { GamepadMapping } from '../types/remapping';
import { ControllerSVG } from './ControllerSVG';
import { RemappingControls } from './RemappingControls';
import { MappingsList } from './MappingsList';

interface GamepadPairProps {
  gamepadIndex: number;
  originalButtons: GamepadButton[];
  originalAxes: number[];
  remappedButtons: GamepadButton[];
  remappedAxes: number[];
  controllerName: string;
  mapping: GamepadMapping | undefined;
  onAddButtonMapping: (gamepadIndex: number, sourceIndex: number, targetIndex: number) => void;
  onRemoveButtonMapping: (gamepadIndex: number, sourceIndex: number, targetIndex: number) => void;
  onAddAxisMapping: (gamepadIndex: number, sourceIndex: number, targetIndex: number, invert?: boolean) => void;
  onRemoveAxisMapping: (gamepadIndex: number, sourceIndex: number, targetIndex: number) => void;
  onClearMappings: (gamepadIndex: number) => void;
}

export const GamepadPair = ({
  gamepadIndex,
  originalButtons,
  originalAxes,
  remappedButtons,
  remappedAxes,
  controllerName,
  mapping,
  onAddButtonMapping,
  onRemoveButtonMapping,
  onAddAxisMapping,
  onRemoveAxisMapping,
  onClearMappings
}: GamepadPairProps) => {
  return (
    <div className="gamepad-pair">
      <h2 className="controller-name">{controllerName}</h2>

      <div className="controllers-container">
        <div className="controller-wrapper">
          <h3>Original Input</h3>
          <div className="controller-visualization">
            <ControllerSVG
              type="xbox"
              buttons={originalButtons}
              axes={originalAxes}
            />
          </div>
        </div>

        <div className="controller-wrapper">
          <h3>Remapped Input</h3>
          <div className="controller-visualization">
            <ControllerSVG
              type="xbox"
              buttons={remappedButtons}
              axes={remappedAxes}
            />
          </div>
        </div>
      </div>

      <div className="remapping-section">
        <div className="remapping-ui">
          <RemappingControls
            gamepadIndex={gamepadIndex}
            buttons={originalButtons}
            axes={originalAxes}
            onAddButtonMapping={onAddButtonMapping}
            onRemoveButtonMapping={onRemoveButtonMapping}
            onAddAxisMapping={onAddAxisMapping}
            onRemoveAxisMapping={onRemoveAxisMapping}
            onClearMappings={onClearMappings}
          />
        </div>

        <div className="mappings-ui">
          <MappingsList
            gamepadIndex={gamepadIndex}
            mapping={mapping}
          />
        </div>
      </div>
    </div>
  );
};
