export type ControllerType = 'xbox' | 'playstation' | 'nintendo' | 'generic'

export const detectControllerType = (id: string): ControllerType => {
  const lowerId = id.toLowerCase()
  if (lowerId.includes('xbox') || lowerId.includes('microsoft')) return 'xbox'
  if (lowerId.includes('playstation') || lowerId.includes('ps4') || lowerId.includes('ps5')) return 'playstation'
  if (lowerId.includes('nintendo') || lowerId.includes('switch') || lowerId.includes('pro controller')) return 'nintendo'
  return 'generic'
}
