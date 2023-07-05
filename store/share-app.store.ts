import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface Confing {
  apiKey: string
  mode: string
  systemPrompt: string
  model: string
  temperature: number
  maxLength: number
  topP: number
}

const presets: Map<string, Confing> = new Map()

interface State {
  appConfig: Map<string, Confing>
}

interface Action {
}

export const useShareConfigStore = create(
  persist<State & Action>(
    (set, get) => ({
      appConfig: presets,
    }),
    {
      name: 'preset', // unique name
      storage: createJSONStorage(() => sessionStorage),
      version: 1
    }
  )
)
