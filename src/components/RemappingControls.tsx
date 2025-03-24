import { useState, useEffect } from 'react';
import { GamepadButton, getButtonName, getAxisName } from '../types/gamepad';

interface RemappingControlsProps {
  gamepadIndex: number;
  buttons: GamepadButton[];
  axes: number[];
  onAddButtonMapping: (gamepadIndex: number, sourceIndex: number, targetIndex: number) => void;
  onRemoveButtonMapping: (gamepadIndex: number, sourceIndex: number, targetIndex: number) => void;
  onAddAxisMapping: (gamepadIndex: number, sourceIndex: number, targetIndex: number, invert?: boolean) => void;
  onRemoveAxisMapping: (gamepadIndex: number, sourceIndex: number, targetIndex: number) => void;
  onClearMappings: (gamepadIndex: number) => void;
}

export const RemappingControls = ({
  gamepadIndex,
  buttons,
  axes,
  onAddButtonMapping,
  onRemoveButtonMapping,
  onAddAxisMapping,
  onRemoveAxisMapping,
  onClearMappings
}: RemappingControlsProps) => {
  const [selectedSourceType, setSelectedSourceType] = useState<'button' | 'axis'>('button');
  const [selectedSourceIndex, setSelectedSourceIndex] = useState<number | null>(null);
  const [selectedTargetType, setSelectedTargetType] = useState<'button' | 'axis'>('button');
  const [selectedTargetIndex, setSelectedTargetIndex] = useState<number | null>(null);
  const [invertAxis, setInvertAxis] = useState(false);
  const [pressedButtons, setPressedButtons] = useState<Set<number>>(new Set());
  const [activatedAxes, setActivatedAxes] = useState<Set<number>>(new Set());
  const [listeningMode, setListeningMode] = useState<'source' | 'target' | null>(null);

  useEffect(() => {
    const newPressedButtons = new Set<number>();
    const newActivatedAxes = new Set<number>();

    buttons.forEach((button, index) => {
      if (button.pressed) {
        newPressedButtons.add(index);

        if (listeningMode === 'source' && selectedSourceType === 'button') {
          setSelectedSourceIndex(index);
        } else if (listeningMode === 'target' && selectedTargetType === 'button') {
          setSelectedTargetIndex(index);
        }
      }
    });

    const AXIS_THRESHOLD = 0.5;
    axes.forEach((value, index) => {
      if (Math.abs(value) > AXIS_THRESHOLD) {
        newActivatedAxes.add(index);

        if (listeningMode === 'source' && selectedSourceType === 'axis') {
          setSelectedSourceIndex(index);
        } else if (listeningMode === 'target' && selectedTargetType === 'axis') {
          setSelectedTargetIndex(index);
        }
      }
    });

    setPressedButtons(newPressedButtons);
    setActivatedAxes(newActivatedAxes);
  }, [buttons, axes, listeningMode, selectedSourceType, selectedTargetType]);

  useEffect(() => {
    if (listeningMode === 'source' && selectedSourceIndex !== null) {
      setListeningMode(null);
    } else if (listeningMode === 'target' && selectedTargetIndex !== null) {
      setListeningMode(null);
    }
  }, [selectedSourceIndex, selectedTargetIndex, listeningMode]);

  const handleAddMapping = () => {
    if (selectedSourceIndex === null || selectedTargetIndex === null) return;

    if (selectedSourceType === 'button' && selectedTargetType === 'button') {
      onAddButtonMapping(gamepadIndex, selectedSourceIndex, selectedTargetIndex);
    } else if (selectedSourceType === 'axis' && selectedTargetType === 'axis') {
      onAddAxisMapping(gamepadIndex, selectedSourceIndex, selectedTargetIndex, invertAxis);
    }

    setSelectedSourceIndex(null);
    setSelectedTargetIndex(null);
    setInvertAxis(false);
  };

  const handleRemoveMapping = () => {
    if (selectedSourceIndex === null || selectedTargetIndex === null) return;

    if (selectedSourceType === 'button' && selectedTargetType === 'button') {
      onRemoveButtonMapping(gamepadIndex, selectedSourceIndex, selectedTargetIndex);
    } else if (selectedSourceType === 'axis' && selectedTargetType === 'axis') {
      onRemoveAxisMapping(gamepadIndex, selectedSourceIndex, selectedTargetIndex);
    }

    setSelectedSourceIndex(null);
    setSelectedTargetIndex(null);
    setInvertAxis(false);
  };

  return (
    <div className="remapping-controls">
      <h3>Controller {gamepadIndex + 1} Remapping</h3>

      <div className="mapping-section">
        <div className="mapping-column">
          <h4>Source</h4>
          <div className="input-group">
            <label>
              Type:
              <select
                value={selectedSourceType}
                onChange={e => {
                  setSelectedSourceType(e.target.value as 'button' | 'axis');
                  setSelectedSourceIndex(null);
                }}
              >
                <option value="button">Button</option>
                <option value="axis">Axis</option>
              </select>
            </label>
          </div>

          <div className="input-group">
            <div className="input-with-button">
              <label>
                {selectedSourceType === 'button' ? 'Button' : 'Axis'}:
                <select
                  value={selectedSourceIndex ?? ''}
                  onChange={e => setSelectedSourceIndex(e.target.value ? parseInt(e.target.value) : null)}
                >
                  <option value="">Select {selectedSourceType}</option>
                  {Array.from({ length: selectedSourceType === 'button' ? buttons.length : axes.length }).map((_, i) => (
                    <option key={i} value={i}>
                      {selectedSourceType === 'button'
                        ? `${getButtonName(i)} (${i})`
                        : `${getAxisName(i)} (${i})`}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="listen-button"
                onClick={() => {
                  setListeningMode('source');
                  setSelectedSourceIndex(null);
                }}
              >
                Press to select
              </button>
            </div>

            {selectedSourceType === 'button' && pressedButtons.size > 0 && (
              <div className="pressed-buttons">
                <span>Pressed: </span>
                {Array.from(pressedButtons).map((buttonIndex) => (
                  <span key={buttonIndex} className="pressed-button" onClick={() => setSelectedSourceIndex(buttonIndex)}>
                    {getButtonName(buttonIndex)} ({buttonIndex})
                  </span>
                ))}
              </div>
            )}

            {selectedSourceType === 'axis' && activatedAxes.size > 0 && (
              <div className="activated-axes">
                <span>Active: </span>
                {Array.from(activatedAxes).map((axisIndex) => (
                  <span key={axisIndex} className="activated-axis" onClick={() => setSelectedSourceIndex(axisIndex)}>
                    {getAxisName(axisIndex)} ({axisIndex}: {axes[axisIndex].toFixed(2)})
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mapping-arrow">➡️</div>

        <div className="mapping-column">
          <h4>Target</h4>
          <div className="input-group">
            <label>
              Type:
              <select
                value={selectedTargetType}
                onChange={e => {
                  setSelectedTargetType(e.target.value as 'button' | 'axis');
                  setSelectedTargetIndex(null);
                }}
              >
                <option value="button">Button</option>
                <option value="axis">Axis</option>
              </select>
            </label>
          </div>

          <div className="input-group">
            <div className="input-with-button">
              <label>
                {selectedTargetType === 'button' ? 'Button' : 'Axis'}:
                <select
                  value={selectedTargetIndex ?? ''}
                  onChange={e => setSelectedTargetIndex(e.target.value ? parseInt(e.target.value) : null)}
                >
                  <option value="">Select {selectedTargetType}</option>
                  {Array.from({ length: selectedTargetType === 'button' ? buttons.length : axes.length }).map((_, i) => (
                    <option key={i} value={i}>
                      {selectedTargetType === 'button'
                        ? `${getButtonName(i)} (${i})`
                        : `${getAxisName(i)} (${i})`}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="listen-button"
                onClick={() => {
                  setListeningMode('target');
                  setSelectedTargetIndex(null);
                }}
              >
                Press to select
              </button>
            </div>

            {selectedTargetType === 'button' && pressedButtons.size > 0 && (
              <div className="pressed-buttons">
                <span>Pressed: </span>
                {Array.from(pressedButtons).map((buttonIndex) => (
                  <span key={buttonIndex} className="pressed-button" onClick={() => setSelectedTargetIndex(buttonIndex)}>
                    {getButtonName(buttonIndex)} ({buttonIndex})
                  </span>
                ))}
              </div>
            )}

            {selectedTargetType === 'axis' && activatedAxes.size > 0 && (
              <div className="activated-axes">
                <span>Active: </span>
                {Array.from(activatedAxes).map((axisIndex) => (
                  <span key={axisIndex} className="activated-axis" onClick={() => setSelectedTargetIndex(axisIndex)}>
                    {getAxisName(axisIndex)} ({axisIndex}: {axes[axisIndex].toFixed(2)})
                  </span>
                ))}
              </div>
            )}
          </div>

          {selectedSourceType === 'axis' && selectedTargetType === 'axis' && (
            <div className="input-group">
              <label>
                <input
                  type="checkbox"
                  checked={invertAxis}
                  onChange={e => setInvertAxis(e.target.checked)}
                />
                Invert Axis
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="actions">
        <button
          onClick={handleAddMapping}
          disabled={selectedSourceIndex === null || selectedTargetIndex === null || selectedSourceType !== selectedTargetType}
          className="action-button"
        >
          Add Mapping
        </button>
        <button
          onClick={handleRemoveMapping}
          disabled={selectedSourceIndex === null || selectedTargetIndex === null || selectedSourceType !== selectedTargetType}
          className="action-button"
        >
          Remove Mapping
        </button>
        <button
          onClick={() => onClearMappings(gamepadIndex)}
          className="action-button"
        >
          Clear All Mappings
        </button>
      </div>

      {listeningMode && (
        <div className="listening-indicator">
          Listening for {listeningMode === 'source' ? 'source' : 'target'} input...
          <button onClick={() => setListeningMode(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};
