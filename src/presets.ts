export interface AnimationPreset {
  bounce: number
  spring: boolean
}

export const animationPresets = {
  smooth: { bounce: 0.1, spring: true },
  bouncy: { bounce: 0.6, spring: true },
  subtle: { bounce: 0.05, spring: true },
  snappy: { bounce: 0.4, spring: true },
} as const satisfies Record<string, AnimationPreset>

export type AnimationPresetName = keyof typeof animationPresets
