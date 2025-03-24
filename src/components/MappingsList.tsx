import { GamepadMapping } from '../types/remapping';
import { getButtonName, getAxisName } from '../types/gamepad';

interface MappingsListProps {
  gamepadIndex: number;
  mapping: GamepadMapping | undefined;
}

export const MappingsList = ({ gamepadIndex, mapping }: MappingsListProps) => {
  if (!mapping || (mapping.buttonMappings.length === 0 && mapping.axisMappings.length === 0)) {
    return (
      <div className="mappings-list">
        <h3>Controller {gamepadIndex + 1} Mappings</h3>
        <p>No mappings configured.</p>
      </div>
    );
  }

  return (
    <div className="mappings-list">
      <h3>Controller {gamepadIndex + 1} Mappings</h3>

      {mapping.buttonMappings.length > 0 && (
        <div className="mapping-group">
          <h4>Button Mappings</h4>
          <ul>
            {mapping.buttonMappings.map((buttonMapping, index) => (
              <li key={index}>
                <div className="mapping-item">
                  <div className="mapping-source">
                    When <strong>{getButtonName(buttonMapping.sourceButtonIndex)}</strong> ({buttonMapping.sourceButtonIndex}) is pressed
                  </div>
                  <div className="mapping-arrow">➡️</div>
                  <div className="mapping-target">
                    <strong>{getButtonName(buttonMapping.targetButtonIndex)}</strong> ({buttonMapping.targetButtonIndex}) gets activated
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {mapping.axisMappings.length > 0 && (
        <div className="mapping-group">
          <h4>Axis Mappings</h4>
          <ul>
            {mapping.axisMappings.map((axisMapping, index) => (
              <li key={index}>
                <div className="mapping-item">
                  <div className="mapping-source">
                    <strong>{getAxisName(axisMapping.sourceAxisIndex)}</strong> ({axisMapping.sourceAxisIndex}) movement
                  </div>
                  <div className="mapping-arrow">➡️</div>
                  <div className="mapping-target">
                    <strong>{getAxisName(axisMapping.targetAxisIndex)}</strong> ({axisMapping.targetAxisIndex}) movement
                    {axisMapping.invert && " (Inverted)"}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
