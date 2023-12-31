import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface Preset {
  id: string
  name: string
  description: string
}

const presets: Preset[] = []

interface State {
  presetList: Preset[]
}

interface Action {
  add: (item: Preset) => void
}

export const usePresetStore = create(
  persist<State & Action>(
    (set, get) => ({
      presetList: presets,
      add: (item) => set({ presetList: [...get().presetList, item] }),
    }),
    {
      name: 'preset', // unique name
      storage: createJSONStorage(() => sessionStorage),
      version: 1
    }
  )
)
