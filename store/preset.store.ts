import { create } from 'zustand'
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware'

interface Preset {
  id: string
  name: string
  description: string
}

const presets: Preset[] = [
  {
    id: "9cb0e66a-9937-465d-a188-2c4c4ae2401f",
    name: "Grammatical Standard English",
    description: 'build in'
  },
]

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
    }
  )
)
