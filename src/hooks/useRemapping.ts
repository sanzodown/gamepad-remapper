import { useState } from 'react';
import { GamepadButton } from '../types/gamepad';
import { ButtonMapping, AxisMapping, GamepadMapping, GamepadMappings } from '../types/remapping';

export const useRemapping = () => {
  const [mappings, setMappings] = useState<GamepadMappings>({});

  const addButtonMapping = (gamepadIndex: number, sourceIndex: number, targetIndex: number) => {
    setMappings(prevMappings => {
      const gamepadMapping = prevMappings[gamepadIndex] || { buttonMappings: [], axisMappings: [] };

      // Remove any existing mappings for the target button
      const filteredButtonMappings = gamepadMapping.buttonMappings.filter(
        mapping => mapping.targetButtonIndex !== targetIndex
      );

      return {
        ...prevMappings,
        [gamepadIndex]: {
          ...gamepadMapping,
          buttonMappings: [
            ...filteredButtonMappings,
            { sourceButtonIndex: sourceIndex, targetButtonIndex: targetIndex }
          ]
        }
      };
    });
  };

  const removeButtonMapping = (gamepadIndex: number, sourceIndex: number, targetIndex: number) => {
    setMappings(prevMappings => {
      const gamepadMapping = prevMappings[gamepadIndex];
      if (!gamepadMapping) return prevMappings;

      return {
        ...prevMappings,
        [gamepadIndex]: {
          ...gamepadMapping,
          buttonMappings: gamepadMapping.buttonMappings.filter(
            mapping => !(mapping.sourceButtonIndex === sourceIndex && mapping.targetButtonIndex === targetIndex)
          )
        }
      };
    });
  };

  const addAxisMapping = (gamepadIndex: number, sourceIndex: number, targetIndex: number, invert = false) => {
    setMappings(prevMappings => {
      const gamepadMapping = prevMappings[gamepadIndex] || { buttonMappings: [], axisMappings: [] };

      // Remove any existing mappings for the target axis
      const filteredAxisMappings = gamepadMapping.axisMappings.filter(
        mapping => mapping.targetAxisIndex !== targetIndex
      );

      return {
        ...prevMappings,
        [gamepadIndex]: {
          ...gamepadMapping,
          axisMappings: [
            ...filteredAxisMappings,
            { sourceAxisIndex: sourceIndex, targetAxisIndex: targetIndex, invert }
          ]
        }
      };
    });
  };

  const removeAxisMapping = (gamepadIndex: number, sourceIndex: number, targetIndex: number) => {
    setMappings(prevMappings => {
      const gamepadMapping = prevMappings[gamepadIndex];
      if (!gamepadMapping) return prevMappings;

      return {
        ...prevMappings,
        [gamepadIndex]: {
          ...gamepadMapping,
          axisMappings: gamepadMapping.axisMappings.filter(
            mapping => !(mapping.sourceAxisIndex === sourceIndex && mapping.targetAxisIndex === targetIndex)
          )
        }
      };
    });
  };

  const clearMappings = (gamepadIndex: number) => {
    setMappings(prevMappings => {
      const newMappings = { ...prevMappings };
      delete newMappings[gamepadIndex];
      return newMappings;
    });
  };

  const applyMappings = (
    gamepadIndex: number,
    originalButtons: GamepadButton[],
    originalAxes: number[]
  ): { remappedButtons: GamepadButton[], remappedAxes: number[] } => {
    const gamepadMapping = mappings[gamepadIndex];

    // Create remapped arrays starting with all buttons unpressed and axes at 0
    const remappedButtons: GamepadButton[] = originalButtons.map(() => ({
      pressed: false,
      value: 0
    }));

    const remappedAxes: number[] = originalAxes.map(() => 0);

    if (!gamepadMapping) {
      // If no mappings, make remapped view identical to original
      return {
        remappedButtons: [...originalButtons],
        remappedAxes: [...originalAxes]
      };
    }

    // Apply button mappings
    for (const mapping of gamepadMapping.buttonMappings) {
      if (
        mapping.sourceButtonIndex < originalButtons.length &&
        mapping.targetButtonIndex < remappedButtons.length
      ) {
        // Copy the source button's state to the target button
        remappedButtons[mapping.targetButtonIndex] = {
          pressed: originalButtons[mapping.sourceButtonIndex].pressed,
          value: originalButtons[mapping.sourceButtonIndex].value
        };
      }
    }

    // Apply axis mappings
    for (const mapping of gamepadMapping.axisMappings) {
      if (
        mapping.sourceAxisIndex < originalAxes.length &&
        mapping.targetAxisIndex < remappedAxes.length
      ) {
        remappedAxes[mapping.targetAxisIndex] = mapping.invert
          ? -originalAxes[mapping.sourceAxisIndex]
          : originalAxes[mapping.sourceAxisIndex];
      }
    }

    return { remappedButtons, remappedAxes };
  };

  return {
    mappings,
    addButtonMapping,
    removeButtonMapping,
    addAxisMapping,
    removeAxisMapping,
    clearMappings,
    applyMappings
  };
};
