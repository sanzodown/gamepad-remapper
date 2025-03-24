export interface ButtonMapping {
  sourceButtonIndex: number;
  targetButtonIndex: number;
}

export interface AxisMapping {
  sourceAxisIndex: number;
  targetAxisIndex: number;
  invert?: boolean;
}

export interface GamepadMapping {
  buttonMappings: ButtonMapping[];
  axisMappings: AxisMapping[];
}

export type GamepadMappings = Record<number, GamepadMapping>;
