export type GamepadButton = {
  pressed: boolean
  value: number
}

export type GamepadAxes = [number, number, number, number]

export type GamepadState = {
  id: string
  buttons: GamepadButton[]
  axes: GamepadAxes
  connected: boolean
  timestamp: number
  selectedType: ControllerType
}

export const XBOX_BUTTON_NAMES: Record<number, string> = {
  0: 'A',
  1: 'B',
  2: 'X',
  3: 'Y',
  4: 'LB',
  5: 'RB',
  6: 'LT',
  7: 'RT',
  8: 'Back',
  9: 'Start',
  10: 'LS',
  11: 'RS',
  12: 'DPad Up',
  13: 'DPad Down',
  14: 'DPad Left',
  15: 'DPad Right',
  16: 'Guide'
}

export const XBOX_AXIS_NAMES: Record<number, string> = {
  0: 'Left Stick X',
  1: 'Left Stick Y',
  2: 'Right Stick X',
  3: 'Right Stick Y'
}

export const getButtonName = (index: number, controllerType = 'xbox'): string => {
  if (controllerType === 'xbox' && index in XBOX_BUTTON_NAMES) {
    return XBOX_BUTTON_NAMES[index]
  }
  return `Button ${index}`
}

export const getAxisName = (index: number, controllerType = 'xbox'): string => {
  if (controllerType === 'xbox' && index in XBOX_AXIS_NAMES) {
    return XBOX_AXIS_NAMES[index]
  }
  return `Axis ${index}`
}
